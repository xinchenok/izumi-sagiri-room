"""记录 V18 切换前所有现役图片，旧文件保留原位而不删除。"""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets" / "archive" / "pre-v18-images.json"
PATTERN = re.compile(r"assets/[A-Za-z0-9_./-]+\.(?:png|webp|jpe?g)")


def main() -> None:
    references: set[str] = set()
    for relative in ("index.html", "styles.css", "script.js"):
        content = (ROOT / relative).read_text(encoding="utf-8")
        references.update(PATTERN.findall(content))

    records = []
    for reference in sorted(references):
        path = ROOT / reference
        if not path.is_file():
            continue
        with Image.open(path) as image:
            width, height = image.size
        records.append(
            {
                "path": reference,
                "width": width,
                "height": height,
                "bytes": path.stat().st_size,
                "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            }
        )

    payload = {
        "schemaVersion": 1,
        "capturedAt": "2026-09-04",
        "purpose": "V18 全量以图生图重绘前的现役图片归档清单。旧图片保留在原版本目录，不删除、不覆盖。",
        "images": records,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"已记录 {len(records)} 个旧图片文件：{OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
