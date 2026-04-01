import os
import re
import requests
from html import escape
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY   = os.environ.get("GROQ_API_KEY")
EMAIL_MODEL    = "llama-3.3-70b-versatile"

# ============================================================
# SWAP THESE OUT AFTER MANAGER MEETING
# ============================================================
DIRECTOR_YOUTUBE_URL  = "https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
ATC_WEBSITE           = "https://www.atcgroup.co.in"
ATC_LOGO_URL          = "https://www.atcgroup.co.in/assets/aarkay-logo-Cmuxygmp.png"
ATC_SOCIAL_MEDIA_URL  = "https://www.linkedin.com/company/atcgroup"
ATC_BOOK_CALL_URL     = "https://www.atcgroup.co.in/contact"
SENDER_NAME           = "Sales Team"
SENDER_TITLE          = "Business Development, ATC Group"
SENDER_EMAIL          = "sales@atcgroup.co.in"

# ATC services shown in every email — update with manager
ATC_SERVICES = (
    "Web Applications &amp; Portals &nbsp;&middot;&nbsp; "
    "Android Apps for Factory Floors &nbsp;&middot;&nbsp; "
    "AI &amp; Automation Solutions &nbsp;&middot;&nbsp; "
    "Barcode / RFID / AIDC &nbsp;&middot;&nbsp; "
    "ERP Integration (Tally, SAP) &nbsp;&middot;&nbsp; "
    "Warehouse Management Systems"
)
# ============================================================


def _extract_youtube_id(url: str) -> str:
    """Extract YouTube video ID from embed/watch/share URLs."""
    if not url:
        return ""
    match = re.search(
        r"(?:youtube\.com/(?:embed/|watch\?v=)|youtu\.be/)([A-Za-z0-9_-]{6,})",
        url,
    )
    return match.group(1) if match else ""


def generate_email_body(analysis: dict) -> str:
    """Step 1 — Use Groq to write the short personalized email body."""
    print("\n[EmailGen] Generating personalized email content...")

    prompt = f"""
You are a B2B sales writer for ATC Group — a technology company specializing in
web applications, Android apps, AI solutions, barcode/RFID, ERP integration,
and warehouse management for the manufacturing industry.

Write a short, professional, human-sounding email body based on this analysis:

Company     : {analysis.get("company_name")}
What they do: {analysis.get("what_they_do")}
Industry    : {analysis.get("industry")}
Pain Points : {", ".join(analysis.get("pain_points", []))}
Our Angle   : {analysis.get("our_angle")}

Rules:
- Maximum 2 short paragraphs — no more
- First paragraph: one specific observation about their company based on
  what they do and their pain points. Show you know them. No generic openers.
- Second paragraph: one sentence connecting ATC's solution to their situation.
  End with a soft ask — suggest a 20-minute call, no pressure.
- Do NOT use buzzwords like "synergy", "leverage", "game-changer"
- Do NOT mention price
- Do NOT start with "I hope this email finds you well"
- Sound like a human wrote it, not a robot
- Keep total length under 80 words

Return ONLY the 2 paragraphs. No subject line. No greeting. No sign-off.
"""

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type":  "application/json",
            },
            json={
                "model":       EMAIL_MODEL,
                "messages":    [{"role": "user", "content": prompt}],
                "temperature": 0.4,
            },
            timeout=30,
        )
        response.raise_for_status()
        email_text = response.json()["choices"][0]["message"]["content"].strip()
        print("[EmailGen] Email body generated.")
        return email_text

    except Exception as e:
        print(f"[EmailGen] ERROR generating email body: {e}")
        return (
            "We've been following your work in the industry and believe "
            "there's a real opportunity to streamline your operations. "
            "Would a 20-minute call this week make sense?"
        )


