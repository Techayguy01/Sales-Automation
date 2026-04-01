import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
ANALYZER_MODEL = "llama-3.3-70b-versatile"

AARKAY_CONTEXT = """
You are a B2B sales analyst working for ATC Group â€” a technology solutions company.

ATC Group builds custom technology solutions for businesses across all industries.
ATC specializes in:
- Custom Web Applications and Portals
- Android Mobile Applications
- AI-powered automation and intelligence solutions
- Barcode, RFID, and AIDC solutions
- ERP integration (Tally, SAP, legacy systems)
- Warehouse Management Systems (WMS)
- Production line automation and traceability

ATC works with companies across ALL industries â€” Manufacturing, Retail,
Healthcare, Logistics, Education, Finance, Real Estate, Hospitality,
and any business that needs technology to solve operational problems.

ATC solves these types of problems for any business:
- Manual processes that should be automated
- No real-time visibility into operations
- Disconnected systems not talking to each other
- No mobile access for field teams or staff
- Paper-based workflows slowing down the business
- No data analytics or reporting on business performance

Past client wins:
- Haldiram's packaging automation (2012)
- Mahindra & Mahindra tractor integration (2015)
- Fabric inspection system â€” 30-40 percent efficiency gain (2018)
- Hindalco smart inventory (2024)

Your job is to analyze ANY prospect company from ANY industry and identify
if they are a good fit for ATC's technology solutions.
"""


def analyze_company(ai_ready_payload):
    """Module 4: Sends cleaned payload to Groq and returns structured company analysis."""
    print("\n[Analyzer] Sending payload to Groq...")

    prompt = f"""

{AARKAY_CONTEXT}
You are a B2B sales analyst for Aarkay Techno Consultants.

COMPANY DATA:
Elevator Pitch: {ai_ready_payload.get('company_elevator_pitch')}
Core Services: {ai_ready_payload.get('core_services')}
Business Context: {ai_ready_payload.get('business_context')}

STRICT RULES â€” violations are not acceptable:
1. Every pain point MUST quote or reference a specific fact 
   from the company data above.
   BAD:  "Inventory management"
   GOOD: "428,000 spindles across two plant locations suggests 
          complex WIP tracking across production stages"

2. pain_points must be inferred from evidence, not invented.
   If you cannot find evidence for a pain point, do not include it.

3. our_angle must reference a specific ATC case study:
   - Haldiram's packaging automation (2012)
   - Mahindra 180 variants integration (2015)
   - Hindalco smart inventory (2024)
   Pick the most relevant one. Do not mention all three.

4. personalized_line must contain at least one specific fact 
   about this company â€” a number, a location, a product name.
   BAD:  "You likely have opportunities to improve efficiency"
   GOOD: "Managing traceability across 428,000 spindles and 
          exports to 70 countries is exactly the scale where 
          our barcode and RFID systems deliver the most value"

5. email_subject_suggestion must be specific to this company.
   BAD:  "Boost Efficiency in Your Manufacturing Operations"
   GOOD: "Real-time traceability across Indorama's Purwakarta operations"

Return ONLY this JSON â€” no explanation, no markdown:
{{
  "company_name": "...",
  "what_they_do": "one sentence, specific",
  "industry": "...",
  "fit_score": "high or medium or low",
  "fit_reason": "one sentence why",
  "evidence": [
    "specific fact 1 observed in scraped data",
    "specific fact 2 observed in scraped data"
  ],
  "pain_points": [
    "pain point tied to specific evidence",
    "pain point tied to specific evidence"
  ],
  "our_angle": "specific reference to one ATC case study and why it's relevant",
  "personalized_line": "one sentence with a specific company fact",
  "email_subject_suggestion": "specific subject line"
}}
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": ANALYZER_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
    }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=body,
            timeout=30
        )
        response.raise_for_status()

        raw_text = response.json()["choices"][0]["message"]["content"].strip()

        # Strip markdown code fences if model wraps response anyway
        clean_text = re.sub(r"```(?:json)?|```", "", raw_text).strip()

        analysis = json.loads(clean_text)
        print(f"[Analyzer] Done. Fit score: {analysis.get('fit_score', 'unknown').upper()}")
        return analysis

    except json.JSONDecodeError:
        print("[Analyzer] WARNING: Model returned non-JSON. Raw response saved.")
        return {"error": "JSON parse failed", "raw": raw_text}

    except Exception as e:
        print(f"[Analyzer] ERROR: {e}")
        return {"error": str(e)}
