import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "assets", "audio", "v16");
const temporaryDirectory = await mkdtemp(join(tmpdir(), "sagiri-goodnight-door-v16-"));
const source = {
  id: 216877,
  creator: "CastIronCarousel",
  title: "Slow gentle close of squeaky wooden door.wav",
  page: "https://freesound.org/s/216877/",
  preview: "https://cdn.freesound.org/previews/216/216877_4049088-hq.mp3",
  previewSha256: "49ee8a68a7df8e7832aedbe43f44b0c1879ac9087fa3894256562001ade5f070",
  originalSpec: "96 kHz / 16-bit / stereo WAV；录音棚内一次缓慢轻关木门实录",
  start: 0.22,
  duration: 2.72
};

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${command} 执行失败：${result.stderr || result.stdout}`);
  return result;
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

function measureLoudness(file) {
  const result = run("ffmpeg", [
    "-hide_banner", "-nostats", "-i", file,
    "-filter_complex", "ebur128=peak=true",
    "-f", "null", "-"
  ]);
  const integrated = [...result.stderr.matchAll(/I:\s*(-?[\d.]+) LUFS/g)].at(-1)?.[1];
  const truePeak = [...result.stderr.matchAll(/Peak:\s*(-?[\d.]+) dBFS/g)].at(-1)?.[1];
  return {
    integrated_lufs: integrated ? Number(integrated) : null,
    true_peak_dbfs: truePeak ? Number(truePeak) : null
  };
}

await mkdir(outputDirectory, { recursive: true });
const response = await fetch(source.preview);
if (!response.ok) throw new Error(`来源下载失败：HTTP ${response.status}`);
const sourceFile = join(temporaryDirectory, "goodnight-door-source.mp3");
await writeFile(sourceFile, Buffer.from(await response.arrayBuffer()));
const sourceHash = await sha256(sourceFile);
if (sourceHash !== source.previewSha256) throw new Error(`来源哈希不一致：${sourceHash}`);

const outputFile = join(outputDirectory, "goodnight-door-close.mp3");
run("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y",
  "-ss", String(source.start), "-t", String(source.duration), "-i", sourceFile,
  "-af", "highpass=f=55,lowpass=f=16000,acompressor=threshold=-30dB:ratio=3:attack=6:release=140:makeup=7dB,loudnorm=I=-21:TP=-3:LRA=5,afade=t=in:st=0:d=0.025,afade=t=out:st=2.57:d=0.15",
  "-ar", "48000", "-ac", "2", "-c:a", "libmp3lame", "-b:a", "192k", outputFile
]);

const probe = JSON.parse(run("ffprobe", [
  "-v", "error", "-show_entries", "format=duration,size:stream=codec_name,sample_rate,channels,bit_rate",
  "-of", "json", outputFile
]).stdout);
const manifest = {
  schema_version: 1,
  generated_at: "2026-08-20",
  purpose: "收下晚安纸条后播放一次独立的室内轻关门实录，与窗户、窗帘和房间物件声分开。",
  autoplay: false,
  loop: false,
  source: {
    id: source.id,
    creator: source.creator,
    title: source.title,
    source_page: source.page,
    retrieved_asset: source.preview,
    retrieved_asset_sha256: source.previewSha256,
    original_spec: source.originalSpec,
    license: "CC0 1.0"
  },
  output: {
    audio: "goodnight-door-close.mp3",
    codec: probe.streams[0].codec_name,
    sample_rate_hz: Number(probe.streams[0].sample_rate),
    channels: probe.streams[0].channels,
    bitrate_kbps: Math.round(Number(probe.streams[0].bit_rate) / 1000),
    duration_seconds: Number(Number(probe.format.duration).toFixed(3)),
    size_bytes: Number(probe.format.size),
    sha256: await sha256(outputFile),
    trim_start_seconds: source.start,
    trim_duration_seconds: source.duration,
    processing: "去除动作前空白，保留一次完整慢速关门；55 Hz 高通、16 kHz 低通、宽动态轻压缩、I=-21/TP=-3/LRA=5 响度处理与短淡入淡出。",
    ...measureLoudness(outputFile)
  }
};

await writeFile(join(outputDirectory, "goodnight-door-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(`完成：${outputFile}\n`);
process.stdout.write(`清单：${join(outputDirectory, "goodnight-door-manifest.json")}\n`);
