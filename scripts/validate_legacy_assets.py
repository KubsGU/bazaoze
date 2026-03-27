import json
import urllib.request
from pathlib import Path


BASE = "https://www.bazaoze.com/"


def is_ok(url: str) -> bool:
    try:
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=20) as r:
            return 200 <= r.status < 400
    except Exception:
        try:
            with urllib.request.urlopen(url, timeout=20) as r:
                return 200 <= r.status < 400
        except Exception:
            return False


def main() -> None:
    report = json.loads(Path("data/crawl-report.json").read_text(encoding="utf-8"))
    image_paths = report.get("image_paths", [])

    rows = []
    for p in image_paths:
        url = BASE + p
        rows.append({"path": p, "url": url, "available": is_ok(url)})

    Path("data/legacy-images.json").write_text(
        json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    ok_count = len([r for r in rows if r["available"]])
    print(f"available={ok_count}/{len(rows)}")


if __name__ == "__main__":
    main()
