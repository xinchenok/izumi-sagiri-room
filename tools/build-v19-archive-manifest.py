"""记录 V19 上线前 V18.1 现役插画，保证旧图可回退。"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


ROOT = Path(__file__).resolve().parent.parent
V18_MANIFEST = ROOT / "assets" / "v18" / "manifest.json"
OUTPUT = ROOT / "assets" / "archive" / "pre-v19-cinematic-images.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    manifest = json.loads(V18_MANIFEST.read_text(encoding="utf-8"))
    records: list[dict[str, object]] = []
    for asset in manifest["assets"]:
        for version, entry in asset["versions"].items():
            path = ROOT / entry["path"]
            with Image.open(path) as image:
                width, height = image.size
            records.append({
                "assetId": asset["id"],
                "version": version,
                "path": entry["path"],
                "width": width,
                "height": height,
                "bytes": path.stat().st_size,
                "sha256": sha256(path),
            })

    payload = {
        "schemaVersion": 1,
        "generatedAt": "2026-09-04",
        "purpose": "V19 连续镜头上线前的 V18.1 现役插画回退清单",
        "sourceManifest": "assets/v18/manifest.json",
        "sourceManifestSha256": sha256(V18_MANIFEST),
        "images": records,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"V19 切换前归档：{len(records)} 个 V18.1 文件，写入 {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
