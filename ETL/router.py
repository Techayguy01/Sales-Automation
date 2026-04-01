import json
import os
import requests
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

# ==========================================
# CONFIG
# ==========================================
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
MODEL        = "llama-3.1-8b-instant"

# ==========================================
# CLOSED SET — Only valid bucket names
# ==========================================
VALID_BUCKETS = {"core_services", "business_context", "company_elevator_pitch", "drop"}

# ==========================================
# TIER 1 KEYWORD MAP — Fast deterministic pass
# Expand here as you discover new URL patterns
# ==========================================
KEYWORD_MAP = {
    "core_services":    ["service", "solution", "product", "offering"],
    "business_context": ["about", "case", "client", "portfolio",
                         "testimonial", "partner", "team", "story", "founder"],
    "drop":             ["faq", "404", "error", "tag", "category"]
}


# ==========================================
# STAGE 1 — KEYWORD PASS
# ==========================================
def _keyword_pass(url, start_netloc):
    """
    Free deterministic routing.
    Returns a bucket name if matched, None if unmatched.
    """
    parsed = urlparse(url)
    path   = parsed.path.strip('/').lower()

    # Homepage check — path must be empty or a known homepage alias
    if parsed.netloc.lower() == start_netloc and path in ("", "home", "index", "index.html", "home.html"):
        return "company_elevator_pitch"

    # Keyword check
    for bucket, keywords in KEYWORD_MAP.items():
        if any(kw in path for kw in keywords):
            return bucket

    return None  # Unmatched — goes to LLM queue


# ==========================================
# STAGE 2 — LLM PROMPT BUILDER
# ==========================================
def _build_llm_prompt(unmatched_pages):
    """
    Builds one single batch prompt for all unmatched pages.
    Sends only URL + meta + headings — not full content.
    """
    page_blocks = []

    for url, page_data in unmatched_pages.items():
        meta     = page_data.get("meta_description", "").strip()
        headings = " | ".join(page_data.get("headings", [])[:5])  # Top 5 headings only
        block    = f"URL: {url}\nMeta: {meta}\nHeadings: {headings}"
        page_blocks.append(block)

    pages_text = "\n---\n".join(page_blocks)

    prompt = f"""You are a web page classifier for a B2B sales intelligence system.

Classify each page below into exactly one of these buckets:
- company_elevator_pitch : The homepage. What the company does at a glance.
- core_services          : Pages describing what the company sells or offers.
- business_context       : Pages about who they are — story, clients, team, case studies.
- drop                   : Pages with no business signal — FAQs, errors, pagination, legal.

Rules:
- Use only the four bucket names above. No other values are allowed.
- Every URL must get exactly one bucket.
- Respond ONLY with a valid JSON object. No explanation. No markdown. No preamble.

Output format:
{{
  "url": {{"bucket": "bucket_name", "reason": "one short sentence"}}
}}

Pages to classify:
{pages_text}"""

    return prompt


# ==========================================
# STAGE 2 — GROQ CALL
# ==========================================
def _llm_pass(unmatched_pages):
    """
    Single batch Groq call for all unmatched pages.
    Returns a partial routing map for these pages.
    """
    if not unmatched_pages:
        return {}

    print(f"\n[Router] Sending {len(unmatched_pages)} unmatched page(s) to Groq...")

    prompt = _build_llm_prompt(unmatched_pages)

    try:
        response = requests.post(GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type":  "application/json"
            },
            json={
                "model":       MODEL,
                "messages":    [
                    {
                        "role":    "system",
                        "content": "You are a web page classifier. Respond ONLY with valid JSON. No explanation. No markdown. No preamble."
                    },
                    {
                        "role":    "user",
                        "content": prompt
                    }
                ],
                "temperature": 0
            },
            timeout=30
        )

        raw_text = response.json()["choices"][0]["message"]["content"].strip()

        # Strip markdown fences if model ignores instructions
        if raw_text.startswith("```"):
            raw_text = raw_text.strip("```").strip()
            if raw_text.startswith("json"):
                raw_text = raw_text[4:].strip()

        llm_result = json.loads(raw_text)

    except json.JSONDecodeError:
        print(f"  [Warning] Groq returned malformed JSON — dropping all {len(unmatched_pages)} unmatched pages")
        return {}
    except Exception as e:
        print(f"  [Warning] Groq call failed: {e} — dropping all unmatched pages")
        return {}

    # ==========================================
    # VALIDATE — Enforce closed bucket set
    # ==========================================
    partial_routing_map = {}

    for url, result in llm_result.items():
        bucket = result.get("bucket", "")
        reason = result.get("reason", "")

        if bucket not in VALID_BUCKETS:
            print(f"  [Warning] Groq returned invalid bucket '{bucket}' for {url} — dropping page")
            continue

        print(f"  [LLM Routed] {url} → {bucket} | Reason: {reason}")
        partial_routing_map[url] = bucket

    return partial_routing_map


# ==========================================
# PUBLIC INTERFACE — Called by load.py
# ==========================================
def build_routing_map(raw_site_data, start_url):
    """
    Entry point for load.py.
    Returns a complete url → bucket map for every page.
    """
    print("\n[Router] Building routing map...")

    start_netloc    = urlparse(start_url).netloc.lower()
    routing_map     = {}
    unmatched_pages = {}

    # Stage 1 — Keyword pass
    for url, page_data in raw_site_data.items():
        bucket = _keyword_pass(url, start_netloc)

        if bucket:
            print(f"  [Keyword Routed] {url} → {bucket}")
            routing_map[url] = bucket
        else:
            unmatched_pages[url] = page_data

    print(f"\n[Router] Keyword pass complete — {len(routing_map)} matched, {len(unmatched_pages)} sent to Groq")

    # Stage 2 — LLM batch pass
    llm_routing = _llm_pass(unmatched_pages)
    routing_map.update(llm_routing)

    print(f"[Router] Routing complete — {len(routing_map)} total pages routed\n")
    return routing_map


