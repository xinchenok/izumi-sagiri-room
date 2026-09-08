import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "assets", "audio", "v19", "foley");
const manifestPath = join(projectRoot, "assets", "audio", "v19", "scene-sound-manifest.json");
const sourceDirectory = await mkdtemp(join(tmpdir(), "sagiri-cinematic-foley-v19-"));
const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";

const sources = [
  ["房门·轻敲木门", "door-knock-soft.mp3", 635282, "DrFahrts", "soft knocks on door", "635/635282_10249017", "cf4242f93f687eb77f0ff338b33be85ed43778b061e32ea3dd5cfcf82b666062", "44.1 kHz / 32-bit / stereo WAV", 1.31, 1.4],
  ["房门·门把转动", "door-handle-turn.mp3", 213998, "FenrirFangs", "door handle 1.wav", "213/213998_3635427", "d0899c04dfbce9e0784edb092bf38f48640be6c98e73aae7c5bfe6756d958138", "44.1 kHz / 24-bit / stereo WAV", 0.2, 1.2],
  ["房门·木门轻开", "door-open-gentle.mp3", 444386, "MootMcnoodles", "Door opening.wav", "444/444386_7231443", "2e021fbba48c393a8d124c5925101caf03c48a9f77f8275cbd70ac15c4539b00", "48 kHz / 24-bit / stereo WAV", 1.29, 0.76],
  ["房间·笔尖划动", "room-stylus-glide.mp3", 407405, "florianreichelt", "Drawing with a pen", "407/407405_6253486", "b4ee94a0ca3d80d43bedf243cf38ac03b8a14edfbae964eb0641145077caad78", "96 kHz / 24-bit / stereo WAV", 59.93, 1.2],
  ["房间·椅子轻移", "room-chair-slide.mp3", 50701, "RutgerMuller", "Chair Heavy Sliding.wav", "50/50701_179538", "3b894bef35071d3f57ed391b7543729fc03252fd17aca45edc83a84f14a2b7c9", "44.1 kHz / 16-bit / mono WAV", 9.19, 1.2],
  ["房间·窗帘滑动", "room-curtain-slide.mp3", 205074, "jadend2", "Curtains.WAV", "205/205074_2437207", "f260831e2bb8ecb2d7d12c27b3d8d9bf3508f3f501f16623e054a2eef762d09c", "96 kHz / 24-bit / stereo WAV", 0, 1.4],
  ["秘密·耳机放下", "secrets-headphones-set.mp3", 546729, "addison42", "taking off headphones and setting them down.m4a", "546/546729_10596487", "b90fd00c33e320e6b32b3f5c0f79dea76d99882aa5f594ea08e1802ee94078c1", "48 kHz / stereo M4A", 2.64, 1.3],
  ["秘密·稿纸掀起", "secrets-paper-lift.mp3", 211246, "Tomoyo Ichijouji", "PageRustle", "211/211246_1506161", "a621c04bbf56832c53b7e048a6bdb727cea51889f8dbbbd91c7b07962443c761", "44.1 kHz / 16-bit / mono WAV", 0.52, 1.0],
  ["秘密·抽屉锁扣", "secrets-drawer-latch.mp3", 260218, "laura222", "drawer.wav", "260/260218_3339349", "cefdeb358e2534c9567bb135c996c7b8571bb40cc59502e45c07d1ed987b5b51", "44.1 kHz / 16-bit / stereo WAV", 0.83, 1.2],
  ["衣橱·衣架滑动", "wardrobe-hanger-slide.mp3", 554730, "dynamique", "moving clotheshangers.wav", "554/554730_456862", "e5ca51ff0a1a106d58c4cfb3f28639880304559b408f58978c066ee2d7945ca5", "48 kHz / 16-bit / mono WAV", 0.23, 1.2],
  ["衣橱·袖口布料", "wardrobe-sleeve-rustle.mp3", 556711, "NachtmahrTV", "Rustling fabric", "556/556711_5620304", "3773c103f63b93ebce227b10eb1b6cb9f7e4c16f37be128ecd84b3f13dee9ad2", "44.1 kHz / 24-bit / stereo WAV", 1.59, 0.9],
  ["衣橱·丝带轻响", "wardrobe-ribbon-rustle.mp3", 734619, "Vrymaa", "Cloth - Ribbon rustle", "734/734619_13973196", "9d3c0163aae305e73890ea773c40172a20ce949f5270ca01848826993030e988", "44.1 kHz / 16-bit / mono WAV", 24.63, 1.1],
  ["画册·画册打开", "gallery-book-open.mp3", 554837, "The_Runner_01", "Book - Open':Close.wav", "554/554837_4688703", "7adc02f349e7f852db383746be2442ddafbf785ab6e539980818e9f4b6544147", "48 kHz / 24-bit / stereo WAV", 58.39, 1.3],
  ["画册·单页翻动", "gallery-page-turn.mp3", 814247, "Mihacappy", "paperrustle.wav / Notebook Page Flipping", "814/814247_10594370", "508cdaedb42a96a4bff63cb18d4b53b423d728b8d378850920b21113a7eacb92", "48 kHz / 16-bit / stereo WAV", 3.82, 1.0],
  ["画册·照片滑动", "gallery-photo-slide.mp3", 46631, "123jorre456", "sliding paper on table.wav", "46/46631_326544", "c2209a62a13572dc8c4fe50223ba110590fbd30bf5dc74e01e0eb605256a7c0a", "48 kHz / 16-bit / stereo WAV", 11.85, 1.0],
  ["一起画·数位笔短线", "drawing-stylus-line.mp3", 46624, "123jorre456", "drawing fast lines with pencil on paper.wav", "46/46624_326544", "9939b26029596cb6af14930f3baf62fa14a30d6c09b9af984053dbeb84e1fc0c", "48 kHz / 16-bit / stereo WAV", 8.48, 0.9],
  ["一起画·稿纸盖住", "drawing-paper-cover.mp3", 449127, "HarpyHarpHarp", "Rustling Paper", "449/449127_8895476", "415a6c5c0115373b0bc93b06ba01baf525e79324aad9f50ded2c0e678557edf3", "44.1 kHz / stereo MP3", 5.16, 1.1],
  ["一起画·画纸推近", "drawing-sheet-push.mp3", 444426, "MTJohnson", "Sliding Envelope into Drawer.wav", "444/444426_8522109", "ac4cbb746873528177bb9779e8e8915f1fcd1ebc4398475217d7ff18a4842ec6", "48 kHz / 24-bit / stereo WAV", 1.4, 1.0],
  ["晚安·玩偶轻压", "goodnight-plush-squeeze.mp3", 240015, "survivalzombie", "Squeeze Toy.mp3", "240/240015_2297991", "d52433a402b58ca12e436d791b627bf1f5be6ab6fb4e2c6bde53a8860c7e3114", "44.1 kHz / stereo MP3", 0.19, 0.8],
  ["晚安·书本合上", "goodnight-book-close.mp3", 862316, "qubodup", "Close Book 2", "862/862316_71257", "e6a567cb1ac819a33eea2d2fd4e44dac8e19a393e9b87b6dc78172ea7218f93f", "48 kHz / 16-bit / mono FLAC", 0, 0.26],
  ["晚安·门锁轻合", "goodnight-latch.mp3", 405534, "nebulasnails", "Door Lock.wav", "405/405534_2723982", "68de8eefa1c97fc98caf174a535c84b1b23e0f9fa71bb0f2c902a85446ddf181", "44.1 kHz / 32-bit / stereo WAV", 0, 0.7],
].map(([scene, output, id, creator, title, previewStem, previewSha256, originalSpec, start, duration]) => ({
  scene,
  output,
  id,
  creator,
  title,
  page: `https://freesound.org/s/${id}/`,
  preview: `https://cdn.freesound.org/previews/${previewStem}-hq.mp3`,
  previewSha256,
  originalSpec,
  start,
  duration,
}));

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`${command} 执行失败：${result.stderr || result.stdout}`);
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
  if (actualHash !== source.previewSha256) throw new Error(`来源哈希不一致 ${source.id}：${actualHash}`);
  return sourceFile;
}

