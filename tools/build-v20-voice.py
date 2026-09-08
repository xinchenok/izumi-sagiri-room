"""用既有固定 Piper Plus つくよみちゃん生成 V20 的 24 句配音，不下载模型。"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import platform
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SOURCE_COMMIT = "5fceade2c284a85c8da0523c48b830b434350309"
MODEL_REVISION = "36b59c825c36bd386b8960cf3f604382f52f2a87"
MODEL_FILE = "tsukuyomi-chan-6lang-fp16.onnx"
MODEL_SHA256 = "5289e9b6eaf21080803b7fe1c4dc85b5491d4c216121207a41df18dd5f68e5d7"
CONFIG_SHA256 = "516058f405ec914140f34832a9d8bb5d8272ba62af9bc7ffb29349715a539780"
PARAMETERS = {"noise_scale": 0.64, "length_scale": 1.50, "noise_w": 0.76}
PREFILTERS = "highpass=f=70,lowpass=f=10500"
LINES = [
    ("welcome", "迎接", "おかえり。今日は……どこから見たい？", "欢迎回来。今天……想先看看哪里？"),
    ("desk-arrive", "走到桌边", "ここなら、手元が見えるでしょ。静かにしててね。", "在这里就能看清我手边了吧。要安静一点哦。"),
    ("draft-noticed", "草稿被看见", "あっ、それはまだ下書き。そんなにじっと見ないで……。", "啊，那还是草稿。别那么认真地盯着看……"),
    ("draw-invite", "邀请一起画", "この絵、一緒に考えてみる？　少しだけなら、頼ってもいいかな。", "这张画，要一起想想吗？稍微依靠你一下……可以吗？"),
    ("quiet-company", "安静陪伴", "話さなくても、大丈夫。そこにいてくれるだけでいいの。", "不说话也没关系。你待在那里就好。"),
    ("theme-cat", "选小猫主题", "小さな猫にしよう。耳も、しっぽも……丁寧に描きたいな。", "那就画只小猫吧。耳朵、尾巴……都想认真画好。"),
    ("palette-chosen", "选配色", "この色にするんだね。じゃあ、ここから少しずつ塗ってみよう。", "选这个颜色呀。那就从这里开始，慢慢涂上去吧。"),
    ("feedback-ask", "询问具体感想", "どこが好きだった？　色とか、表情とか……ちゃんと聞きたい。", "你喜欢哪里呢？颜色、表情之类的……我想认真听听。"),
    ("artwork-reveal", "展示完成稿", "できた。二人で決めたところ、ちゃんと絵になったね。", "画好了。我们一起决定的那些地方，真的变成画了呢。"),
    ("draft-resume", "恢复未完成稿", "この続き、覚えてるよ。残しておいたところから、また描こう。", "我记得这张画还没画完。就从留下来的地方，继续画吧。"),
    ("gallery-open", "打开画册", "スケッチブックを開くね。まだ恥ずかしいけど……見てもいいよ。", "我要打开画册了。虽然还是有点害羞……但可以给你看。"),
    ("gallery-turn", "慢慢翻页", "ページは、ゆっくりね。描き込みも、見つけてくれたら嬉しい。", "翻页慢一点哦。如果你能发现画里的小细节，我会很开心。"),
    ("gallery-favorite", "问最喜欢哪张", "この中で、どの絵が一番好き？　理由も、少しだけ教えて。", "这些画里，你最喜欢哪一张？理由也稍微告诉我一点吧。"),
    ("praise-received", "被认真夸奖", "そんなところまで見てくれたんだ……。うん、嬉しい。", "原来你连那种小地方都注意到了……嗯，我很开心。"),
    ("wardrobe-compare", "衣橱比较", "並べてみると、雰囲気が違うね。今日は、どれがいいかな。", "放在一起看，感觉还真不一样呢。今天穿哪件好呢？"),
    ("outfit-home", "粉色猫耳家居外套与奶油长裤", "このピンクの上着、袖が長くて落ち着くの。部屋では、これが楽。", "这件粉色外套袖子长长的，让人很安心。在房间里穿它很舒服。"),
    ("outfit-artist", "蓝白格睡衣", "青いチェックのパジャマだよ。描くときも、ゆったりしてて好き。", "是蓝色格纹睡衣哦。画画时也很宽松，我很喜欢。"),
    ("outfit-outing", "薄荷针织外套与水手领裙装", "ミント色のカーディガン、似合ってる？　リボンも、曲がってないかな。", "薄荷色的针织外套，适合我吗？蝴蝶结也……没有歪吧。"),
    ("outfit-bedtime", "草莓奶油粉睡衣长裤", "いちごミルクみたいな色でしょ。このパジャマ、肌触りがいいの。", "像草莓牛奶一样的颜色吧。这套睡衣摸起来很舒服。"),
    ("outfit-hooded", "薄荷灰猫耳连帽毯与长裤", "この毛布、猫の耳がついてるの。すっぽり包まると、あったかいよ。", "这条毯子带着猫耳朵。把自己整个裹起来，就暖暖的。"),
    ("window-rain", "窗边细雨，仅在雨天触发", "細かい雨の音、聞こえる？　しばらく、ここで聞いていようか。", "听得见细细的雨声吗？要不要在这里听一会儿？"),
    ("bed-plush", "床边抱玩偶", "この子、抱いてると落ち着くの。ふわふわで、ちょうどいい大きさ。", "抱着这个孩子就会安心。软软的，大小也刚刚好。"),
    ("goodnight", "晚安", "おやすみ。明日も……無理しないでね。", "晚安。明天也……不要勉强自己哦。"),
    ("note-kept", "收好纸条", "その紙、なくさないでね。読んだら……そっとしまっておいて。", "那张纸不要弄丢哦。读完以后……轻轻收好吧。"),
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def write_json(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def run(command: list[str]) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(command, text=True, encoding="utf-8", errors="replace", capture_output=True)
    if result.returncode:
        raise RuntimeError(f"命令执行失败：{' '.join(command)}\n{result.stderr}")
    return result


def measure(ffmpeg: str, path: Path, prefix: str = "", ceiling: float = -2.0) -> dict:
    norm = f"loudnorm=I=-18:TP={ceiling}:LRA=7:print_format=json"
    report = run([ffmpeg, "-hide_banner", "-nostats", "-i", str(path), "-af",
                  f"{prefix},{norm}" if prefix else norm, "-f", "null", os.devnull])
    chunks = re.findall(r'\{\s*"input_i".*?\}', report.stderr, flags=re.DOTALL)
    if not chunks:
        raise RuntimeError(f"无法取得响度测量：{path}")
    values = json.loads(chunks[-1])
    return {"integratedLufs": float(values["input_i"]), "truePeakDb": float(values["input_tp"]),
            "lra": float(values["input_lra"]), "threshold": float(values["input_thresh"]),
            "targetOffset": float(values["target_offset"])}


def normalize(ffmpeg: str, raw: Path, target: Path) -> tuple[dict, dict, str]:
    # 为 MP3 解码后的峰值留出 0.5 dB 余量；记录每句实际测量，不宣称只有目标值。
    ceiling = -2.0
    first = measure(ffmpeg, raw, PREFILTERS, ceiling)
    norm = (f"{PREFILTERS},loudnorm=I=-18:TP={ceiling}:LRA=7:"
            f"measured_I={first['integratedLufs']}:measured_LRA={first['lra']}:"
            f"measured_TP={first['truePeakDb']}:measured_thresh={first['threshold']}:"
            f"offset={first['targetOffset']}:linear=true:print_format=summary")
    measured_candidate = target.parent.parent / "encoding-measurements" / target.name
    measured_candidate.parent.mkdir(exist_ok=True)
    run([ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(raw), "-af", norm,
         "-ar", "44100", "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "160k",
         "-map_metadata", "-1", str(measured_candidate)])
    encoded = measure(ffmpeg, measured_candidate)
    # 对解码后产生的响度差仅补偿固定音量，保留余量；始终从原始 WAV 编码，避免二次有损转码。
    gain_db = min(-18 - encoded["integratedLufs"], -1.65 - encoded["truePeakDb"])
    norm = f"{norm},volume={gain_db:.4f}dB"
    first["encodedMeasurementBeforeGain"] = encoded
    first["decodedLoudnessCorrectionGainDb"] = round(gain_db, 4)
    run([ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(raw), "-af", norm,
         "-ar", "44100", "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "160k",
         "-map_metadata", "-1", str(target)])
    run([ffmpeg, "-v", "error", "-i", str(target), "-f", "null", os.devnull])
    return first, measure(ffmpeg, target), norm


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, default=ROOT / ".tmp/v19-voice/piper-plus-src")
    parser.add_argument("--model-dir", type=Path, default=ROOT / ".tmp/v19-voice/model")
    parser.add_argument("--output-dir", type=Path, help="默认 .tmp/v20-voice/带时间戳目录")
    parser.add_argument("--publish", action="store_true", help="验证通过后复制到尚不存在的 assets/audio/v20")
    parser.add_argument("--ffmpeg", help="可选 FFmpeg 路径，默认当前环境 imageio-ffmpeg")
    parser.add_argument("--reuse-raw", type=Path, help="复用本脚本已有输出目录的 raw 与 queries，不重新合成")
    return parser.parse_args()


def main() -> None:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    args = parse_args()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    output = (args.output_dir or ROOT / ".tmp/v20-voice" / stamp).resolve()
    if output.exists() and any(output.iterdir()):
        raise ValueError("生成目录已有文件，请指定新目录；旧文件不会覆盖")
    published = ROOT / "assets/audio/v20"
    if args.publish and published.exists():
        raise ValueError("assets/audio/v20 已存在，不覆盖既有语音；请仅生成到新临时目录")
    source, model_dir = args.source_dir.resolve(), args.model_dir.resolve()
    actual_commit = run(["git", "-C", str(source), "rev-parse", "HEAD"]).stdout.strip()
    if actual_commit != SOURCE_COMMIT:
        raise ValueError(f"推理源码提交不匹配：{actual_commit}")
    for path, expected in ((model_dir / MODEL_FILE, MODEL_SHA256), (model_dir / "config.json", CONFIG_SHA256)):
        if sha256(path) != expected:
            raise ValueError(f"固定模型或配置哈希不匹配：{path}")

    python_source = source / "src/python"
    sys.path.insert(0, str(python_source))
    sys.path.insert(0, str(python_source / "g2p"))
    import imageio_ffmpeg
    import numpy as np
    import onnxruntime as ort
    from mutagen.mp3 import MP3
    from piper_train.infer_onnx import (
        _adjust_scales_for_short_input, _pad_phoneme_ids, _trim_padding_by_durations,
        _trim_silence, text_to_phoneme_ids_and_prosody,
    )
    from piper_train.ort_utils import create_session_with_cache
    from piper_train.vits.utils import audio_float_to_int16
    from piper_train.vits.wavfile import write as write_wav

    ffmpeg = args.ffmpeg or imageio_ffmpeg.get_ffmpeg_exe()
    config = json.loads((model_dir / "config.json").read_text(encoding="utf-8"))
    sample_rate = int(config["audio"]["sample_rate"])
    session = create_session_with_cache(str(model_dir / MODEL_FILE), device="cpu")
    embedding = next(value for value in session.get_inputs() if value.name == "speaker_embedding")
    embedding_dim = embedding.shape[1] if isinstance(embedding.shape[1], int) else 256
    for name in ("raw", "voice", "queries"):
        (output / name).mkdir(parents=True, exist_ok=True)
    records = []
    for index, (line_id, scene, text_ja, text_zh) in enumerate(LINES, 1):
        previous = None
        if args.reuse_raw:
            previous = json.loads((args.reuse_raw / "queries" / f"{line_id}.json").read_text(encoding="utf-8"))
            if previous["textJa"] != text_ja or previous["textZh"] != text_zh or previous["parameters"] != PARAMETERS:
                raise ValueError(f"复用原始 WAV 的文本或参数不一致：{line_id}")
        phonemes, prosody = text_to_phoneme_ids_and_prosody(
            text_ja, config["phoneme_id_map"], language="ja-en-zh-es-fr-pt",
            language_id_map=config.get("language_id_map", {}))
        original_count = len(phonemes)
        padded, padded_prosody, was_padded, front, back = _pad_phoneme_ids(phonemes, prosody)
        noise, length, noise_w = _adjust_scales_for_short_input(
            padded, PARAMETERS["noise_scale"], PARAMETERS["noise_w"], PARAMETERS["length_scale"],
            original_len=original_count)
        text_input = np.expand_dims(np.asarray(padded, dtype=np.int64), 0)
        prosody_features = [[item["a1"], item["a2"], item["a3"]] if item else [0, 0, 0]
                            for item in padded_prosody or [None] * len(padded)]
        raw_path, final_path = output / "raw" / f"{line_id}.wav", output / "voice" / f"{line_id}.mp3"
        if previous:
            reuse_path = args.reuse_raw / "raw" / f"{line_id}.wav"
            if sha256(reuse_path) != previous["rawSha256"]:
                raise ValueError(f"原始 WAV 哈希不匹配：{line_id}")
            shutil.copy2(reuse_path, raw_path)
        else:
            result = session.run(None, {
                "input": text_input, "input_lengths": np.asarray([text_input.shape[1]], dtype=np.int64),
                "scales": np.asarray([noise, length, noise_w], dtype=np.float32),
                "lid": np.asarray([0], dtype=np.int64),
                "prosody_features": np.expand_dims(np.asarray(prosody_features, dtype=np.int64), 0),
                "speaker_embedding": np.zeros((1, embedding_dim), dtype=np.float32),
                "speaker_embedding_mask": np.asarray([[0]], dtype=np.int64),
            })
            waveform = audio_float_to_int16(result[0].squeeze())
            if was_padded:
                waveform = (_trim_padding_by_durations(waveform, np.asarray(result[1]).reshape(-1), front, back,
                                                       int(config["audio"].get("hop_size", 256)))
                            if len(result) > 1 else _trim_silence(waveform, sample_rate=sample_rate))
            write_wav(str(raw_path), sample_rate, waveform)
        first, loudness, filter_chain = normalize(ffmpeg, raw_path, final_path)
        info = MP3(final_path).info
        query = {
            "id": line_id, "scene": scene, "textJa": text_ja, "textZh": text_zh,
            "parameters": PARAMETERS,
            "appliedScales": {"noise_scale": float(noise), "length_scale": float(length), "noise_w": float(noise_w)},
            "language": "ja-en-zh-es-fr-pt", "languageId": 0, "speakerId": 0,
            "speakerEmbedding": {"kind": "zero-vector", "shape": [1, embedding_dim], "mask": 0, "referenceAudio": None},
            "phonemeCount": original_count, "paddedPhonemeCount": len(padded), "paddingApplied": was_padded,
            "frontPadding": front, "backPadding": back,
            "rawFile": raw_path.relative_to(ROOT).as_posix(), "rawSha256": sha256(raw_path),
            "rawSampleRateHz": sample_rate, "loudnormFirstPass": first, "loudnormSecondPassFilter": filter_chain,
            "rawReusedFrom": str(args.reuse_raw) if args.reuse_raw else None,
        }
        write_json(output / "queries" / f"{line_id}.json", query)
        records.append({
            "id": line_id, "scene": scene, "textJa": text_ja, "textZh": text_zh,
            "file": f"assets/audio/v20/voice/{line_id}.mp3", "duration": round(float(info.length), 6),
            "sha256": sha256(final_path), "parameters": PARAMETERS, "loudness": loudness,
            "rawFile": query["rawFile"], "rawSha256": query["rawSha256"],
            "query": f"assets/audio/v20/queries/{line_id}.json",
            "querySha256": sha256(output / "queries" / f"{line_id}.json"),
            "sampleRateHz": int(info.sample_rate), "channels": int(info.channels),
            "bitrateKbps": round(info.bitrate / 1000), "decoded": True,
        })
        print(f"[{index:02d}/24] {line_id}：{info.length:.3f} 秒，{loudness['integratedLufs']} LUFS，峰值 {loudness['truePeakDb']} dBTP", flush=True)
        write_json(output / "generation-log.json", records)

    accepted = all(math.isfinite(row["loudness"]["integratedLufs"])
                   and abs(row["loudness"]["integratedLufs"] + 18) <= 0.5
                   and row["loudness"]["truePeakDb"] <= -1.5
                   and row["sampleRateHz"] == 44100 and row["channels"] == 1
                   and row["bitrateKbps"] == 160 for row in records)
    manifest = {
        "schemaVersion": 1, "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "ready-for-integration" if accepted else "measurement-needs-review",
        "purpose": "V20 新剧情正式配音；不是声线候选试听，不替换旧版本文件",
        "engine": {"name": "Piper Plus", "source": "https://github.com/ayutaz/piper-plus",
                   "sourceRef": "npm-v0.6.0", "sourceCommit": SOURCE_COMMIT, "pythonSourceVersion": "1.12.0"},
        "model": {"name": "ayousanz/piper-plus-tsukuyomi-chan", "character": "つくよみちゃん",
                  "source": "https://huggingface.co/ayousanz/piper-plus-tsukuyomi-chan",
                  "revision": MODEL_REVISION, "file": MODEL_FILE, "sha256": MODEL_SHA256,
                  "configSha256": CONFIG_SHA256, "license": "tsukuyomi-chan-corpus",
                  "licenseUrl": "https://tyc.rei-yumesaki.net/material/corpus/"},
        "rights": {"websiteUse": "个人非商业同人作品中的预先生成配音，非官方，非原声优",
                   "credit": "Piper Plus つくよみちゃん；つくよみちゃんコーパス（CV.夢前黎 / © Rei Yumesaki）",
                   "redistribution": "音频只作为本网站作品的一部分供欣赏，不授予二次素材利用许可；模型、语料和中间 WAV 不提交。",
                   "voiceCloning": False, "training": False, "fineTuning": False, "referenceAudio": None},
        "runtime": {"python": platform.python_version(), "onnxruntime": ort.__version__,
                    "providers": session.get_providers(), "ffmpeg": run([ffmpeg, "-version"]).stdout.splitlines()[0]},
        "synthesis": {"parameters": PARAMETERS, "speakerEmbedding": "256 维零向量", "speakerEmbeddingMask": 0,
                      "randomSeed": None, "byteDeterministic": False, "pitchShift": False},
        "postprocessing": {"prefilters": PREFILTERS, "loudnorm": "two-pass", "targetLufs": -18,
                           "encodingTruePeakCeilingDb": -2.0, "decodedTruePeakLimitDb": -1.5,
                           "decodedLoudnessCorrection": "测量 MP3 后，在原始 WAV 的第二遍 loudnorm 后施加固定增益；不重编码 MP3，不移调。逐句增益与编码前后测量见 queries。",
                           "codec": "MP3", "sampleRateHz": 44100, "channels": 1, "bitrateKbps": 160},
        "validation": {"lineCount": len(records), "uniqueIds": len({row['id'] for row in records}),
                       "uniqueSha256": len({row['sha256'] for row in records}), "decodedFileCount": len(records),
                       "measurementsPassed": accepted, "subjectiveListening": "待主流程审听，不以仪器测量冒充听感验收"},
        "lines": records,
    }
    write_json(output / "voice-manifest.json", manifest)
    if args.publish and accepted:
        published.mkdir(parents=True)
        shutil.copytree(output / "voice", published / "voice")
        shutil.copytree(output / "queries", published / "queries")
        shutil.copy2(output / "voice-manifest.json", published / "voice-manifest.json")
        print("24 句新配音已复制到 assets/audio/v20；全部旧音频保持原样。")
    elif args.publish:
        print("已有完整中间结果，但响度测量需复核，未复制到发布目录。")
    print(f"原始 WAV 与生成记录：{output}")


if __name__ == "__main__":
    main()
