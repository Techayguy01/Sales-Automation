import re
from collections import Counter

# FIX 3: WordPress UI artifacts that slip past the 20-char filter
# These are sidebar widgets, comment labels, section headers — not content
CONTENT_STOPLIST = {
    "Search", "Recent", "Leave a comment",
    "Leave a Reply", "Frequently Asked Questions"
}

def clean_and_format_for_ai(raw_site_data, routing_map):
    """
    Module 3: Cleans and buckets pages using routing_map from router.py.
    No keyword logic here — routing is router.py's job.
    """
    print("\n[Transformation] Processing structured data for AI pipeline...")

    # ==========================================
    # 1. BOILERPLATE DETECTION
    # ==========================================
    all_sentences = []
    for page_data in raw_site_data.values():
        content   = page_data.get("content", "")
        sentences = [s.strip() for s in re.split(r'(?<=[.!?]) +', content) if s.strip()]
        all_sentences.extend(sentences)

    sentence_counts       = Counter(all_sentences)
    total_pages           = len(raw_site_data)
    boilerplate_threshold = max(2, int(total_pages * 0.4))
    junk_sentences        = {s for s, count in sentence_counts.items() if count >= boilerplate_threshold}

    # ==========================================
    # 2. SCHEMA & BUDGETS
    # ==========================================
    clean_company_profile = {
        "company_elevator_pitch": "",
        "core_services":          "",
        "business_context":       ""
    }

    BUDGET_ELEVATOR = 1000   # was 500
    BUDGET_SERVICES = 5000   # was 2000
    BUDGET_CONTEXT  = 3000   # was 1000

    # ==========================================
    # 3. FILL BUCKETS
    # ==========================================
    for url, page_data in raw_site_data.items():
        bucket = routing_map.get(url)

        if not bucket or bucket == "drop":
            continue

        # --- CONTENT CLEANING ---
        content        = page_data.get("content", "")
        page_sentences = [s.strip() for s in re.split(r'(?<=[.!?]) +', content) if s.strip()]

        # FIX 3: Strip WordPress UI artifacts before joining
        page_sentences = [s for s in page_sentences if s not in CONTENT_STOPLIST]
        unique_content = " ".join(s for s in page_sentences if s not in junk_sentences)

        # FIX 4: Filter headings — anything over 60 chars is a blog title, not a product heading
        raw_headings   = page_data.get("headings", [])
        clean_headings = [h for h in raw_headings if len(h) <= 60]

        # --- BUCKET FILL ---
        if bucket == "company_elevator_pitch":
            meta         = page_data.get("meta_description", "")
            top_headings = " | ".join(clean_headings[:3])
            pitch_text   = f"Meta: {meta} --- Focus: {top_headings}"
            allowed      = BUDGET_ELEVATOR - len(clean_company_profile["company_elevator_pitch"])
            if allowed > 0:
                clean_company_profile["company_elevator_pitch"] += pitch_text[:allowed]

        elif bucket == "core_services":
            headings      = ", ".join(clean_headings)
            services_text = f"[{headings}] {unique_content} "
            allowed       = BUDGET_SERVICES - len(clean_company_profile["core_services"])
            if allowed > 0:
                clean_company_profile["core_services"] += services_text[:allowed]
            else:
                print(f"  [Budget Full] core_services saturated, skipping: {url}")

        elif bucket == "business_context":
            context_text = f"{unique_content} "
            allowed      = BUDGET_CONTEXT - len(clean_company_profile["business_context"])
            if allowed > 0:
                clean_company_profile["business_context"] += context_text[:allowed]
            else:
                print(f"  [Budget Full] business_context saturated, skipping: {url}")

    for key in clean_company_profile:
        clean_company_profile[key] = clean_company_profile[key].strip()

    return clean_company_profile