"""验证 V19 连续镜头图片矩阵并生成机器可读清单。"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


ROOT = Path(__file__).resolve().parent.parent
ASSET_ROOT = ROOT / "assets" / "v19"

PORTRAITS = {
    "door-peek": "assets/v18/master/hero-peek-4k.webp",
    "door-listen": "assets/v18/master/hero-peek-4k.webp",
    "door-startled": "assets/v18/master/hero-startled-4k.webp",
    "door-open-smile": "assets/v18/master/hero-shy-4k.webp",
    "wardrobe-hides-sleeves": "assets/v18/master/outfit-home-4k.webp",
    "wardrobe-holds-two": "assets/v18/master/wardrobe-living-4k.webp",
    "wardrobe-adjusts-bow": "assets/v18/master/outfit-outing-sailor-4k.webp",
    "wardrobe-chosen-shy": "assets/v18/master/outfit-home-4k.webp",
}

SCENES = {
    "room-drawing": "assets/v18/master/studio-focus-clean-4k.webp",
    "room-stops-pen": "assets/v18/master/studio-focus-clean-4k.webp",
    "room-glances-over": "assets/v18/master/studio-shy-clean-4k.webp",
    "room-invites-seat": "assets/v18/master/studio-reveal-clean-4k.webp",
    "secrets-caught": "assets/v18/master/desk-secrets-4k.webp",
    "secrets-protects-draft": "assets/v18/master/desk-secrets-4k.webp",
    "secrets-opens-drawer": "assets/v18/master/desk-secrets-4k.webp",
    "gallery-hides-book": "assets/v18/master/gallery-sketchbook-hide-4k.webp",
    "gallery-peeks-over": "assets/v18/master/gallery-sketchbook-hide-4k.webp",
    "gallery-pushes-book": "assets/v18/master/gallery-show-drawing-4k.webp",
    "drawing-focus": "assets/v18/master/studio-focus-clean-4k.webp",
    "drawing-blink": "assets/v18/master/studio-blink-clean-4k.webp",
    "drawing-covers-page": "assets/v18/master/studio-shy-clean-4k.webp",
    "drawing-shy-pause": "assets/v18/master/studio-shy-clean-4k.webp",
    "drawing-reveal": "assets/v18/master/studio-reveal-clean-4k.webp",
    "goodnight-hug": "assets/v18/master/gallery-goodnight-clean-4k.webp",
    "goodnight-yawn": "assets/v18/master/gallery-goodnight-clean-4k.webp",
    "goodnight-wave": "assets/v18/master/gallery-goodnight-clean-4k.webp",
}

EXPECTED_SIZES = {
    "portrait": {"4k": (3072, 3840), "1440": (1440, 1800), "720": (720, 900)},
    "scene": {"4k": (3840, 2880), "1440": (1440, 1080), "720": (720, 540), "480": (480, 360)},
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def file_record(path: Path, expected_size: tuple[int, int], expected_prompt: str) -> dict[str, object]:
    if not path.is_file():
        raise FileNotFoundError(f"缺少 V19 图片：{path.relative_to(ROOT)}")
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
    if provenance.get("prompt", "").replace("\r\n", "\n") != expected_prompt.replace("\r\n", "\n"):
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
        "generator": "内置 ImageGen 逐图清晰化编辑；Pillow Lanczos 无附加滤镜生成 4K 与响应式 WebP",
        "identityAnchor": "assets/v18/master/hero-peek-4k.webp",
        "styleAnchor": "assets/v19/master/room-drawing-4k.webp",
        "styleCalibrationPrompt": "assets/v19/prompts/room-drawing.txt",
        "archive": "assets/archive/pre-v19-cinematic-images.json",
        "assets": assets,
    }
    output = ASSET_ROOT / "manifest.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"V19 图片矩阵通过：{len(assets)} 张母版，清单写入 {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
