"""导出与核验 V20 三主题三配色的小猫作品；不生成或重绘图像。"""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, __version__ as pillow_version


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/v20/drawings"
SOURCE_ROOT = ROOT / ".tmp/v20-drawings"
IMPECCABLE = Path(r"C:\Users\w1877\.impeccable\bin\0.1.3\impeccable.exe")
SUBJECTS = {
    "door": {"title": "门缝看月亮的小猫", "alt": "浅银灰小猫从半开的门后探出圆脸和小爪，看向一弯月亮与两颗小星星"},
    "blanket": {"title": "被窝里画星星的小猫", "alt": "浅银灰小猫藏在小被窝帐篷里，用短铅笔在白色画纸上认真画下一颗星星"},
    "pencil": {"title": "抱着大铅笔的小猫", "alt": "圆脸短四肢的浅银灰小猫坐着抱住一支大铅笔，身边散着三颗小星星"},
}
PALETTES = {"strawberry": "草莓黄昏", "mint": "薄荷雨夜", "moon": "银蓝月光"}
SIZES = {"480": (480, 360), "720": (720, 540), "1440": (1440, 1080), "4k": (3840, 2880)}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def relative(path: Path) -> str:
    return path.resolve().relative_to(ROOT).as_posix()


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def references(origin: dict) -> list[dict]:
    result = []
    seen = set()
    while origin.get("reference"):
        path = ROOT / origin["reference"]
        if str(path) in seen:
            break
        seen.add(str(path))
        result.append({"path": relative(path), "sha256": sha256(path), "role": origin.get("referenceRole", "来源参考")})
        origin_path = path.with_suffix(".origin.json")
        if not origin_path.is_file():
            break
        origin = json.loads(origin_path.read_text(encoding="utf-8"))
    return result


def build(subject: str, palette: str) -> dict:
    asset_id = f"{subject}-{palette}"
    source = SOURCE_ROOT / subject / f"{palette}.png"
    prompt_path = SOURCE_ROOT / subject / f"{palette}.prompt.txt"
    origin_path = SOURCE_ROOT / subject / f"{palette}.origin.json"
    prompt = prompt_path.read_text(encoding="utf-8").rstrip("\n")
    origin = json.loads(origin_path.read_text(encoding="utf-8"))
    with Image.open(source) as opened:
        image = opened.convert("RGB")
    width, height = image.size
    if width * 3 != height * 4:
        raise ValueError(f"原生源图不是 4:3，不能用裁切或拉伸掩盖：{source} ({width}×{height})")
    source_hash = sha256(source)
    record_path = OUT / f"{asset_id}.source.json"
    if record_path.exists():
        previous = json.loads(record_path.read_text(encoding="utf-8"))
        if previous["sourceSha256"] != source_hash:
            raise ValueError(f"同名母图已经改变，请先确定新版本目录而非覆盖：{asset_id}")
    OUT.mkdir(parents=True, exist_ok=True)
    published_prompt = OUT / "prompts" / f"{asset_id}.txt"
    published_prompt.parent.mkdir(parents=True, exist_ok=True)
    published_prompt.write_text(prompt + "\n", encoding="utf-8")
    record = {
        "id": asset_id, "subject": subject, "palette": palette,
        "title": SUBJECTS[subject]["title"], "paletteName": PALETTES[palette],
        "alt": PALETTES[palette] + "配色：" + SUBJECTS[subject]["alt"],
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "generation": "内置 ImageGen；先制作草莓主题母图，再以同主题母图编辑配色",
        "source": relative(source), "sourceSha256": source_hash,
        "sourceWidth": width, "sourceHeight": height, "nativeSize": [width, height],
        "native4k": False, "aspectRatio": "4:3", "paperMarginIntent": "四边至少 10% 清白留白；留白由 ImageGen 构图完成，不使用程序补边",
        "prompt": prompt, "promptFile": relative(published_prompt), "promptSha256": sha256(published_prompt),
        "references": references(origin),
        "resizeMethod": "仅 Pillow Lanczos 等比缩放和 WebP 编码；没有裁切、锐化、调色、纹理或降噪处理",
        "pillowVersion": pillow_version,
        "exports": [],
    }
    for size_class, dimensions in SIZES.items():
        destination = OUT / f"{asset_id}-{size_class}.webp"
        image.resize(dimensions, Image.Resampling.LANCZOS).save(destination, "WEBP", quality=94, method=6, exact=True)
        subprocess.run([str(IMPECCABLE), "embed-prompt", str(destination), "--prompt", prompt], check=True, capture_output=True, encoding="utf-8")
        entry = {"sizeClass": size_class, "file": relative(destination), "dimensions": list(dimensions), "bytes": destination.stat().st_size, "sha256": sha256(destination)}
        record["exports"].append(entry)
        write_json(destination.with_suffix(".webp.json"), {**record, "exports": [entry]})
    write_json(record_path, record)
    return record


