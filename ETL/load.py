from extraction import extract_website_data
from router import build_routing_map
from transformation import clean_and_format_for_ai
from analyzer import analyze_company
from email_generator import generate_email
import json

if __name__ == "__main__":
    target_company_url = 'https://www.indorama.co.id/'

    # Step 1: Extract
    raw_data = extract_website_data(target_company_url, max_pages=20)

    # Step 2: Route
    routing_map = build_routing_map(raw_data, target_company_url)

    # Step 3: Transform
    ai_ready_data = clean_and_format_for_ai(raw_data, routing_map)

    # Step 4: Save ETL output
    with open('ai_ready_payload.json', 'w', encoding='utf-8') as f:
        json.dump(ai_ready_data, f, indent=4)
    print("\nâœ… ETL Pipeline complete! JSON saved.")

    # Step 5: Analyze
    analysis = analyze_company(ai_ready_data)
    with open('analysis_output.json', 'w', encoding='utf-8') as f:
        json.dump(analysis, f, indent=4)
    print("\nâœ… Analysis complete! Check 'analysis_output.json'.")

    # Step 6: Generate Email
    email_path, subject = generate_email(analysis)

    print(f"\nâœ… Full pipeline complete!")
    print(f"   Email saved: {email_path}")
    print(f"   Subject: {subject}")
