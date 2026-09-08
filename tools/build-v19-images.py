"""把 V19 ImageGen 输出整理为 4K WebP 母版和响应式派生图。"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageOps

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


TARGETS = {
    "portrait": (3072, 3840),
    "scene": (3840, 2880),
}

DERIVATIVE_WIDTHS = {
    "portrait": (720, 1440),
    "scene": (480, 720, 1440),
}

BATCH_ASSETS = {
    "portrait": (
        "door-peek",
        "door-listen",
        "door-startled",
        "door-open-smile",
        "wardrobe-hides-sleeves",
        "wardrobe-holds-two",
        "wardrobe-adjusts-bow",
        "wardrobe-chosen-shy",
    ),
    "scene": (
        "room-drawing",
        "room-stops-pen",
        "room-glances-over",
        "room-invites-seat",
        "secrets-caught",
        "secrets-protects-draft",
        "secrets-opens-drawer",
        "gallery-hides-book",
        "gallery-peeks-over",
        "gallery-pushes-book",
        "drawing-focus",
        "drawing-blink",
        "drawing-covers-page",
        "drawing-shy-pause",
        "drawing-reveal",
        "goodnight-hug",
        "goodnight-yawn",
        "goodnight-wave",
    ),
}


def save_webp(image: Image.Image, path: Path, quality: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=quality, method=6, exact=True)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_prompt_sidecar(
    path: Path,
    prompt: str,
    source_path: Path,
    source_sha256: str,
    source_size: tuple[int, int],
) -> None:
    sidecar = Path(f"{path}.json")
    payload = {
        "prompt": prompt,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "pipeline": "内置 ImageGen 逐图清晰化；Pillow Lanczos 纯缩放响应式导出",
        "sourceAsset": source_path.name,
        "sourceSha256": source_sha256,
        "sourceWidth": source_size[0],
        "sourceHeight": source_size[1],
        "resizeMethod": "Lanczos；不添加锐化、纹理、降噪或调色滤镜",
    }
    sidecar.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def build(input_path: Path, output_root: Path, name: str, kind: str, prompt_file: Path) -> None:
    prompt = prompt_file.read_text(encoding="utf-8")
    if not prompt.strip():
        raise ValueError(f"提示词为空：{prompt_file}")

    target_size = TARGETS[kind]
    source_sha256 = sha256(input_path)
    with Image.open(input_path) as source:
        source = ImageOps.exif_transpose(source).convert("RGB")
        source_size = source.size
        master = ImageOps.fit(source, target_size, method=Image.Resampling.LANCZOS)

    master_path = output_root / "master" / f"{name}-4k.webp"
    save_webp(master, master_path, 96)
    output_paths = [master_path]

    for width in DERIVATIVE_WIDTHS[kind]:
        height = round(master.height * width / master.width)
        derivative = master.resize((width, height), Image.Resampling.LANCZOS)
        quality = 92 if width == 1440 else 88 if width == 720 else 86
        output_path = output_root / f"{name}-{width}.webp"
        save_webp(derivative, output_path, quality)
        output_paths.append(output_path)

    for output_path in output_paths:
        save_prompt_sidecar(output_path, prompt, input_path, source_sha256, source_size)

    print(f"已生成 {name}：{master.width}×{master.height} 母版及响应式版本")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path)
    parser.add_argument("--output-root", default=Path("assets/v19"), type=Path)
    parser.add_argument("--name")
    parser.add_argument("--kind", choices=sorted(TARGETS))
    parser.add_argument("--prompt-file", type=Path)
    parser.add_argument("--batch-root", type=Path)
    parser.add_argument("--prompts-root", default=Path("assets/v19/prompts"), type=Path)
    args = parser.parse_args()
    if args.batch_root:
        for kind, names in BATCH_ASSETS.items():
            for name in names:
                prefix = name.split("-", 1)[0]
                batch = "door-wardrobe" if prefix in ("door", "wardrobe") else "drawing-goodnight" if prefix in ("drawing", "goodnight") else "room-secrets-gallery"
                source = args.batch_root / batch / f"{name}.png"
                if not source.is_file():
                    raise FileNotFoundError(f"缺少 V19 现役清理源图：{source}")
                build(source, args.output_root, name, kind, args.prompts_root / f"{name}.txt")
        return
    if not all((args.input, args.name, args.kind, args.prompt_file)):
        parser.error("单图模式需要 --input、--name、--kind 与 --prompt-file，批量模式需要 --batch-root")
    build(args.input, args.output_root, args.name, args.kind, args.prompt_file)


if __name__ == "__main__":
    main()
