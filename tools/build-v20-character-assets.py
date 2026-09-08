#!/usr/bin/env python3
"""封装 V20 专用绿幕人物：FFmpeg 色键，Pillow 仅缩放、编码与读取元数据。"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from datetime import datetime, timezone

from PIL import Image, PngImagePlugin


ROOT = Path(__file__).resolve().parents[1]
CHROMA_FILTER = "chromakey=0x00FF00:0.22:0.10,format=rgba,geq=r='r(X,Y)':g='if(lt(alpha(X,Y),250),min(g(X,Y),(r(X,Y)+b(X,Y))/2),g(X,Y))':b='b(X,Y)':a='alpha(X,Y)',format=rgba"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def relative(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return str(path.resolve())


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def resolve_ffmpeg(explicit: str | None) -> str:
    if explicit:
        return explicit
    configured = os.environ.get("FFMPEG_BINARY")
    if configured:
        return configured
    system = shutil.which("ffmpeg")
    if system:
        return system
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError as exc:
        raise SystemExit("请通过 --ffmpeg 提供本地 FFmpeg 路径。") from exc


def resolve_impeccable(explicit: str | None) -> str | None:
    if explicit:
        return explicit
    configured = os.environ.get("IMPECCABLE_BIN")
    if configured:
        return configured
    binaries = sorted((Path.home() / ".impeccable" / "bin").glob("*/impeccable.exe"))
    return str(binaries[-1]) if binaries else None


def embed_prompt(binary: str | None, path: Path, prompt: str) -> None:
    if binary:
        subprocess.run([binary, "embed-prompt", str(path), "--prompt", prompt], check=True, capture_output=True, encoding="utf-8")


def write_manifest(target: Path, outfit: str) -> None:
    items = [json.loads(path.read_text(encoding="utf-8")) for path in sorted(target.glob("*.source.json"))]
    write_json(target / f"{outfit}-manifest.json", {"version": "20.0.0", "outfitId": outfit, "generatedAt": datetime.now(timezone.utc).isoformat(), "count": len(items), "assets": items})


def refresh_metadata(args: argparse.Namespace) -> dict:
    target = ROOT / "assets" / "v20" / "character" / args.outfit
    binary = resolve_impeccable(args.impeccable)
    count = 0
    for path in sorted(target.glob("*.source.json")):
        record = json.loads(path.read_text(encoding="utf-8"))
        prompt_path = ROOT / record.get("promptFile", record["prompt"])
        prompt = prompt_path.read_text(encoding="utf-8")
        record.update({"prompt": prompt, "promptText": prompt, "promptFile": relative(prompt_path)})
        for entry in record["exports"]:
            destination = ROOT / entry["file"]
            embed_prompt(binary, destination, prompt)
            entry.update({"sha256": sha256(destination), "bytes": destination.stat().st_size})
            write_json(destination.with_suffix(".webp.json"), {**record, "exports": [entry]})
        if record.get("plate"):
            destination = ROOT / record["plate"]["file"]
            embed_prompt(binary, destination, prompt)
            record["plate"]["sha256"] = sha256(destination)
            write_json(destination.with_suffix(".png.json"), record)
        write_json(path, record)
        count += 1
    write_manifest(target, args.outfit)
    return {"outfitId": args.outfit, "metadataRefreshed": count}


def process(args: argparse.Namespace) -> dict:
    source = Path(args.source).resolve()
    prompt_path = Path(args.prompt).resolve()
    prompt = prompt_path.read_text(encoding="utf-8")
    target = ROOT / "assets" / "v20" / "character" / args.outfit
    target.mkdir(parents=True, exist_ok=True)
    alpha = source.parent / f"{args.id}-alpha.png"
    ffmpeg = resolve_ffmpeg(args.ffmpeg)
    impeccable = resolve_impeccable(args.impeccable)
    command = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(source), "-vf", CHROMA_FILTER, "-frames:v", "1", str(alpha)]
    subprocess.run(command, check=True)
    with Image.open(source) as original:
        native_size = list(original.size)
        native_mode = original.mode
    with Image.open(alpha) as prepared:
        if prepared.mode != "RGBA":
            raise SystemExit("色键结果缺少 RGBA 通道，未导出运行素材。")
        image = prepared.copy()
    channel = image.getchannel("A")
    extrema = channel.getextrema()
    if extrema != (0, 255):
        raise SystemExit(f"色键 alpha 范围异常：{extrema}，未导出运行素材。")
    bbox = channel.getbbox()
    width, height = image.size
    references = [{"path": relative(Path(ref)), "sha256": sha256(Path(ref))} for ref in args.reference]
    asset_prompt = target / f"{args.id}.prompt.txt"
    asset_prompt.write_text(prompt, encoding="utf-8")
    record = {
        "id": args.id,
        "outfitId": args.outfit,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "generation": "内置 ImageGen：人物造型与背景颜色；没有程序重绘人物",
        "source": relative(source),
        "sourceSha256": sha256(source),
        "nativeSize": native_size,
        "nativeMode": native_mode,
        "references": references,
        "prompt": prompt,
        "promptFile": relative(asset_prompt),
        "promptText": prompt,
        "promptSha256": sha256(asset_prompt),
        "alphaPreparation": {
            "method": "FFmpeg 标准专用背景色键封装",
            "filter": CHROMA_FILTER,
            "source": relative(alpha),
            "sha256": sha256(alpha),
            "mode": "RGBA",
            "range": list(extrema),
            "nativeSize": [width, height],
            "despillScope": "只对 alpha < 250 的边缘封装像素限制绿色；不透明人物内部 RGB 与标准色键结果逐像素一致",
            "cornerAlpha": [channel.getpixel(position) for position in [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]],
        },
        "actorBBox": list(bbox),
        "actorBBoxNormalized": [round(bbox[0] / width, 6), round(bbox[1] / height, 6), round(bbox[2] / width, 6), round(bbox[3] / height, 6)],
        "resize": "Lanczos 等比导出；4K 为最长边 3840 的放大导出，不是原生 4K 生成",
        "exports": [],
    }
    variants = [("720", (720, round(height * 720 / width))), ("1440", (1440, round(height * 1440 / width)))]
    long_scale = 3840 / max(width, height)
    variants.append(("4k", (round(width * long_scale), round(height * long_scale))))
    for label, size in variants:
        destination = target / f"{args.id}-{label}.webp"
        image.resize(size, Image.Resampling.LANCZOS).save(destination, "WEBP", quality=90, method=6, exact=True)
        embed_prompt(impeccable, destination, prompt)
        entry = {"sizeClass": label, "file": relative(destination), "dimensions": list(size), "bytes": destination.stat().st_size, "sha256": sha256(destination), "hasAlpha": True}
        record["exports"].append(entry)
        write_json(destination.with_suffix(".webp.json"), {**record, "exports": [entry]})
    if args.plate:
        destination = Path(args.plate).resolve()
        destination.parent.mkdir(parents=True, exist_ok=True)
        scale = max(1.0, 1008 / width, 1404 / height)
        plate_size = (round(width * scale), round(height * scale))
        metadata = PngImagePlugin.PngInfo()
        metadata.add_text("prompt", prompt)
        metadata.add_text("sourceSha256", record["sourceSha256"])
        metadata.add_text("processing", CHROMA_FILTER)
        image.resize(plate_size, Image.Resampling.LANCZOS).save(destination, "PNG", pnginfo=metadata)
        embed_prompt(impeccable, destination, prompt)
        record["plate"] = {"file": relative(destination), "dimensions": list(plate_size), "sha256": sha256(destination), "hasAlpha": True}
        write_json(destination.with_suffix(".png.json"), record)
    write_json(target / f"{args.id}.source.json", record)
    write_manifest(target, args.outfit)
    return record


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--id", help="姿态标识，如 standing-neutral")
    parser.add_argument("--outfit", required=True, help="服装目录，如 home")
    parser.add_argument("--source", help="内置 ImageGen 原始绿幕 PNG")
    parser.add_argument("--prompt", help="实际使用的 UTF-8 提示词文件")
    parser.add_argument("--reference", action="append", default=[], help="实际生成参考图，可重复")
    parser.add_argument("--ffmpeg", help="本地 FFmpeg 可执行文件")
    parser.add_argument("--plate", help="可选的 Impeccable plate PNG 目标")
    parser.add_argument("--impeccable", help="可选的 Impeccable 原生可执行文件；本机安装时自动发现")
    parser.add_argument("--metadata-only", action="store_true", help="仅同步现有导出的精确提示词、嵌入信息和哈希，不重编码 WebP")
    args = parser.parse_args()
    if not args.metadata_only and not all((args.id, args.source, args.prompt)):
        parser.error("导出素材时需要 --id、--source 和 --prompt。")
    print(json.dumps(refresh_metadata(args) if args.metadata_only else process(args), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