def build_html_email(analysis: dict, email_body: str) -> tuple[str, str]:
    """Step 2 — Inject all dynamic content into the HTML template."""

    # ── Pull values from analysis ──────────────────────────────────────
    company_name = analysis.get("company_name", "Your Team")
    industry     = analysis.get("industry", "Manufacturing")
    pain_points  = analysis.get("pain_points", [])
    our_angle    = analysis.get("our_angle", "")
    subject      = analysis.get("email_subject_suggestion", "A Quick Note from ATC Group")

    # ── Safe HTML values ───────────────────────────────────────────────
    company_name_h = escape(company_name)
    industry_h     = escape(industry)
    our_angle_h    = escape(our_angle)
    subject_h      = escape(subject)
    sender_name_h  = escape(SENDER_NAME)
    sender_title_h = escape(SENDER_TITLE)
    sender_email_h = escape(SENDER_EMAIL)

    # Pain points as bullet rows
    pain_rows = "".join([
        f"""<tr>
              <td valign="top" style="padding: 4px 0; font-family: 'DM Sans', Arial, sans-serif;
                  font-size: 14px; line-height: 22px; color: #0a1929;">
                &#8226;&nbsp; {escape(p)}
              </td>
            </tr>"""
        for p in pain_points if p
    ])

    # Email body paragraphs
    paragraphs = [p.strip() for p in email_body.split("\n") if p.strip()]
    body_html  = "".join([
        f'<p style="margin: 0 0 14px 0; font-family: DM Sans, Arial, sans-serif; '
        f'font-size: 15px; line-height: 26px; color: #4a5568;">{escape(p)}</p>'
        for p in paragraphs
    ])

    # YouTube
    yt_id            = _extract_youtube_id(DIRECTOR_YOUTUBE_URL)
    yt_watch_url     = f"https://youtu.be/{yt_id}" if yt_id else ATC_WEBSITE
    yt_thumbnail_url = (
        f"https://img.youtube.com/vi/{yt_id}/maxresdefault.jpg"
        if yt_id
        else "https://placehold.co/520x293/063d52/ffffff?text=Video+Coming+Soon"
    )

    # ── HTML template matching manager's sketch ────────────────────────
    html = f"""<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>{subject_h}</title>

  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@400;600;700&display=swap" rel="stylesheet">

  <style>
    body, p, h1, h2, h3 {{ margin: 0; padding: 0; }}
    body {{
      width: 100% !important;
      background-color: #f4f4f4;
      font-family: 'DM Sans', Arial, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }}
    table, td {{ mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }}
    img {{ border: 0; display: block; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }}
    a {{ text-decoration: none; }}

    @media screen and (max-width: 600px) {{
      .container  {{ width: 100% !important; }}
      .mob-pad    {{ padding-left: 20px !important; padding-right: 20px !important; }}
      .mob-stack  {{ display: block !important; width: 100% !important; }}
      .mob-hide   {{ display: none !important; }}
      .mob-pb20   {{ padding-bottom: 20px !important; }}
    }}
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4;">

  <!-- Preheader -->
  <div style="display:none; font-size:1px; color:#fefefe; line-height:1px;
              max-height:0; max-width:0; opacity:0; overflow:hidden;">
    ATC has automated Haldiram's, Mahindra &amp; Hindalco. Here's why {company_name_h} is next.
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <center style="width:100%; background-color:#f4f4f4;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
         style="background-color:#f4f4f4;">
    <tr><td align="center" valign="top">

      <table role="presentation" border="0" cellpadding="0" cellspacing="0"
             width="600" class="container"
             style="width:100%; max-width:600px; background-color:#ffffff; margin:0 auto;">


        <!-- ══ 1. HEADER — Company name left, Logo right ══ -->
        <tr>
          <td valign="middle"
              style="background-color:#0a1929; border-bottom:3px solid #2ec4a0; padding:20px 30px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" valign="middle" style="padding-right:16px;">
                  <p style="margin:0; font-family:'Syne',Arial,sans-serif; font-size:20px;
                             font-weight:700; color:#ffffff; letter-spacing:0.5px;">
                    {company_name_h}
                  </p>
                  <p style="margin:4px 0 0 0; font-family:'DM Sans',Arial,sans-serif;
                             font-size:12px; color:#b3cdd6;">
                    {industry_h}
                  </p>
                </td>
                <td align="right" valign="middle" width="160">
                  <img src="{escape(ATC_LOGO_URL, quote=True)}"
                       alt="ATC Group" width="140"
                       style="width:140px; max-width:140px; height:auto;">
                </td>
              </tr>
            </table>
          </td>
        </tr>


        <!-- ══ 2. EMAIL BODY ══ -->
        <tr>
          <td align="left" valign="top"
              style="background-color:#ffffff; padding:40px 40px 24px 40px;"
              class="mob-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" valign="top" style="padding-bottom:16px;">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif; font-size:12px;
                             font-weight:700; color:#0e7ea4; text-transform:uppercase; letter-spacing:1px;">
                    WHY WE'RE REACHING OUT
                  </p>
                </td>
              </tr>
              <tr>
                <td align="left" valign="top"
                    style="border-left:4px solid #2ec4a0; padding-left:16px; padding-bottom:24px;">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif; font-size:17px;
                             line-height:28px; font-weight:700; color:#0a1929;">
                    {our_angle_h}
                  </p>
                </td>
              </tr>
              <tr>
                <td align="left" valign="top">
                  {body_html}
                </td>
              </tr>
            </table>
          </td>
        </tr>


        <!-- ══ 3. PAIN POINTS ══ -->
        <tr>
          <td align="left" valign="top"
              style="background-color:#f8fafb; padding:28px 40px;" class="mob-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" valign="top" style="padding-bottom:12px;">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif; font-size:12px;
                             font-weight:700; color:#0e7ea4; text-transform:uppercase; letter-spacing:1px;">
                    PAIN POINTS WE IDENTIFIED
                  </p>
                </td>
              </tr>
              {pain_rows}
            </table>
          </td>
        </tr>


        <!-- ══ 4. OUR SERVICES ══ -->
        <tr>
          <td align="left" valign="top"
              style="background-color:#ffffff; padding:28px 40px;" class="mob-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" valign="top" style="padding-bottom:12px;">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif; font-size:12px;
                             font-weight:700; color:#0e7ea4; text-transform:uppercase; letter-spacing:1px;">
                    OUR SERVICES
                  </p>
                </td>
              </tr>
              <tr>
                <td align="left" valign="top">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif; font-size:14px;
                             line-height:24px; color:#4a5568;">
                    {ATC_SERVICES}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>


        <!-- ══ 5. YOUTUBE VIDEO ══ -->
        <tr>
          <td align="center" valign="top"
              style="background-color:#f8fafb; padding:36px 40px;" class="mob-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" valign="top" style="padding-bottom:14px;">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif; font-size:12px;
                             font-weight:700; color:#063d52; text-transform:uppercase; letter-spacing:1px;">
                    SEE OUR WORK IN 2 MINUTES
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" valign="top" style="padding-bottom:10px;">
                  <a href="{escape(yt_watch_url, quote=True)}" target="_blank"
                     style="text-decoration:none; display:block;">
                    <img src="{escape(yt_thumbnail_url, quote=True)}"
                         alt="Watch our work" width="520"
                         style="width:100%; max-width:520px; height:auto;
                                border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" valign="top">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif;
                             font-size:13px; color:#666666;">
                    &#9654; Click to watch &middot; Opens in YouTube
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>


        <!-- ══ 6. WEBSITE + BOOK CALL — side by side ══ -->
        <tr>
          <td align="center" valign="top"
              style="background-color:#ffffff; padding:32px 40px;" class="mob-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <!-- Website button -->
                <td align="center" valign="middle" width="48%" class="mob-stack mob-pb20">
                  <a href="{escape(ATC_WEBSITE, quote=True)}" target="_blank"
                     style="display:inline-block; padding:13px 24px;
                            font-family:'DM Sans',Arial,sans-serif; font-size:15px;
                            font-weight:700; color:#063d52; text-decoration:none;
                            border:2px solid #063d52; border-radius:4px; width:100%;
                            box-sizing:border-box; text-align:center;">
                    Visit Website
                  </a>
                </td>
                <!-- Spacer -->
                <td width="4%" class="mob-hide" style="font-size:1px; line-height:1px;">&nbsp;</td>
                <!-- Book call button -->
                <td align="center" valign="middle" width="48%" class="mob-stack">
                  <a href="{escape(ATC_BOOK_CALL_URL, quote=True)}" target="_blank"
                     style="display:inline-block; padding:13px 24px;
                            font-family:'DM Sans',Arial,sans-serif; font-size:15px;
                            font-weight:700; color:#ffffff; text-decoration:none;
                            background-color:#2ec4a0; border:2px solid #2ec4a0;
                            border-radius:4px; width:100%;
                            box-sizing:border-box; text-align:center;">
                    Book a Free Demo &rarr;
                  </a>
                </td>
              </tr>
              <tr>
                <td colspan="3" align="center" valign="top" style="padding-top:12px;">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif;
                             font-size:13px; color:#718096;">
                    30 minutes &middot; No commitment &middot; Just clarity
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>


        <!-- ══ 7. SIGNATURE ══ -->
        <tr>
          <td align="left" valign="top"
              style="background-color:#f8fafb; padding:32px 40px;" class="mob-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" valign="top" style="padding-bottom:4px;">
                  <p style="margin:0; font-family:'Syne',Arial,sans-serif; font-size:18px;
                             font-weight:700; color:#0a1929;">
                    {sender_name_h}
                  </p>
                </td>
              </tr>
              <tr>
                <td align="left" valign="top" style="padding-bottom:4px;">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif;
                             font-size:14px; color:#718096;">
                    {sender_title_h}
                  </p>
                </td>
              </tr>
              <tr>
                <td align="left" valign="top">
                  <a href="mailto:{sender_email_h}"
                     style="font-family:'DM Sans',Arial,sans-serif; font-size:14px;
                            font-weight:500; color:#0e7ea4; text-decoration:none;">
                    {sender_email_h}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>


        <!-- ══ 8. FOOTER — Social media + unsubscribe ══ -->
        <tr>
          <td align="center" valign="top"
              style="background-color:#0a1929; padding:28px 40px;" class="mob-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" valign="top" style="padding-bottom:14px;">
                  <a href="{escape(ATC_SOCIAL_MEDIA_URL, quote=True)}" target="_blank"
                     style="font-family:'DM Sans',Arial,sans-serif; font-size:14px;
                            font-weight:700; color:#2ec4a0; text-decoration:none;
                            letter-spacing:1px; text-transform:uppercase;">
                    Follow us on Social Media
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" valign="top" style="padding-bottom:8px;">
                  <p style="margin:0; font-family:'DM Sans',Arial,sans-serif;
                             font-size:12px; color:#b3cdd6;">
                    &copy; 2025 ATC Group. All rights reserved.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" valign="top">
                  <a href="{escape(ATC_WEBSITE, quote=True)}"
                     style="font-family:'DM Sans',Arial,sans-serif; font-size:12px;
                            color:#b3cdd6; text-decoration:underline;">
                    Unsubscribe
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>


      </table><!-- end main container -->
    </td></tr>
  </table>
  </center>
</body>
</html>"""

    return subject, html


def generate_email(analysis: dict) -> tuple[str, str]:
    """Main entry point — called by pipeline.py."""

    # Step 1 — AI writes personalized body
    email_body = generate_email_body(analysis)

    # Step 2 — Inject into HTML template
    subject, html_email = build_html_email(analysis, email_body)

    # Step 3 — Save to same directory as this file
    output_path = os.path.join(os.path.dirname(__file__), "outreach_email.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_email)

    print(f"[EmailGen] Email saved to '{output_path}'")
    print(f"[EmailGen] Suggested subject: {subject}")

    return output_path, subject