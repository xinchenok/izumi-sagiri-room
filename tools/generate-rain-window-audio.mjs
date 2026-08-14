import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 48000;
const DURATION_SECONDS = 7.2;
const CHANNELS = 2;
const FRAME_COUNT = Math.round(SAMPLE_RATE * DURATION_SECONDS);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "assets/audio/v8/weather-rain-window.mp3");
const temporaryWav = resolve(tmpdir(), "sagiri-weather-rain-window.wav");

let seed = 0x5a17c9e3;

function random() {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 4294967296;
}

function signedRandom() {
  return random() * 2 - 1;
}

function createPinkFilter() {
  const state = new Float64Array(7);
  return (white) => {
    state[0] = 0.99886 * state[0] + white * 0.0555179;
    state[1] = 0.99332 * state[1] + white * 0.0750759;
    state[2] = 0.969 * state[2] + white * 0.153852;
    state[3] = 0.8665 * state[3] + white * 0.3104856;
    state[4] = 0.55 * state[4] + white * 0.5329522;
    state[5] = -0.7616 * state[5] - white * 0.016898;
    const pink = state[0] + state[1] + state[2] + state[3] + state[4] + state[5] + state[6] + white * 0.5362;
    state[6] = white * 0.115926;
    return pink * 0.11;
  };
}

function equalPowerPan(pan) {
  const angle = (pan + 1) * Math.PI / 4;
  return [Math.cos(angle), Math.sin(angle)];
}

const left = new Float64Array(FRAME_COUNT);
const right = new Float64Array(FRAME_COUNT);
const pinkLeft = createPinkFilter();
const pinkRight = createPinkFilter();
let lowLeft = 0;
let lowRight = 0;
let roomLeft = 0;
let roomRight = 0;
const lowCoefficient = 1 - Math.exp(-2 * Math.PI * 220 / SAMPLE_RATE);
const roomCoefficient = 1 - Math.exp(-2 * Math.PI * 7200 / SAMPLE_RATE);

for (let index = 0; index < FRAME_COUNT; index += 1) {
  const time = index / SAMPLE_RATE;
  const common = signedRandom();
  const rawLeft = common * 0.76 + signedRandom() * 0.24;
  const rawRight = common * 0.76 + signedRandom() * 0.24;
  const rainLeft = pinkLeft(rawLeft);
  const rainRight = pinkRight(rawRight);
  lowLeft += lowCoefficient * (rainLeft - lowLeft);
  lowRight += lowCoefficient * (rainRight - lowRight);
  roomLeft += roomCoefficient * (rainLeft - roomLeft);
  roomRight += roomCoefficient * (rainRight - roomRight);
  const slowMovement = 0.86
    + 0.08 * Math.sin(2 * Math.PI * 0.19 * time + 0.4)
    + 0.05 * Math.sin(2 * Math.PI * 0.37 * time + 1.8);
  left[index] = ((roomLeft - lowLeft * 0.72) * 0.056 + lowLeft * 0.017) * slowMovement;
  right[index] = ((roomRight - lowRight * 0.72) * 0.056 + lowRight * 0.017) * slowMovement;
}

function addGlassDrop({ time, amplitude, frequency, decay, pan, body = 0.42 }) {
  const start = Math.round(time * SAMPLE_RATE);
  const length = Math.min(FRAME_COUNT - start, Math.round(decay * SAMPLE_RATE * 6));
  const [leftGain, rightGain] = equalPowerPan(pan);
  for (let offset = 0; offset < length; offset += 1) {
    const seconds = offset / SAMPLE_RATE;
    const envelope = Math.exp(-seconds / decay);
    const attack = Math.min(1, offset / 18);
    const bright = Math.sin(2 * Math.PI * frequency * seconds + 0.32);
    const glass = Math.sin(2 * Math.PI * frequency * 1.91 * seconds + 1.2) * 0.34;
    const frame = Math.sin(2 * Math.PI * frequency * body * seconds) * 0.23;
    const splash = signedRandom() * Math.exp(-seconds / 0.012) * 0.18;
    const value = (bright + glass + frame + splash) * envelope * attack * amplitude;
    left[start + offset] += value * leftGain;
    right[start + offset] += value * rightGain;
  }
}

for (let index = 0; index < 54; index += 1) {
  addGlassDrop({
    time: 0.16 + random() * (DURATION_SECONDS - 0.52),
    amplitude: 0.006 + random() * 0.024,
    frequency: 1150 + random() * 3850,
    decay: 0.018 + random() * 0.052,
    pan: signedRandom() * 0.92,
    body: 0.24 + random() * 0.28
  });
}

