"""把 ImageGen 输出整理为 V18 的 4K WebP 母版和响应式派生图。"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


TARGETS = {
    "portrait": (3072, 3840),
    "scene": (3840, 2880),
}

DERIVATIVE_WIDTHS = {
    "portrait": (720, 1440),
    "scene": (480, 720, 1440),
}


def save_webp(image: Image.Image, path: Path, quality: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=quality, method=6, exact=True)


def save_prompt_sidecar(path: Path, prompt: str) -> None:
    sidecar = Path(f"{path}.json")
    payload = {"prompt": prompt, "createdAt": datetime.now(timezone.utc).isoformat()}
    sidecar.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def build(input_path: Path, output_root: Path, name: str, kind: str, prompt_file: Path | None) -> None:
    target_size = TARGETS[kind]
    with Image.open(input_path) as source:
        source = ImageOps.exif_transpose(source).convert("RGB")
        master = ImageOps.fit(source, target_size, method=Image.Resampling.LANCZOS)
        master = master.filter(ImageFilter.UnsharpMask(radius=1.15, percent=55, threshold=2))

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

    if prompt_file:
        prompt = prompt_file.read_text(encoding="utf-8")
        for output_path in output_paths:
            save_prompt_sidecar(output_path, prompt)

    print(f"已生成 {name}：{master.width}×{master.height} 4K 母版及响应式版本")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output-root", default=Path("assets/v18"), type=Path)
    parser.add_argument("--name", required=True)
    parser.add_argument("--kind", required=True, choices=sorted(TARGETS))
    parser.add_argument("--prompt-file", type=Path)
    args = parser.parse_args()
    build(args.input, args.output_root, args.name, args.kind, args.prompt_file)


if __name__ == "__main__":
    main()