function probeDuration(file) {
  const result = spawnSync(ffmpeg, ["-hide_banner", "-i", file], { encoding: "utf8" });
  const match = `${result.stderr}\n${result.stdout}`.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!match) return null;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

function measureLoudness(file) {
  const result = run(ffmpeg, ["-hide_banner", "-nostats", "-i", file, "-filter_complex", "ebur128=peak=true", "-f", "null", "-"]);
  const integrated = [...result.stderr.matchAll(/I:\s*(-?[\d.]+) LUFS/g)].at(-1)?.[1];
  const truePeak = [...result.stderr.matchAll(/Peak:\s*(-?[\d.]+) dBFS/g)].at(-1)?.[1];
  return { integrated_lufs: integrated ? Number(integrated) : null, true_peak_dbfs: truePeak ? Number(truePeak) : null };
}

function analyzeLoudnorm(file, prefilters) {
  const result = run(ffmpeg, [
    "-hide_banner", "-nostats", "-i", file,
    "-af", `${prefilters},loudnorm=I=-21:TP=-3:LRA=5:print_format=json`,
    "-f", "null", "-",
  ]);
  const jsonBlock = [...result.stderr.matchAll(/\{\s*"input_i"[\s\S]*?\}/g)].at(-1)?.[0];
  if (!jsonBlock) throw new Error(`无法读取响度首遍结果：${file}`);
  const data = JSON.parse(jsonBlock);
  const values = {
    inputI: Number(data.input_i),
    inputTp: Number(data.input_tp),
    inputLra: Number(data.input_lra),
    inputThresh: Number(data.input_thresh),
    targetOffset: Number(data.target_offset),
  };
  if (Object.values(values).some((value) => !Number.isFinite(value))) {
    throw new Error(`响度首遍结果无效：${file}`);
  }
  return values;
}