def write_manifest() -> dict:
    records = [json.loads(path.read_text(encoding="utf-8")) for path in sorted(OUT.glob("*.source.json"))]
    mapping = {subject: {} for subject in SUBJECTS}
    for record in records:
        paths = {entry["sizeClass"]: entry["file"] for entry in record["exports"]}
        mapping[record["subject"]][record["palette"]] = {
            "id": record["id"], "subject": record["subject"], "palette": record["palette"],
            "title": record["title"], "alt": record["alt"],
            "image": paths["4k"], "medium": paths["1440"], "small": paths["720"], "thumb": paths["480"],
            "width": 3840, "height": 2880, "mediumWidth": 1440, "smallWidth": 720,
        }
    manifest = {
        "schemaVersion": 1, "version": "20.0.0", "generatedAt": datetime.now(timezone.utc).isoformat(),
        "count": len(records), "webpCount": sum(len(record["exports"]) for record in records),
        "subjects": SUBJECTS, "palettes": PALETTES, "artworks": records, "mapping": mapping,
        "notes": ["实际配色由独立 ImageGen 编辑图承载，不能用 CSS 染纸冒充配色分支。", "4K 档为 3840×2880 等比放大导出，不是原生 4K 生图。", "旧三张小猫图、旧人物和十一张画廊均保留。"],
    }
    write_json(OUT / "drawings-manifest.json", manifest)
    return manifest


def verify() -> None:
    manifest = json.loads((OUT / "drawings-manifest.json").read_text(encoding="utf-8"))
    expected = {f"{subject}-{palette}" for subject in SUBJECTS for palette in PALETTES}
    actual = {record["id"] for record in manifest["artworks"]}
    if actual != expected or manifest["count"] != 9 or manifest["webpCount"] != 36:
        raise ValueError("三主题三配色的 9 / 36 矩阵不完整")
    all_hashes = set()
    total_bytes = 0
    for record in manifest["artworks"]:
        if len(record["exports"]) != 4 or {entry["sizeClass"] for entry in record["exports"]} != set(SIZES):
            raise ValueError(f"作品的四档导出不完整：{record['id']}")
        if len(record["sourceSha256"]) != 64 or not record["references"] or len(record["prompt"]) < 100:
            raise ValueError(f"来源指纹或精确提示词缺失：{record['id']}")
        prompt_file = ROOT / record["promptFile"]
        if sha256(prompt_file) != record["promptSha256"] or prompt_file.read_text(encoding="utf-8").rstrip("\n") != record["prompt"]:
            raise ValueError(f"提示词不一致：{record['id']}")
        source = ROOT / record["source"]
        if source.exists() and sha256(source) != record["sourceSha256"]:
            raise ValueError(f"本地源图已变化：{record['id']}")
        for reference in record["references"]:
            if len(reference["sha256"]) != 64:
                raise ValueError("参考图缺少指纹")
        for entry in record["exports"]:
            path = ROOT / entry["file"]
            if sha256(path) != entry["sha256"]:
                raise ValueError(f"导出哈希不一致：{path}")
            with Image.open(path) as image:
                image.load()
                if list(image.size) != entry["dimensions"] or tuple(image.size) != SIZES[entry["sizeClass"]]:
                    raise ValueError(f"导出尺寸错误：{path}")
            sidecar = json.loads(path.with_suffix(".webp.json").read_text(encoding="utf-8"))
            if sidecar["prompt"] != record["prompt"] or sidecar["sourceSha256"] != record["sourceSha256"]:
                raise ValueError(f"Provenance 不一致：{path}")
            all_hashes.add(entry["sha256"])
            total_bytes += entry["bytes"]
    if len(all_hashes) != 36:
        raise ValueError("存在复用字节的配色图或导出")
    print(json.dumps({"ok": True, "masters": 9, "decodedWebp": 36, "uniqueHashes": 36, "bytes": total_bytes}, ensure_ascii=False))


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch", action="store_true")
    parser.add_argument("--subject", choices=tuple(SUBJECTS))
    parser.add_argument("--palette", choices=tuple(PALETTES))
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    if args.verify:
        verify()
    elif args.batch:
        for subject in SUBJECTS:
            for palette in PALETTES:
                build(subject, palette)
                print(f"已导出 {subject}/{palette}")
        write_manifest()
        verify()
    elif args.subject and args.palette:
        build(args.subject, args.palette)
        write_manifest()
    else:
        parser.error("选择 --batch、--verify，或同时提供 --subject 与 --palette")
