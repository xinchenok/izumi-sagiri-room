"""验证 V18 图片矩阵并生成机器可读清单。"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
ASSET_ROOT = ROOT / "assets" / "v18"

PORTRAITS = {
    "hero-peek": "assets/v5/hero-peek.webp",
    "hero-startled": "assets/v5/hero-startled.webp",
    "hero-shy": "assets/v5/hero-shy.webp",
    "hero-proud": "assets/v5/hero-proud.webp",
    "outfit-home": "assets/v5/outfit-home.webp",
    "outfit-artist-night": "assets/v5/outfit-artist-night.webp",
    "outfit-outing-sailor": "assets/v5/outfit-outing-sailor.webp",
    "outfit-bedtime": "assets/v5/outfit-bedtime.webp",
    "outfit-hooded-blanket": "assets/v5/outfit-hooded-blanket.webp",
}

SCENES = {
    "gallery-bed-drawing": "assets/v4/gallery-bed-drawing.webp",
    "gallery-blanket-fort": "assets/v4/gallery-blanket-fort.webp",
    "gallery-stream-wave": "assets/v4/gallery-stream-wave.webp",
    "gallery-show-drawing": "assets/v4/gallery-show-drawing.webp",
    "gallery-pillow-offer": "assets/v4/gallery-pillow-offer.webp",
    "gallery-door-note": "assets/v4/gallery-door-note.webp",
    "gallery-desk-night": "assets/v4/gallery-desk-night.webp",
    "gallery-sketch-sort": "assets/v4/gallery-sketch-sort.webp",
    "gallery-sketchbook-hide": "assets/v4/gallery-sketchbook-hide.webp",
    "gallery-awaiting-praise": "assets/v4/gallery-awaiting-praise.webp",
    "gallery-goodnight": "assets/v4/gallery-goodnight.webp",
    "desk-secrets": "assets/v3/desk-secrets.webp",
    "studio-focus": "assets/v6/studio-focus.webp",
    "studio-blink": "assets/v6/studio-blink.webp",
    "studio-shy": "assets/v6/studio-shy.webp",
    "studio-reveal": "assets/v6/studio-reveal.webp",
    "wardrobe-living": "assets/v7/wardrobe-living.webp",
    "drawing-door-moon": "assets/v6/drawing-door-moon.webp",
    "drawing-blanket-star": "assets/v6/drawing-blanket-star.webp",
    "drawing-pencil-stars": "assets/v6/drawing-pencil-stars.webp",
}

EXPECTED_SIZES = {
    "portrait": {"4k": (3072, 3840), "1440": (1440, 1800), "720": (720, 900)},
    "scene": {"4k": (3840, 2880), "1440": (1440, 1080), "720": (720, 540), "480": (480, 360)},
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def file_record(path: Path, expected_size: tuple[int, int], expected_prompt: str) -> dict[str, object]:
    if not path.is_file():
        raise FileNotFoundError(f"缺少 V18 图片：{path.relative_to(ROOT)}")
    with Image.open(path) as image:
        actual_size = image.size
        if image.format != "WEBP":
            raise ValueError(f"图片格式不是 WebP：{path.relative_to(ROOT)}")
    if actual_size != expected_size:
        raise ValueError(f"图片尺寸错误：{path.relative_to(ROOT)}，实际 {actual_size}，预期 {expected_size}")
    sidecar = Path(f"{path}.json")
    if not sidecar.is_file():
        raise FileNotFoundError(f"缺少提示词来源边车：{sidecar.relative_to(ROOT)}")
    provenance = json.loads(sidecar.read_text(encoding="utf-8"))
    if provenance.get("prompt") != expected_prompt:
        raise ValueError(f"提示词来源与精确提示不一致：{sidecar.relative_to(ROOT)}")
    return {
        "path": path.relative_to(ROOT).as_posix(),
        "width": actual_size[0],
        "height": actual_size[1],
        "bytes": path.stat().st_size,
        "sha256": sha256(path),
        "provenance": sidecar.relative_to(ROOT).as_posix(),
    }


def asset_record(name: str, old_source: str, kind: str) -> dict[str, object]:
    prompt_path = ASSET_ROOT / "prompts" / f"{name}.txt"
    if not prompt_path.is_file() or not prompt_path.read_text(encoding="utf-8").strip():
        raise FileNotFoundError(f"缺少精确提示词：{prompt_path.relative_to(ROOT)}")
    prompt = prompt_path.read_text(encoding="utf-8")
    versions = {}
    for label, size in EXPECTED_SIZES[kind].items():
        path = ASSET_ROOT / "master" / f"{name}-4k.webp" if label == "4k" else ASSET_ROOT / f"{name}-{label}.webp"
        versions[label] = file_record(path, size, prompt)
    return {
        "id": name,
        "kind": kind,
        "oldSource": old_source,
        "oldSourceSha256": sha256(ROOT / old_source),
        "prompt": prompt_path.relative_to(ROOT).as_posix(),
        "versions": versions,
    }


def main() -> None:
    assets = [asset_record(name, source, "portrait") for name, source in PORTRAITS.items()]
    assets.extend(asset_record(name, source, "scene") for name, source in SCENES.items())
    payload = {
        "schemaVersion": 1,
        "generatedAt": "2026-09-04",
        "generator": "内置 ImageGen 以图生图；Pillow 12.2.0 生成 4K 与响应式 WebP",
        "identityAnchor": "assets/v18/master/hero-peek-4k.webp",
        "archive": "assets/archive/pre-v18-images.json",
        "assets": assets,
    }
    output = ASSET_ROOT / "manifest.json"
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"V18 图片矩阵通过：{len(assets)} 张母版，清单写入 {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