for (let index = 0; index < 13; index += 1) {
  addGlassDrop({
    time: 0.28 + random() * (DURATION_SECONDS - 0.76),
    amplitude: 0.018 + random() * 0.035,
    frequency: 430 + random() * 980,
    decay: 0.065 + random() * 0.11,
    pan: signedRandom() * 0.78,
    body: 0.5 + random() * 0.2
  });
}

for (let index = 0; index < 8; index += 1) {
  const start = Math.round((0.25 + random() * (DURATION_SECONDS - 0.9)) * SAMPLE_RATE);
  const duration = 0.11 + random() * 0.22;
  const length = Math.min(FRAME_COUNT - start, Math.round(duration * SAMPLE_RATE));
  const [leftGain, rightGain] = equalPowerPan(signedRandom() * 0.86);
  let smoothed = 0;
  const coefficient = 1 - Math.exp(-2 * Math.PI * (1700 + random() * 2300) / SAMPLE_RATE);
  for (let offset = 0; offset < length; offset += 1) {
    smoothed += coefficient * (signedRandom() - smoothed);
    const progress = offset / Math.max(1, length - 1);
    const envelope = Math.sin(Math.PI * progress) ** 1.6;
    const value = smoothed * envelope * (0.0035 + random() * 0.0015);
    left[start + offset] += value * leftGain;
    right[start + offset] += value * rightGain;
  }
}

const fadeInFrames = Math.round(0.16 * SAMPLE_RATE);
const fadeOutFrames = Math.round(0.42 * SAMPLE_RATE);
let peak = 0;
let squaredSum = 0;
for (let index = 0; index < FRAME_COUNT; index += 1) {
  const fadeIn = Math.min(1, index / fadeInFrames);
  const fadeOut = Math.min(1, (FRAME_COUNT - 1 - index) / fadeOutFrames);
  const envelope = Math.min(fadeIn, fadeOut);
  left[index] *= envelope;
  right[index] *= envelope;
  peak = Math.max(peak, Math.abs(left[index]), Math.abs(right[index]));
  squaredSum += left[index] ** 2 + right[index] ** 2;
}

const rms = Math.sqrt(squaredSum / (FRAME_COUNT * CHANNELS));
const targetRms = 10 ** (-25 / 20);
const targetPeak = 10 ** (-7.5 / 20);
const gain = Math.min(targetRms / rms, targetPeak / peak);
const headerSize = 44;
const bytesPerSample = 2;
const dataSize = FRAME_COUNT * CHANNELS * bytesPerSample;
const wav = Buffer.alloc(headerSize + dataSize);
wav.write("RIFF", 0);
wav.writeUInt32LE(36 + dataSize, 4);
wav.write("WAVE", 8);
wav.write("fmt ", 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(CHANNELS, 22);
wav.writeUInt32LE(SAMPLE_RATE, 24);
wav.writeUInt32LE(SAMPLE_RATE * CHANNELS * bytesPerSample, 28);
wav.writeUInt16LE(CHANNELS * bytesPerSample, 32);
wav.writeUInt16LE(bytesPerSample * 8, 34);
wav.write("data", 36);
wav.writeUInt32LE(dataSize, 40);

for (let index = 0; index < FRAME_COUNT; index += 1) {
  const leftSample = Math.max(-1, Math.min(1, left[index] * gain));
  const rightSample = Math.max(-1, Math.min(1, right[index] * gain));
  wav.writeInt16LE(Math.round(leftSample * 32767), headerSize + index * 4);
  wav.writeInt16LE(Math.round(rightSample * 32767), headerSize + index * 4 + 2);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(temporaryWav, wav);
const encode = spawnSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y",
  "-i", temporaryWav,
  "-codec:a", "libmp3lame", "-b:a", "192k", "-ar", String(SAMPLE_RATE), "-ac", String(CHANNELS),
  "-metadata", "title=Bedroom rain beyond a closed window",
  "-metadata", "comment=Original deterministic procedural synthesis; no third-party recording",
  outputPath
], { stdio: "inherit" });
rmSync(temporaryWav, { force: true });
if (encode.status !== 0) process.exit(encode.status ?? 1);

const encoded = readFileSync(outputPath);
const digest = createHash("sha256").update(encoded).digest("hex");
console.log(JSON.stringify({
  output: outputPath,
  duration_seconds: DURATION_SECONDS,
  sample_rate_hz: SAMPLE_RATE,
  channels: CHANNELS,
  bitrate_kbps: 192,
  sha256: digest
}, null, 2));