await mkdir(outputDirectory, { recursive: true });
const files = [];

for (const source of sources) {
  const sourceFile = await downloadSource(source);
  const outputFile = join(outputDirectory, source.output);
  const workingDuration = Math.max(0.45, source.duration);
  const fadeOutStart = Math.max(0, source.duration - 0.08).toFixed(3);
  const workingFile = join(sourceDirectory, `${source.id}-prepared.wav`);
  run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-ss", String(source.start), "-t", String(source.duration), "-i", sourceFile,
    "-af", `highpass=f=65,lowpass=f=16000,afade=t=in:st=0:d=0.02,afade=t=out:st=${fadeOutStart}:d=0.08,apad=pad_dur=0.5,atrim=duration=${workingDuration}`,
    "-ar", "48000", "-ac", "2", "-c:a", "pcm_s24le", workingFile,
  ]);
  const dynamics = "acompressor=threshold=-24dB:ratio=4:attack=5:release=80:makeup=2";
  const measured = analyzeLoudnorm(workingFile, dynamics);
  const secondPass = `${dynamics},loudnorm=I=-21:TP=-3:LRA=5:measured_I=${measured.inputI}:measured_LRA=${measured.inputLra}:measured_TP=${measured.inputTp}:measured_thresh=${measured.inputThresh}:offset=${measured.targetOffset}:linear=true:print_format=summary`;
  run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y", "-i", workingFile,
    "-af", secondPass,
    "-ar", "48000", "-ac", "2", "-c:a", "libmp3lame", "-b:a", "192k", outputFile,
  ]);
  let loudness = measureLoudness(outputFile);
  let correctiveGainDb = 0;
  for (let attempt = 0; attempt < 3 && loudness.integrated_lufs < -22; attempt += 1) {
    const deficit = -21 - loudness.integrated_lufs;
    correctiveGainDb = Math.min(38, correctiveGainDb + Math.max(2, deficit * 2.3));
    const correction = `volume=${correctiveGainDb.toFixed(2)}dB,alimiter=limit=0.75:attack=1:release=90:level=false,loudnorm=I=-21:TP=-1.5:LRA=5`;
    run(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y", "-i", workingFile,
      "-af", correction,
      "-ar", "48000", "-ac", "2", "-c:a", "libmp3lame", "-b:a", "192k", outputFile,
    ]);
    loudness = measureLoudness(outputFile);
  }
  if (loudness.integrated_lufs < -22.5 || loudness.integrated_lufs > -19.5) {
    throw new Error(`${source.scene} 最终响度超出 -22.5 至 -19.5 LUFS：${loudness.integrated_lufs}`);
  }
  files.push({
    scene: source.scene,
    audio: `foley/${source.output}`,
    source_id: source.id,
    source_page: source.page,
    source_preview_sha256: source.previewSha256,
    trim_start_seconds: source.start,
    trim_duration_seconds: source.duration,
    processing: "截取一次真实动作，65 Hz 高通、16 kHz 低通、轻量动态整理、两遍响度处理、必要时自适应瞬态整平与短淡入淡出",
    corrective_gain_db: Number(correctiveGainDb.toFixed(2)),
    duration_seconds: Number((probeDuration(outputFile) || workingDuration).toFixed(3)),
    sha256: await sha256(outputFile),
    ...loudness,
  });
  process.stdout.write(`完成：${source.scene} -> ${source.output}\n`);
}

const manifest = {
  schema_version: 1,
  generated_at: "2026-09-04",
  purpose: "V19 七幕连续镜头的 21 个主动触发动作使用 21 份独立真实录音，不跨事件复用。",
  generation: {
    tool: "FFmpeg 7.1",
    source: "Freesound 官方 HQ 预览；全部来源页面标记为 Creative Commons 0",
    processing: "按动作截取一次真实表演，65 Hz 高通、16 kHz 低通、轻量动态整理、两遍响度处理、必要时自适应瞬态整平与短淡入淡出",
    autoplay: false,
    loop: false,
  },
  output: { codec: "MP3", sample_rate_hz: 48000, channels: 2, bitrate_kbps: 192 },
  sources: sources.map(({ id, creator, title, page, preview, previewSha256, originalSpec }) => ({
    id,
    creator,
    title,
    source_page: page,
    retrieved_asset: preview,
    retrieved_asset_sha256: previewSha256,
    original_spec: originalSpec,
    license: "CC0 1.0",
  })),
  files,
};

await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(`清单：${manifestPath}\n`);
