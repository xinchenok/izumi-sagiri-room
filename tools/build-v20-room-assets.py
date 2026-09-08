"""保留 V20 日间或夜间房间原始 PNG，仅作等比 Lanczos 导出并登记溯源。"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TOOL = Path(r"C:\Users\w1877\.impeccable\bin\0.1.3\impeccable.exe")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def relative(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return str(path.resolve())


def build(source_path: Path, prompt_path: Path, tool: Path, period: str = "day") -> None:
    prompt = prompt_path.read_text(encoding="utf-8").rstrip("\n")
    if not prompt:
        raise ValueError("缺少精确生成提示词")
    reference = ROOT / (".impeccable/build/room-background-reference.png" if period == "day" else ".tmp/v20-room/source/room-panorama-day-native.png")
    backup = ROOT / f".tmp/v20-room/source/room-panorama-{period}-native.png"
    backup.parent.mkdir(parents=True, exist_ok=True)
    if backup.exists() and sha256(backup) != sha256(source_path):
        raise ValueError("原始备份已存在且不同；请先改用新的版本化路径")
    if not backup.exists():
        shutil.copy2(source_path, backup)

    with Image.open(backup) as opened:
        source = opened.convert("RGB")
    source_width, source_height = source.size
    created_at = datetime.now(timezone.utc).isoformat()
    outputs = [(ROOT / "assets/plates/room-background.png", 2560)] if period == "day" else []
    outputs.extend(
        (ROOT / f"assets/v20/room/room-panorama-{period}-{width}.webp", width)
        for width in (720, 1440, 2560)
    )
    outputs.append((ROOT / f"assets/v20/room/room-panorama-{period}-4k.webp", 3840))
    for path, _ in outputs:
        if path.exists():
            raise ValueError(f"导出文件已存在，禁止覆盖旧素材：{path}")

    records = []
    for path, width in outputs:
        height = round(source_height * width / source_width)
        exported = source.resize((width, height), Image.Resampling.LANCZOS)
        path.parent.mkdir(parents=True, exist_ok=True)
        if path.suffix == ".png":
            exported.save(path, format="PNG", optimize=True)
        else:
            exported.save(path, format="WEBP", quality=94, method=6, exact=True)
        # 直接调用 exe，避免 Windows cmd 对多行提示词的处理导致截断。
        subprocess.run([str(tool), "embed-prompt", str(path), "--prompt", prompt], check=True)
        sidecar_path = Path(str(path) + ".json")
        record = json.loads(sidecar_path.read_text(encoding="utf-8")) if sidecar_path.exists() else {}
        record.update({
            "id": "room-background" if period == "day" else "room-background-night",
            "period": period,
            "prompt": prompt,
            "createdAt": created_at,
            "tool": "内置 ImageGen",
            "approvedComposition": ".impeccable/mocks/v20-a.png",
            "reference": relative(reference),
            "referenceSha256": sha256(reference),
            "source": relative(backup),
            "sourceSha256": sha256(backup),
            "generatedSource": str(source_path.resolve()),
            "sourceWidth": source_width,
            "sourceHeight": source_height,
            "path": relative(path),
            "width": width,
            "height": height,
            "fileSha256": sha256(path),
            "bytes": path.stat().st_size,
            "resizeMethod": "等比 Lanczos；仅缩放；不裁切、不锐化、不调色、不降噪、不添加纹理",
            "native4k": False,
            "visualNotes": "保留用户选定 A 的入口左床位与家具几何；人物和所有界面标记由 ImageGen 移除并补全遮挡区域。" if period == "day" else "仅由 ImageGen 改变窗外夜景及室内光照，保留原始 A 左床位与所有家具几何；无人物、UI、新增月亮或窗框。",
        })
        sidecar_path.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        records.append(record)
    manifest = {
        "version": 1,
        "createdAt": created_at,
        "asset": f"room-panorama-{period}",
        "period": period,
        "approvedComposition": "original-a",
        "sourceWidth": source_width,
        "sourceHeight": source_height,
        "native4k": False,
        "prompt": relative(prompt_path),
        "files": records,
    }
    manifest_path = ROOT / ("assets/v20/room/room-background-manifest.json" if period == "day" else "assets/v20/room/room-night-manifest.json")
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"source": relative(backup), "nativeSize": source.size, "outputs": [relative(p) for p, _ in outputs]}, ensure_ascii=False))


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--period", choices=("day", "night"), default="day")
    parser.add_argument("--prompt", type=Path)
    parser.add_argument("--impeccable", type=Path, default=DEFAULT_TOOL)
    args = parser.parse_args()
    prompt_path = args.prompt or ROOT / f"assets/v20/room/room-panorama-{args.period}-prompt.txt"
    build(args.source, prompt_path, args.impeccable, args.period)
