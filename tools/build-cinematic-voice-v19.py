"""用固定 Piper Plus 模型复现 V19 的 28 句语音，仅写入本地生成目录。"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import platform
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE_COMMIT = "5fceade2c284a85c8da0523c48b830b434350309"
MODEL_REVISION = "36b59c825c36bd386b8960cf3f604382f52f2a87"
MODEL_FILE = "tsukuyomi-chan-6lang-fp16.onnx"
MODEL_SHA256 = "5289e9b6eaf21080803b7fe1c4dc85b5491d4c216121207a41df18dd5f68e5d7"
CONFIG_SHA256 = "516058f405ec914140f34832a9d8bb5d8272ba62af9bc7ffb29349715a539780"
PROFILES = {
    "soft": {"noise_scale": 0.64, "length_scale": 1.50, "noise_w": 0.76},
    "shy": {"noise_scale": 0.60, "length_scale": 1.58, "noise_w": 0.72},
    "flustered": {"noise_scale": 0.72, "length_scale": 1.32, "noise_w": 0.86},
    "proud": {"noise_scale": 0.66, "length_scale": 1.40, "noise_w": 0.78},
    "sleepy": {"noise_scale": 0.58, "length_scale": 1.68, "noise_w": 0.68},
}
PREFILTERS = "highpass=f=70,lowpass=f=10500"
LOUDNORM = "loudnorm=I=-17:TP=-1.5:LRA=7"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def write_json(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def run_checked(command: list[str]) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(command, text=True, encoding="utf-8", errors="replace", capture_output=True)
    if result.returncode != 0:
        raise RuntimeError(f"命令执行失败（{result.returncode}）：{' '.join(command)}\n{result.stderr}")
    return result


def analyze_loudness(ffmpeg: str, path: Path, prefilters: str = "") -> dict[str, float]:
    filters = f"{prefilters},{LOUDNORM}" if prefilters else LOUDNORM
    result = run_checked([
        ffmpeg, "-hide_banner", "-nostats", "-i", str(path),
        "-af", f"{filters}:print_format=json", "-f", "null", os.devnull,
    ])
    matches = re.findall(r'\{\s*"input_i".*?\}', result.stderr, flags=re.DOTALL)
    if not matches:
        raise RuntimeError(f"未取得响度测量结果：{path}\n{result.stderr[-2000:]}")
    data = json.loads(matches[-1])
    return {
        "integrated_lufs": float(data["input_i"]),
        "true_peak_db": float(data["input_tp"]),
        "lra": float(data["input_lra"]),
        "threshold": float(data["input_thresh"]),
        "target_offset": float(data["target_offset"]),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--work-dir", type=Path, default=PROJECT_ROOT / ".tmp" / "v19-voice",
                        help="本地工作目录，默认仓库 .tmp/v19-voice")
    parser.add_argument("--source-dir", type=Path,
                        help="固定提交的 Piper Plus Git 检出，默认工作目录/piper-plus-src")
    parser.add_argument("--model-dir", type=Path,
                        help="包含 ONNX 与 config.json 的目录，默认工作目录/model")
    parser.add_argument("--output-dir", type=Path,
                        help="生成结果目录，默认工作目录/reproduction-时间戳；不修改发布素材")
    parser.add_argument("--ffmpeg", help="FFmpeg 可执行文件；默认使用 imageio-ffmpeg 自带版本")
    return parser.parse_args()


def main() -> None:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    args = parse_args()
    work_dir = args.work_dir.resolve()
    source_dir = (args.source_dir or work_dir / "piper-plus-src").resolve()
    model_dir = (args.model_dir or work_dir / "model").resolve()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S-%f")
    output_dir = (args.output_dir or work_dir / f"reproduction-{stamp}").resolve()
    if output_dir.is_relative_to(PROJECT_ROOT / "assets"):
        raise ValueError("生成目录不能位于发布素材 assets 内，请指定 .tmp 下的独立目录")
    manifest_path = PROJECT_ROOT / "assets" / "audio" / "v19" / "voice-manifest.json"
    released = json.loads(manifest_path.read_text(encoding="utf-8"))
    lines = released["lines"]
    if len(lines) != 28 or len({line["id"] for line in lines}) != 28:
        raise ValueError("已发布语音清单必须包含 28 个唯一条目")
    if released["synthesis"]["profiles"] != PROFILES:
        raise ValueError("已发布语音清单的五组参数与 V19 固定配置不一致")
    engine = released["engine"]
    if engine["source_commit"] != SOURCE_COMMIT or engine["model_revision"] != MODEL_REVISION:
        raise ValueError("已发布语音清单的源码提交或模型修订与 V19 固定版本不一致")
    for line in lines:
        if line["params"] != PROFILES[line["profile"]]:
            raise ValueError(f"语音条目参数不一致：{line['id']}")
    actual_commit = run_checked(["git", "-C", str(source_dir), "rev-parse", "HEAD"]).stdout.strip()
    if actual_commit != SOURCE_COMMIT:
        raise ValueError(f"Piper Plus 源码提交不匹配：{actual_commit}，需要 {SOURCE_COMMIT}")
    model_path = model_dir / MODEL_FILE
    config_path = model_dir / "config.json"
    for path, expected in ((model_path, MODEL_SHA256), (config_path, CONFIG_SHA256)):
        actual = sha256(path)
        if actual != expected:
            raise ValueError(f"文件 SHA-256 不匹配：{path}\n实际 {actual}\n预期 {expected}")

    # 解析 --help 后才加载生成依赖，因此查看使用方法无需先安装模型或环境。
    python_source = source_dir / "src" / "python"
    sys.path.insert(0, str(python_source))
    sys.path.insert(0, str(python_source / "g2p"))
    import imageio_ffmpeg
    import numpy as np
    import onnxruntime as ort
    from mutagen.mp3 import MP3
    from piper_train.infer_onnx import (
        _adjust_scales_for_short_input, _pad_phoneme_ids,
        _trim_padding_by_durations, _trim_silence, text_to_phoneme_ids_and_prosody,
    )
    from piper_train.ort_utils import create_session_with_cache
    from piper_train.vits.utils import audio_float_to_int16
    from piper_train.vits.wavfile import write as write_wav

    config = json.loads(config_path.read_text(encoding="utf-8"))
    sample_rate = int(config["audio"]["sample_rate"])
    hop_size = int(config["audio"].get("hop_size", 256))
    language = "ja-en-zh-es-fr-pt"
    ffmpeg = args.ffmpeg or imageio_ffmpeg.get_ffmpeg_exe()
    ffmpeg_version = run_checked([ffmpeg, "-version"]).stdout.splitlines()[0]
    session = create_session_with_cache(str(model_path), device="cpu")
    embedding_input = next(item for item in session.get_inputs() if item.name == "speaker_embedding")
    embedding_dim = embedding_input.shape[1] if isinstance(embedding_input.shape[1], int) else 256
    raw_dir, voice_dir, query_dir = (output_dir / name for name in ("raw", "voice", "queries"))
    for directory in (raw_dir, voice_dir, query_dir):
        directory.mkdir(parents=True, exist_ok=True)
    write_json(output_dir / "requests.json", {
        "input_manifest": "assets/audio/v19/voice-manifest.json",
        "input_manifest_sha256": sha256(manifest_path), "profiles": PROFILES,
        "lines": [{key: line[key] for key in ("id", "scene", "japanese", "chinese", "profile", "params")}
                  for line in lines],
    })
    generated = []
    generation_log = []
    for index, line in enumerate(lines, start=1):
        profile = PROFILES[line["profile"]]
        phoneme_ids, prosody_data = text_to_phoneme_ids_and_prosody(
            line["japanese"], config["phoneme_id_map"], language=language,
            language_id_map=config.get("language_id_map", {}),
        )
        original_count = len(phoneme_ids)
        padded_ids, padded_prosody, was_padded, front_pad, back_pad = _pad_phoneme_ids(phoneme_ids, prosody_data)
        noise, length, noise_w = _adjust_scales_for_short_input(
            padded_ids, profile["noise_scale"], profile["noise_w"],
            profile["length_scale"], original_len=original_count,
        )
        text = np.expand_dims(np.asarray(padded_ids, dtype=np.int64), 0)
        prosody_array = [[value["a1"], value["a2"], value["a3"]] if value else [0, 0, 0]
                         for value in padded_prosody or [None] * len(padded_ids)]
        outputs = session.run(None, {
            "input": text,
            "input_lengths": np.asarray([text.shape[1]], dtype=np.int64),
            "scales": np.asarray([noise, length, noise_w], dtype=np.float32),
            "lid": np.asarray([0], dtype=np.int64),
            "prosody_features": np.expand_dims(np.asarray(prosody_array, dtype=np.int64), 0),
            "speaker_embedding": np.zeros((1, embedding_dim), dtype=np.float32),
            "speaker_embedding_mask": np.asarray([[0]], dtype=np.int64),
        })
        audio = audio_float_to_int16(outputs[0].squeeze())
        durations = outputs[1] if len(outputs) > 1 else None
        if was_padded:
            audio = (_trim_padding_by_durations(audio, np.asarray(durations).reshape(-1), front_pad, back_pad, hop_size)
                     if durations is not None else _trim_silence(audio, sample_rate=sample_rate))
        raw_path = raw_dir / f"{line['id']}.wav"
        voice_path = voice_dir / f"{line['id']}.mp3"
        write_wav(str(raw_path), sample_rate, audio)
        first_pass = analyze_loudness(ffmpeg, raw_path, PREFILTERS)
        second_pass = (
            f"{PREFILTERS},{LOUDNORM}:measured_I={first_pass['integrated_lufs']}:"
            f"measured_LRA={first_pass['lra']}:measured_TP={first_pass['true_peak_db']}:"
            f"measured_thresh={first_pass['threshold']}:offset={first_pass['target_offset']}:"
            "linear=true:print_format=summary"
        )
        run_checked([
            ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-i", str(raw_path),
            "-af", second_pass, "-ar", "44100", "-ac", "1", "-codec:a", "libmp3lame",
            "-b:a", "160k", "-map_metadata", "-1", str(voice_path),
        ])
        run_checked([ffmpeg, "-v", "error", "-i", str(voice_path), "-f", "null", os.devnull])
        mp3 = MP3(voice_path)
        loudness = analyze_loudness(ffmpeg, voice_path)
        query = {
            "id": line["id"], "scene": line["scene"], "japanese": line["japanese"],
            "chinese": line["chinese"], "profile": line["profile"], "requested_params": profile,
            "applied_scales": {"noise_scale": float(noise), "length_scale": float(length), "noise_w": float(noise_w)},
            "language": language, "language_id": 0, "speaker_id": 0,
            "speaker_embedding": {"kind": "zero-vector", "shape": [1, embedding_dim], "mask": 0, "reference_audio": None},
            "phoneme_count": original_count, "padded_phoneme_count": len(padded_ids),
            "short_text_padding": was_padded, "front_padding": front_pad, "back_padding": back_pad,
            "raw_wav": f"raw/{line['id']}.wav", "raw_wav_sha256": sha256(raw_path),
            "loudnorm_first_pass": first_pass, "loudnorm_second_pass_filter": second_pass,
        }
        write_json(query_dir / f"{line['id']}.json", query)
        record = {
            **{key: line[key] for key in ("id", "scene", "japanese", "chinese", "profile", "params")},
            "audio": f"voice/{line['id']}.mp3", "query": f"queries/{line['id']}.json",
            "duration_seconds": round(float(mp3.info.length), 6),
            "sample_rate_hz": int(mp3.info.sample_rate), "channels": int(mp3.info.channels),
            "bitrate_kbps": round(float(mp3.info.bitrate) / 1000),
            "integrated_lufs": loudness["integrated_lufs"], "true_peak_db": loudness["true_peak_db"],
            "sha256": sha256(voice_path),
        }
        generated.append(record)
        generation_log.append({"index": index, "id": line["id"], "status": "generated-and-decoded",
                               "duration_seconds": record["duration_seconds"], "sha256": record["sha256"]})
        write_json(output_dir / "generation-log.json", generation_log)
        print(f"[{index:02d}/{len(lines)}] {line['id']}：{record['duration_seconds']:.3f} 秒，{record['integrated_lufs']} LUFS")
    hashes = {line["sha256"] for line in generated}
    result = {
        "schema_version": 1, "generated_at": datetime.now(timezone.utc).isoformat(), "status": "draft",
        "purpose": released["purpose"], "engine": engine,
        "reproduction": {"input_manifest_sha256": sha256(manifest_path),
                         "byte_deterministic": False, "published_files_modified": False},
        "runtime": {"python": platform.python_version(), "onnxruntime": ort.__version__,
                    "providers": session.get_providers(), "ffmpeg": ffmpeg_version},
        "synthesis": released["synthesis"], "postprocessing": released["postprocessing"],
        "validation": {"model_hash_match": True, "source_commit_match": True, "line_count": len(generated),
                       "decoded_file_count": len(generated), "all_files_decodable": True,
                       "unique_sha256_count": len(hashes), "all_hashes_unique": len(hashes) == len(generated)},
        "lines": generated,
    }
    write_json(output_dir / "draft-manifest.json", result)
    print(f"已生成到：{output_dir}；发布目录未改动。")


if __name__ == "__main__":
    main()
