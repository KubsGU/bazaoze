import json
import re
import urllib.parse
import urllib.request
from pathlib import Path


BASE = "https://www.bazaoze.com"
ROOT = f"{BASE}/"


def fetch(url: str) -> str:
    with urllib.request.urlopen(url, timeout=30) as resp:
        return resp.read().decode("utf-8", "ignore")


def abs_url(href: str) -> str:
    return urllib.parse.urljoin(ROOT, href)


def extract_urls(html: str) -> list[str]:
    hrefs = re.findall(r'href="([^"]+)"', html)
    srcs = re.findall(r'src="([^"]+)"', html)
    return [*hrefs, *srcs]


def main() -> None:
    out_dir = Path("data")
    out_dir.mkdir(exist_ok=True)

    homepage = fetch(ROOT)
    (out_dir / "homepage.html").write_text(homepage, encoding="utf-8")

    discovered = set()
    for u in extract_urls(homepage):
        if u.startswith("http"):
            if "bazaoze.com" in u:
                discovered.add(u)
        else:
            discovered.add(abs_url(u))

    # Try common SPA routes likely used by Angular app
    candidate_routes = [
        "/",
        "/offer",
        "/offerInside",
        "/portfolio",
        "/contact",
        "/blog",
        "/about",
    ]
    for r in candidate_routes:
        discovered.add(abs_url(r))

    pages = {}
    for u in sorted(discovered):
        try:
            pages[u] = fetch(u)
        except Exception:
            continue

    bundle_urls = set()
    for _, html in pages.items():
        for src in re.findall(r'src="([^"]+\.js)"', html):
            bundle_urls.add(abs_url(src))
        for href in re.findall(r'href="([^"]+\.css)"', html):
            bundle_urls.add(abs_url(href))

    bundles = {}
    for u in sorted(bundle_urls):
        try:
            bundles[u] = fetch(u)
        except Exception:
            continue

    image_paths = set()
    routes = set()
    strings = set()
    for content in bundles.values():
        for p in re.findall(r"assets/images/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)", content):
            image_paths.add(p)
        for p in re.findall(r'"/[a-zA-Z][a-zA-Z0-9_-]{1,40}"', content):
            routes.add(p.strip('"'))
        for s in re.findall(r'"([^"\\]{8,180})"', content):
            if any(k in s.lower() for k in ["baza", "rekuper", "klimatyz", "ogrzew", "pompy", "portfolio", "kontakt", "blog", "fotow"]):
                strings.add(s)

    report = {
        "pages": sorted(pages.keys()),
        "bundles": sorted(bundles.keys()),
        "image_paths": sorted(image_paths),
        "routes": sorted(routes),
        "content_strings": sorted(strings),
    }
    (out_dir / "crawl-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"pages={len(report['pages'])} bundles={len(report['bundles'])} images={len(report['image_paths'])} strings={len(report['content_strings'])}")


if __name__ == "__main__":
    main()
