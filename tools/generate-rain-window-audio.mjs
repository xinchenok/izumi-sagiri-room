import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_URL = "https://cdn.freesound.org/previews/648/648529_457982-hq.mp3";
const SOURCE_PAGE = "https://freesound.org/s/648529/";
const SOURCE_SHA256 = "536a435b4d96608aeeff56786652114fe66748184807d87c2303d7087eb309a0";
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "assets/audio/v8/weather-rain-window.mp3");
const sourcePath = resolve(tmpdir(), "sagiri-freesound-648529-hq.mp3");

const response = await fetch(SOURCE_URL);
if (!response.ok) throw new Error(`窗雨源录音下载失败：${response.status}`);
const source = Buffer.from(await response.arrayBuffer());
const sourceDigest = createHash("sha256").update(source).digest("hex");
if (sourceDigest !== SOURCE_SHA256) {
  throw new Error(`窗雨源录音校验失败：预期 ${SOURCE_SHA256}，实际 ${sourceDigest}`);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(sourcePath, source);
const encode = spawnSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y",
  "-ss", "44", "-t", "24", "-i", sourcePath,
  "-af", "highpass=f=70,loudnorm=I=-23:LRA=8:TP=-4,afade=t=in:st=0:d=0.08,afade=t=out:st=23.2:d=0.8",
  "-codec:a", "libmp3lame", "-b:a", "192k", "-ar", "48000", "-ac", "2",
  "-metadata", "title=Light rain on bedroom window",
  "-metadata", "artist=nicoproson",
  "-metadata", `source=${SOURCE_PAGE}`,
  "-metadata", "license=CC0 1.0",
  "-metadata", "comment=Edited from Freesound 648529 official HQ preview; 44-68s excerpt, high-pass 70 Hz, EBU R128 -23 LUFS, short fades",
  outputPath
], { stdio: "inherit" });
rmSync(sourcePath, { force: true });
if (encode.status !== 0) process.exit(encode.status ?? 1);

const output = await readFile(outputPath);
console.log(JSON.stringify({
  source: SOURCE_PAGE,
  source_sha256: sourceDigest,
  license: "CC0 1.0",
  output: outputPath,
  duration_seconds: 24.024,
  sample_rate_hz: 48000,
  channels: 2,
  bitrate_kbps: 192,
  sha256: createHash("sha256").update(output).digest("hex")
}, null, 2));
