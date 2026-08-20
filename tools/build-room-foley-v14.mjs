import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "assets", "audio", "v14");
const sourceDirectory = await mkdtemp(join(tmpdir(), "sagiri-room-foley-v14-"));

const sources = [
  {
    scene: "画桌·数位笔补线",
    output: "desk-stylus-line.mp3",
    id: 370216,
    creator: "Euphrosyyn",
    title: "SFX_StylusTabletDrawing Pen_DrawingOnTabletSurface.wav",
    page: "https://freesound.org/s/370216/",
    preview: "https://cdn.freesound.org/previews/370/370216_5051822-hq.mp3",
    previewSha256: "e484647ca7f9f0ba516211ff493d9f70befeb23e767b52e97ced1bf3bc704186",
    originalSpec: "44.1 kHz / 24-bit / stereo WAV；真实数位笔刮过绘图板的一次动作",
    start: 2.78,
    duration: 1.8
  },
  {
    scene: "画桌·转过数位板",
    output: "desk-tablet-turn.mp3",
    id: 561017,
    creator: "TurboFool",
    title: "Sliding Book",
    page: "https://freesound.org/s/561017/",
    preview: "https://cdn.freesound.org/previews/561/561017_9160390-hq.mp3",
    previewSha256: "5ce06ad27879d0f242ddc13b2d581c78962133d7b1eed4ff164eeede7f5ca1b9",
    originalSpec: "48 kHz / 32-bit / mono WAV；Blue Snowball 近距录制书本在桌面滑动",
    start: 4.14,
    duration: 1.08
  },
  {
    scene: "画桌·按键保存",
    output: "desk-save-key.mp3",
    id: 789629,
    creator: "Sadiquecat",
    title: "Keychron k10 Enter",
    page: "https://freesound.org/s/789629/",
    preview: "https://cdn.freesound.org/previews/789/789629_5287430-hq.mp3",
    previewSha256: "d6c152c6f3b698d9874776ef88fb03a16471b1912588d157d5f398023ef7726a",
    originalSpec: "96 kHz / 24-bit WAV；Zoom H2n XY 模式录制 Keychron K10 的一次 Enter 按键",
    start: 0,
    duration: 0.6
  },
  {
    scene: "床边·收回毯角",
    output: "bed-blanket-fold.mp3",
    id: 493262,
    creator: "Joao_Janz",
    title: "Blanket Rustling Movement 1_2",
    page: "https://freesound.org/s/493262/",
    preview: "https://cdn.freesound.org/previews/493/493262_9961300-hq.mp3",
    previewSha256: "c4abf0138b033e2a47de9021d5a3c894cb558266848c10a94ea089ea4092ec26",
    originalSpec: "48 kHz / 24-bit / stereo WAV；Tascam DR-40 录制的短被毯折动",
    start: 0.45,
    duration: 1.72
  },
  {
    scene: "床边·收起被窝帐篷",
    output: "bed-fort-rustle.mp3",
    id: 543573,
    creator: "BiancaDrey",
    title: "shufflinginbed.wav",
    page: "https://freesound.org/s/543573/",
    preview: "https://cdn.freesound.org/previews/543/543573_11124579-hq.mp3",
    previewSha256: "e529374fedc7851ee4d8d33ee380722f973e7dba9553ab5e289617eb2e1ed727",
    originalSpec: "48 kHz / 24-bit / stereo WAV；Zoom H6 与 Rode NTG2 录制的床单和被子移动",
    start: 1.6,
    duration: 2.9
  },
  {
    scene: "床边·推来靠枕",
    output: "bed-pillow-pat.mp3",
    id: 389799,
    creator: "krnash",
    title: "Hitting Bed with Pillow.wav",
    page: "https://freesound.org/s/389799/",
    preview: "https://cdn.freesound.org/previews/389/389799_6136319-hq.mp3",
    previewSha256: "ad103c96f93235b013ddd087ee6f7911e6674ee1b6b4d33ffcdbac9580119d2c",
    originalSpec: "48 kHz / 24-bit / stereo WAV；枕头落在床面的多次真实录音",
    start: 2.55,
    duration: 1.25
  },
  {
    scene: "衣橱·扶稳衣架",
    output: "wardrobe-hanger-settle.mp3",
    id: 764474,
    creator: "CarikaDarvall",
    title: "Hanging clothes",
    page: "https://freesound.org/s/764474/",
    preview: "https://cdn.freesound.org/previews/764/764474_15688439-hq.mp3",
    previewSha256: "36b1de507a39f59bee9eebb13b10a60b3fae3f4e5934dc5c5c820b8d77bca79d",
    originalSpec: "48 kHz / 24-bit / stereo WAV；衣物实际挂入衣橱",
    start: 2.7,
    duration: 0.75
  },
  {
    scene: "衣橱·收起猫耳毯",
    output: "wardrobe-fabric-swish.mp3",
    id: 701647,
    creator: "IENBA",
    title: "Fabric Flapping",
    page: "https://freesound.org/s/701647/",
    preview: "https://cdn.freesound.org/previews/701/701647_9616576-hq.mp3",
    previewSha256: "6c23355114c3d12d4c785acbfb10f7e5c854ddeb3bd28527a49289da6907a543",
    originalSpec: "48 kHz / 24-bit / stereo WAV；Zoom H4n 与 Sennheiser MKH50 录制的多种布料移动",
    start: 8.72,
    duration: 2
  },
  {
    scene: "衣橱·并排举起两套衣服",
    output: "wardrobe-choice.mp3",
    id: 577888,
    creator: "Breezy2000uk",
    title: "Clothes Hangers on a Metal Rail.wav",
    page: "https://freesound.org/s/577888/",
    preview: "https://cdn.freesound.org/previews/577/577888_2626411-hq.mp3",
    previewSha256: "c53d223d9b04f4619f407f7f2fd16271eb30aded0e7a9ad18430c65cbdf889a0",
    originalSpec: "48 kHz / 24-bit / stereo WAV；带衣物与空衣架在金属轨道上的多次移动",
    start: 5.82,
    duration: 1.56
  },
  {
    scene: "窗台·关小窗缝",
    output: "window-latch-close.mp3",
    id: 776184,
    creator: "soundandmelodies",
    title: "SFX-Window,Closing",
    page: "https://freesound.org/s/776184/",
    preview: "https://cdn.freesound.org/previews/776/776184_10924423-hq.mp3",
    previewSha256: "adf13f809bec1a74ef7b96b8113695bbfc1fdf1122a1fb4e6bc2f87ecd8e317e",
    originalSpec: "48 kHz / 24-bit / stereo WAV；真实公寓旧窗关闭",
    start: 1,
    duration: 1.42
  },
  {
    scene: "窗台·摆好画纸",
    output: "window-paper-slide.mp3",
    id: 46631,
    creator: "123jorre456",
    title: "sliding paper on table.wav",
    page: "https://freesound.org/s/46631/",
    preview: "https://cdn.freesound.org/previews/46/46631_326544-hq.mp3",
    previewSha256: "c2209a62a13572dc8c4fe50223ba110590fbd30bf5dc74e01e0eb605256a7c0a",
    originalSpec: "48 kHz / 16-bit / stereo WAV；纸张沿桌面移动的多次真实录音",
    start: 6.85,
    duration: 0.84
  },
  {
    scene: "窗台·合上窗帘",
    output: "window-curtain-close.mp3",
    id: 708206,
    creator: "Kate_is_yellow",
    title: "Opening and Closing of Curtains",
    page: "https://freesound.org/s/708206/",
    preview: "https://cdn.freesound.org/previews/708/708206_14710317-hq.mp3",
    previewSha256: "3acb6cc6534869793f7f6df38c93d012c21fe03f93b5143202b330f0125c6387",
    originalSpec: "44.1 kHz / 24-bit / stereo WAV；Zoom H6 枪式麦克风录制厚窗帘在塑料轨道上收拢",
    start: 10.2,
    duration: 0.92
  }
];

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${command} 执行失败：${result.stderr || result.stdout}`);
  }
  return result;
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function downloadSource(source) {
  const response = await fetch(source.preview);
  if (!response.ok) throw new Error(`下载失败 ${source.id}：HTTP ${response.status}`);
  const sourceFile = join(sourceDirectory, `${source.id}.mp3`);
  await writeFile(sourceFile, Buffer.from(await response.arrayBuffer()));
  const actualHash = await sha256(sourceFile);
  if (actualHash !== source.previewSha256) {
    throw new Error(`来源哈希不一致 ${source.id}：${actualHash}`);
  }
  return sourceFile;
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
const files = [];

for (const source of sources) {
  const sourceFile = await downloadSource(source);
  const outputFile = join(outputDirectory, source.output);
  const fadeOutStart = Math.max(0, source.duration - 0.1).toFixed(3);
  run("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-ss", String(source.start), "-t", String(source.duration), "-i", sourceFile,
    "-af", `highpass=f=65,lowpass=f=16000,loudnorm=I=-18:TP=-2:LRA=5,afade=t=in:st=0:d=0.025,afade=t=out:st=${fadeOutStart}:d=0.10`,
    "-ar", "48000", "-ac", "2", "-c:a", "libmp3lame", "-b:a", "192k", outputFile
  ]);
  const probe = JSON.parse(run("ffprobe", [
    "-v", "error", "-show_entries", "format=duration:stream=codec_name,sample_rate,channels,bit_rate",
    "-of", "json", outputFile
  ]).stdout);
  files.push({
    scene: source.scene,
    audio: source.output,
    source_id: source.id,
    source_page: source.page,
    source_preview_sha256: source.previewSha256,
    trim_start_seconds: source.start,
    trim_duration_seconds: source.duration,
    duration_seconds: Number(Number(probe.format.duration).toFixed(3)),
    sha256: await sha256(outputFile),
    ...measureLoudness(outputFile)
  });
  process.stdout.write(`完成：${source.scene} -> ${source.output}\n`);
}

const manifest = {
  schema_version: 2,
  generated_at: "2026-08-20",
  purpose: "画桌、床边、衣橱与窗台的 12 个操作使用 12 份独立真实现场录音；不使用程序化噪声，不跨事件复用。",
  generation: {
    tool: "FFmpeg 6.1.1",
    source: "Freesound 官方 HQ 预览；全部来源页面标记为 Creative Commons 0",
    processing: "按动作截取一次真实表演，65 Hz 高通、16 kHz 低通、I=-18/TP=-2/LRA=5 响度处理、25 ms 淡入、100 ms 淡出",
    autoplay: false,
    loop: false
  },
  output: {
    codec: "MP3",
    sample_rate_hz: 48000,
    channels: 2,
    bitrate_kbps: 192
  },
  sources: sources.map(({ id, creator, title, page, preview, previewSha256, originalSpec }) => ({
    id,
    creator,
    title,
    source_page: page,
    retrieved_asset: preview,
    retrieved_asset_sha256: previewSha256,
    original_spec: originalSpec,
    license: "CC0 1.0"
  })),
  files
};

await writeFile(join(outputDirectory, "scene-sound-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(`清单：${join(outputDirectory, "scene-sound-manifest.json")}\n`);
