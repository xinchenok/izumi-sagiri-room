"""从固定官方字体生成 V20 本地 WOFF2 子集，保留许可并核验实际 cmap。"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEPENDENCIES = ROOT / ".tmp/v20-fonts/dependencies"
if DEPENDENCIES.is_dir():
    sys.path.insert(0, str(DEPENDENCIES))

from fontTools import __version__ as fonttools_version
from fontTools import subset
from fontTools.ttLib import TTFont


NOTO_COMMIT = "f8d157532fbfaeda587e826d4cd5b21a49186f7c"
NOTO_BASE = f"https://raw.githubusercontent.com/notofonts/noto-cjk/{NOTO_COMMIT}"
LONG_CANG_COMMIT = "baa2e5561af8a4873b058859dcfe158bdd033942"
SOURCES = (
    {
        "family": "RoomTitle", "sourceFamily": "LXGW WenKai", "file": "LXGWWenKai-Regular.ttf",
        "url": "https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Regular.ttf",
        "revision": "v1.522", "sha256": "39ad71264b588165b469e35e6afb162a378dacd1f95348160240ba9038ac3009",
        "licenseFile": "OFL-LXGWWenKai.txt", "licenseUrl": "https://raw.githubusercontent.com/lxgw/LxgwWenKai/v1.522/OFL.txt",
        "licenseSha256": "c38b1994a5e48ac30ac7d1da7d0409fd8fd8127dfe28a13d6e787d5b1ef34a5e",
    },
    {
        "family": "RoomBody", "sourceFamily": "Noto Sans CJK SC", "file": "NotoSansCJKsc-Regular.otf",
        "url": f"{NOTO_BASE}/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf",
        "revision": NOTO_COMMIT, "sha256": "2c76254f6fc379fddfce0a7e84fb5385bb135d3e399294f6eeb6680d0365b74b",
        "licenseFile": "OFL-NotoSansCJK.txt", "licenseUrl": f"{NOTO_BASE}/Sans/LICENSE",
        "licenseSha256": "6a73f9541c2de74158c0e7cf6b0a58ef774f5a780bf191f2d7ec9cc53efe2bf2",
    },
    {
        "family": "RoomJapanese", "sourceFamily": "Noto Sans CJK JP", "file": "NotoSansCJKjp-Regular.otf",
        "url": f"{NOTO_BASE}/Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf",
        "revision": NOTO_COMMIT, "sha256": "68a3fc98800b2a27b371f2fb79991daf3633bd89309d4ffaa6946fd587f375b5",
        "licenseFile": "OFL-NotoSansCJK.txt", "licenseUrl": f"{NOTO_BASE}/Sans/LICENSE",
        "licenseSha256": "6a73f9541c2de74158c0e7cf6b0a58ef774f5a780bf191f2d7ec9cc53efe2bf2",
    },
    {
        "family": "RoomSign", "sourceFamily": "Long Cang", "file": "LongCang-Regular.ttf",
        "url": f"https://raw.githubusercontent.com/google/fonts/{LONG_CANG_COMMIT}/ofl/longcang/LongCang-Regular.ttf",
        "revision": LONG_CANG_COMMIT, "sha256": "e5bf2c3f24ef2327c6f136d8f73e2f9dfdf44896fdbeb35a9515f44777bb91bc",
        "licenseFile": "OFL-LongCang.txt", "licenseUrl": f"https://raw.githubusercontent.com/google/fonts/{LONG_CANG_COMMIT}/ofl/longcang/OFL.txt",
        "licenseSha256": "603546b7219a94bb59bf8294458194a5010119486354092b66a09a3fd61aeacc",
        "subsetText": "纱雾的房间", "usage": "仅用于房间 h1 门签标题；不替代正文、日文字幕或其他短标题",
    },
)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def relative(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return str(path.resolve())


def required_language_codepoint(codepoint: int) -> bool:
    return any(start <= codepoint <= end for start, end in (
        (0x3040, 0x30FF), (0x31F0, 0x31FF), (0x3400, 0x4DBF),
        (0x4E00, 0x9FFF), (0xF900, 0xFAFF), (0xFF66, 0xFF9D),
        (0x20000, 0x323AF),
    ))


def collect_codepoints(paths: list[Path]) -> tuple[set[int], list[dict]]:
    codepoints = set(range(0x20, 0x7F))
    inputs = []
    for path in paths:
        raw = path.read_bytes()
        if raw.startswith(b"\xef\xbb\xbf"):
            raise ValueError(f"文本含 BOM：{path}")
        text = raw.decode("utf-8")
        text += html.unescape(text)
        # 保留源码直接文字，也解析 JS/JSON Unicode 转义与 HTML 数字实体。
        text += "".join(chr(int(value, 16)) for value in re.findall(r"\\u\{([0-9a-fA-F]{1,6})\}", text))
        text += "".join(chr(int(value, 16)) for value in re.findall(r"\\u([0-9a-fA-F]{4})", text))
        text += "".join(chr(int(value, 16)) for value in re.findall(r"&#x([0-9a-fA-F]+);", text))
        text += "".join(chr(int(value)) for value in re.findall(r"&#([0-9]+);", text))
        codepoints.update(ord(character) for character in text if not unicodedata.category(character).startswith("C"))
        inputs.append({"path": relative(path), "sha256": sha256(path), "bytes": len(raw)})
    return codepoints, inputs


def rename_family(font: TTFont, family: str) -> None:
    names = {1: family, 2: "Regular", 3: f"V20:{family}:Regular", 4: f"{family} Regular", 6: f"{family}-Regular", 16: family, 17: "Regular", 21: family, 22: "Regular"}
    font["name"].names = [record for record in font["name"].names if record.nameID not in names]
    for name_id, value in names.items():
        font["name"].setName(value, name_id, 3, 1, 0x409)
        font["name"].setName(value, name_id, 1, 0, 0)
    if "CFF " in font:
        cff = font["CFF "].cff
        cff.fontNames = [f"{family}-Regular"]
        for top_dict in cff.topDictIndex:
            top_dict.FamilyName = family
            top_dict.FullName = f"{family} Regular"


def build(source_dir: Path, output_dir: Path, scan_files: list[Path], families: list[str] | None = None) -> None:
    codepoints, inputs = collect_codepoints(scan_files)
    output_dir.mkdir(parents=True, exist_ok=True)
    generated_at = datetime.now(timezone.utc).isoformat()
    manifest_path = output_dir / "font-manifest.json"
    previous = json.loads(manifest_path.read_text(encoding="utf-8")) if families and manifest_path.exists() else {}
    records = [record for record in previous.get("fonts", []) if record["family"] not in families] if families else []
    for source in SOURCES:
        if families and source["family"] not in families:
            continue
        source_path = source_dir / source["file"]
        license_path = source_dir / source["licenseFile"]
        if sha256(source_path) != source["sha256"] or sha256(license_path) != source["licenseSha256"]:
            raise ValueError(f"固定源文件或许可哈希不一致：{source['family']}")
        font = TTFont(source_path, recalcTimestamp=False)
        source_cmap = font.getBestCmap()
        source_codepoints = set(map(ord, source["subsetText"])) if source.get("subsetText") else codepoints
        supported = source_codepoints.intersection(source_cmap)
        missing = source_codepoints.difference(source_cmap)
        language_missing = sorted(cp for cp in missing if required_language_codepoint(cp))
        if language_missing:
            raise ValueError(f"{source['family']} 原字体缺少所需中日文字：" + "".join(chr(cp) for cp in language_missing))
        options = subset.Options()
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.name_legacy = True
        options.name_languages = ["*"]
        options.recalc_timestamp = False
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=supported)
        subsetter.subset(font)
        rename_family(font, source["family"])
        font.flavor = "woff2"
        output_path = output_dir / f"{source['family']}.woff2"
        font.save(output_path)
        font.close()
        with TTFont(output_path) as verified:
            actual_cmap = verified.getBestCmap()
            missing_after_export = supported.difference(actual_cmap)
            if missing_after_export:
                raise ValueError(f"导出的 cmap 丢字：{source['family']}")
            glyph_count = verified["maxp"].numGlyphs
        shutil.copy2(license_path, output_dir / source["licenseFile"])
        records.append({
            **source,
            "sourcePath": relative(source_path), "sourceSha256": source["sha256"], "sourceBytes": source_path.stat().st_size,
            "output": relative(output_path), "outputSha256": sha256(output_path), "bytes": output_path.stat().st_size,
            "weight": 400, "style": "normal", "license": "SIL Open Font License 1.1",
            "requestedCodepointCount": len(source_codepoints), "cmapCodepointCount": len(actual_cmap), "glyphCount": glyph_count,
            "missingLanguageCodepoints": [], "missingAfterExport": [],
            "systemFallbackSymbols": [{"codepoint": f"U+{cp:04X}", "character": chr(cp)} for cp in sorted(missing)],
        })
        print(f"{source['family']}: {output_path.stat().st_size:,} 字节；cmap {len(actual_cmap)}；中日文缺字 0")
    manifest = {
        "schemaVersion": 1, "generatedAt": generated_at, "fontToolsVersion": fonttools_version,
        "purpose": "V20 本地字体；正文 Noto SC、日文 Noto JP、短标题文楷、房间 h1 龙藏体五字门签；非官方衍生子集名称",
        "sourcesPinned": True, "inputFiles": previous.get("inputFiles", inputs),
        "requestedCodepoints": previous.get("requestedCodepoints", [f"U+{cp:04X}" for cp in sorted(codepoints)]),
        "fonts": sorted(records, key=lambda record: next(index for index, source in enumerate(SOURCES) if source["family"] == record["family"])),
        "rebuild": "python tools/build-v20-fonts.py --source-dir .tmp/v20-fonts/source --scan " + " ".join(relative(path) for path in scan_files),
        "notes": ["完整原字体仅存忽略目录；发布四个 WOFF2 子集。", "RoomTitle、RoomBody、RoomJapanese 包含扫描文本中其源字体支持的字符；RoomSign 仅包含固定标题纱雾的房间五字，实际 cmap 均逐字核验。", "源字体不包含的少量绘图/表情符号交给系统回退；逐项记录，不隐藏中日文缺字。", "--family 可只重建指定子集并保留其他已发布字体字节和原输入指纹；不指定时重建四个 V20 子集。不会删除旧版本字体。"],
    }
    (output_dir / "font-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, default=ROOT / ".tmp/v20-fonts/source")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "assets/fonts/v20")
    parser.add_argument("--scan", nargs="+", type=Path)
    parser.add_argument("--family", action="append", choices=tuple(source["family"] for source in SOURCES), help="只构建指定字体，可重复；保留其他已生成字体与记录")
    args = parser.parse_args()
    scan_files = args.scan or [ROOT / "index.html", ROOT / "script.js"]
    if args.scan is None:
        audio_manifest = ROOT / "assets/audio/v20/voice-manifest.json"
        if audio_manifest.exists():
            scan_files.append(audio_manifest)
    build(args.source_dir, args.output_dir, scan_files, args.family)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
