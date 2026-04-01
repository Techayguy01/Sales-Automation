from playwright.sync_api import sync_playwright
from urllib.parse import urljoin, urlparse
import heapq
import os

BLOCKLIST = [
    'privacy', 'terms', 'shipping', 'refund', 'sitemap',
    'gallery', 'quick-links', 'cookie', 'policy', 'login',
    'warranty',                          # Legal dead-zone
    '/product-category', '/tag', 'add-to-cart'
]

def get_url_score(url):
    """Calculates priority score: Base Tier + Proportional Depth Penalty"""
    path = urlparse(url).path.lower()

    # FIX 2: Root-level long slugs are blog posts, not product pages
    # A real product page lives under /product/ — blog posts sit directly under /
    # e.g. /wifi-bullet-camera-best-outdoor-surveillance-solution-in-2026/ → score 50
    # e.g. /product/trueclick/ → scores normally → 12
    segments = path.strip('/').split('/')
    is_root_level = len(segments) == 1
    is_long_slug  = len(segments[0]) > 40

    if is_root_level and is_long_slug:
        return 50  # Demote — almost certainly a blog post

    if any(kw in path for kw in ['about', 'service', 'solution', 'product']):
        base_score = 10
    elif any(kw in path for kw in ['client', 'case', 'portfolio', 'testimonial', 'partner']):
        base_score = 20
    elif any(kw in path for kw in ['career', 'job', 'hiring']):
        base_score = 30
    elif any(kw in path for kw in ['contact', 'team', 'blog', 'news', 'pricing']):
        base_score = 40
    else:
        base_score = 50

    depth   = path.strip('/').count('/')
    penalty = depth * 2
    return base_score + penalty

def extract_website_data(start_url, max_pages=12):
    """Crawls the website using a heuristic priority queue."""
    target_domain = urlparse(start_url).netloc
    visited_urls  = set()
    in_queue      = {start_url}
    site_data     = {}

    os.makedirs('scrape-image', exist_ok=True)

    pq = []
    discovery_counter = 0
    heapq.heappush(pq, (0, discovery_counter, start_url))

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080}
        )
        page = context.new_page()

        while pq and len(visited_urls) < max_pages:
            current_score, _, current_url = heapq.heappop(pq)

            if current_url in visited_urls:
                continue

            print(f"[Scraping] [Score: {current_score}] {current_url}")
            visited_urls.add(current_url)

            try:
                page.goto(current_url, timeout=45000, wait_until="domcontentloaded")

                safe_path = urlparse(current_url).path.replace('/', '_').strip('_') or "home"
                page.screenshot(path=f'scrape-image/example_{safe_path}.png')

                # ==========================================
                # FIX 1: HARVEST LINKS & META BEFORE DOM CLEANING
                # ==========================================
                meta_desc = page.evaluate("""() => {
                    const meta = document.querySelector('meta[name="description"]');
                    return meta ? meta.content : "";
                }""")

                hrefs = page.evaluate("() => Array.from(document.querySelectorAll('a')).map(a => a.href)")
                for href in hrefs:
                    full_url  = urljoin(current_url, href).split('#')[0]
                    parsed_url = urlparse(full_url)
                    url_clean  = full_url.lower()

                    if (parsed_url.netloc == target_domain and
                        full_url not in visited_urls and
                        full_url not in in_queue and
                        not url_clean.endswith(('.pdf', '.png', '.jpg', '.zip', '.mp4')) and
                        not any(b in url_clean for b in BLOCKLIST)):

                        discovery_counter += 1
                        score = get_url_score(full_url)
                        in_queue.add(full_url)
                        heapq.heappush(pq, (score, discovery_counter, full_url))

                # ==========================================
                # 2. DOM CLEANING
                # ==========================================
                page.evaluate("""() => {
                    const junk = document.querySelectorAll('nav, footer, header, aside, script, style, noscript');
                    junk.forEach(el => el.remove());
                }""")

                # ==========================================
                # 3. STRUCTURED EXTRACTION
                # ==========================================
                raw_headings   = page.locator('h1, h2, h3').all_inner_texts()
                raw_paragraphs = page.locator('p, li').all_inner_texts()

                clean_headings = [h.strip() for h in raw_headings if len(h.strip()) > 3]
                clean_content  = [p.strip() for p in raw_paragraphs if len(p.strip()) > 20]

                site_data[current_url] = {
                    "meta_description": meta_desc.strip(),
                    "headings":         clean_headings,
                    "content":          " ".join(clean_content)
                }

            except Exception as e:
                print(f"[Error] Skipping {current_url}: {e}")

        browser.close()
        return site_data