import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ARCHIVE = "assets/archive/pre-v20-assets.json";
const OUTFITS = ["home", "artist", "outing", "bedtime", "hooded"];
const POSES = ["standing-neutral", "standing-shy", "standing-blink", "desk-focus", "desk-shy", "desk-blink", "reading-peek", "bed-hug", "bed-sleepy"];
const SKIP = new Set([".git", ".tmp", ".impeccable", ".idea", ".playwright-cli", "node_modules", "output", "test-results", "testresults", "playwright-report", "__pycache__"]);
const TEXT = new Set([".html", ".css", ".js", ".mjs", ".cjs", ".json", ".md", ".txt", ".py", ".svg", ".yaml", ".yml", ".toml", ".sql"]);
const failures = [];
const notes = [];
const counts = { characterMasters: 0, characterWebP: 0, roomWebP: 0, propWebP: 0, drawingMasters: 0, drawingWebP: 0, voices: 0, fonts: 0, oldAssets: 0, textFiles: 0, availableSourceFiles: 0 };
const imagePaths = new Set();
const allMasterHashes = new Set();
const audioPaths = new Set();
const audioHashes = new Set();
const cachedHashes = new Map();
const checkedSources = new Set();
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const hashShape = (value) => typeof value === "string" && /^[a-f\d]{64}$/iu.test(value);
const loadJson = (path) => JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(readFileSync(resolve(ROOT, path))));
const pathLabel = (path) => relative(ROOT, path).split(sep).join("/");

function check(label, action) {
  try { action(); } catch (error) { failures.push(`${label}：${error.message}`); }
}

function runtimePath(value) {
  requireThat(typeof value === "string" && value.length > 0, "发布路径为空");
  requireThat(!isAbsolute(value) && !/^[a-z][a-z\d+.-]*:/iu.test(value) && !value.includes("\\"), `发布路径必须仓库相对路径：${value}`);
  const path = resolve(ROOT, value);
  requireThat(path.startsWith(`${ROOT}${sep}`) && existsSync(path) && statSync(path).isFile(), `发布文件不存在：${value}`);
  return path;
}

function fileHash(path) {
  if (!cachedHashes.has(path)) cachedHashes.set(path, sha(readFileSync(path)));
  return cachedHashes.get(path);
}

function releasedFile(value, expectedHash, expectedBytes) {
  const path = runtimePath(value);
  requireThat(hashShape(expectedHash), `缺少 SHA-256：${value}`);
  requireThat(fileHash(path) === expectedHash.toLowerCase(), `SHA-256 不一致：${value}`);
  if (expectedBytes !== undefined) requireThat(statSync(path).size === expectedBytes, `字节数不一致：${value}`);
  return path;
}

function sourceFingerprint(path, hash) {
  requireThat(typeof path === "string" && path.length > 0 && hashShape(hash), "来源路径或来源 SHA-256 缺失");
  // 源图和模型不进入发布仓库；本地存在时附加核对，CI 不要求其存在。
  const local = resolve(ROOT, path);
  if (existsSync(local) && statSync(local).isFile()) {
    requireThat(fileHash(local) === hash.toLowerCase(), `本地来源文件指纹不一致：${path}`);
    checkedSources.add(local);
    counts.availableSourceFiles = checkedSources.size;
  }
}

function readWebP(path) {
  const bytes = readFileSync(path);
  requireThat(bytes.length >= 20 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP", "不是 WebP RIFF");
  requireThat(bytes.readUInt32LE(4) + 8 === bytes.length, "WebP RIFF 长度损坏");
  let width; let height; let alpha = false; let bitstream = false;
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const kind = bytes.toString("ascii", offset, offset + 4);
    const length = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    requireThat(start + length <= bytes.length, `WebP ${kind} 区块越界`);
    if (kind === "VP8X") {
      requireThat(length === 10, "VP8X 长度错误");
      width = bytes.readUIntLE(start + 4, 3) + 1;
      height = bytes.readUIntLE(start + 7, 3) + 1;
      alpha ||= Boolean(bytes[start] & 0x10);
    } else if (kind === "VP8L") {
      requireThat(length >= 5 && bytes[start] === 0x2f, "VP8L 签名错误");
      const bits = bytes.readUInt32LE(start + 1);
      width ??= (bits & 0x3fff) + 1;
      height ??= ((bits >>> 14) & 0x3fff) + 1;
      alpha ||= Boolean((bits >>> 28) & 1);
      bitstream = true;
    } else if (kind === "VP8 ") {
      requireThat(length >= 10 && bytes.toString("hex", start + 3, start + 6) === "9d012a", "VP8 关键帧签名错误");
      width ??= bytes.readUInt16LE(start + 6) & 0x3fff;
      height ??= bytes.readUInt16LE(start + 8) & 0x3fff;
      bitstream = true;
    } else if (kind === "ALPH") { alpha = true; }
    offset = start + length + (length % 2);
  }
  requireThat(bitstream && width > 0 && height > 0, "WebP 缺少有效图像尺寸或图像区块");
  return { width, height, alpha };
}

function raster(file, hash, dimensions, alpha, bytes) {
  const path = releasedFile(file, hash, bytes);
  requireThat(!imagePaths.has(file), `图像发布路径重复：${file}`);
  imagePaths.add(file);
  const actual = readWebP(path);
  requireThat(same([actual.width, actual.height], dimensions), `WebP 头尺寸与清单不符：${file}`);
  if (alpha) requireThat(actual.alpha, `人物 WebP 无 alpha 标志：${file}`);
  return actual;
}

function exactPrompt(prompt, promptFile, hash) {
  requireThat(typeof prompt === "string" && prompt.trim().length > 60 && !/^(assets|\.tmp)\//u.test(prompt.trim()), "记录的 prompt 不是完整生成提示词");
  const path = runtimePath(promptFile);
  const text = readFileSync(path, "utf8");
  requireThat(text.replace(/\r\n/gu, "\n").trimEnd() === prompt.replace(/\r\n/gu, "\n").trimEnd(), `精确提示词与文件不符：${promptFile}`);
  if (hash) releasedFile(promptFile, hash);
}

function characters() {
  for (const outfit of OUTFITS) {
    const folder = `assets/v20/character/${outfit}`;
    check(`服装 ${outfit}`, () => {
      const manifest = loadJson(`${folder}/${outfit}-manifest.json`);
      requireThat(manifest.outfitId === outfit && manifest.count === 9 && manifest.assets.length === 9, "必须包含对应服装的 9 态记录");
      requireThat(same([...manifest.assets.map((item) => item.id)].sort(), [...POSES].sort()), "9 态标识不完整或重复");
      for (const item of manifest.assets) check(`${outfit}/${item.id}`, () => {
        requireThat(item.outfitId === outfit, "母图所属服装不一致");
        sourceFingerprint(item.source, item.sourceSha256);
        requireThat(!allMasterHashes.has(item.sourceSha256), "母图来源哈希重复，不能以复用图片充数");
        allMasterHashes.add(item.sourceSha256);
        requireThat(item.nativeSize?.length === 2 && item.nativeSize.every((number) => number > 0), "原生生成尺寸缺失");
        requireThat(item.references?.length > 0, "缺少实际参考图记录");
        item.references.forEach((ref) => sourceFingerprint(ref.path, ref.sha256));
        exactPrompt(item.prompt, item.promptFile, item.promptSha256);
        requireThat(item.promptText === item.prompt, "promptText 与 prompt 不一致");
        requireThat(item.alphaPreparation?.filter?.includes("chromakey=") && !item.alphaPreparation.filter.includes("despill=type"), "色键处理缺失或误用全局去绿");
        requireThat(item.alphaPreparation.despillScope?.includes("250"), "缺少去绿边缘边界说明");
        sourceFingerprint(item.alphaPreparation.source, item.alphaPreparation.sha256);
        requireThat(same(item.alphaPreparation.range, [0, 255]) && item.alphaPreparation.mode === "RGBA", "母图透明范围记录不完整");
        requireThat(item.actorBBoxNormalized?.length === 4 && item.actorBBoxNormalized.every((value) => value >= 0 && value <= 1), "缺少可用于布局的人物边界");
        requireThat(item.exports?.length === 3 && same(item.exports.map((entry) => entry.sizeClass).sort(), ["1440", "4k", "720"]), "缺少 720/1440/4k 三档");
        for (const entry of item.exports) {
          requireThat(entry.file === `${folder}/${item.id}-${entry.sizeClass}.webp`, "服装/姿态发布路径不匹配");
          const actual = raster(entry.file, entry.sha256, entry.dimensions, true, entry.bytes);
          requireThat(entry.sizeClass === "4k" ? Math.max(actual.width, actual.height) === 3840 : actual.width === Number(entry.sizeClass), "响应式尺寸档不符");
          requireThat(Math.abs(actual.width / actual.height - item.nativeSize[0] / item.nativeSize[1]) < 0.002, "导出比例与母图不符");
          const sidecar = loadJson(`${entry.file}.json`);
          requireThat(sidecar.sourceSha256 === item.sourceSha256 && sidecar.prompt === item.prompt && same(sidecar.exports, [entry]), "图像边车与母图/导出清单不一致");
          requireThat(sidecar.alphaPreparation?.filter === item.alphaPreparation.filter, "边车处理参数不一致");
          counts.characterWebP += 1;
        }
        if (item.plate) {
          const png = readFileSync(releasedFile(item.plate.file, item.plate.sha256));
          requireThat(png.toString("hex", 0, 8) === "89504e470d0a1a0a" && png[25] === 6, "人物 plate 不是 RGBA PNG");
          requireThat(same([png.readUInt32BE(16), png.readUInt32BE(20)], item.plate.dimensions), "plate PNG 尺寸不符");
        }
        const recorded = loadJson(`${folder}/${item.id}.source.json`);
        requireThat(same(recorded, item), "独立母图 source.json 与服装清单不一致");
        counts.characterMasters += 1;
      });
    });
  }
  const shipped = walk(resolve(ROOT, "assets/v20/character")).filter((path) => extname(path) === ".webp");
  requireThat(shipped.length === 135 && shipped.every((path) => imagePaths.has(pathLabel(path))), "人物目录存在未登记或多余的现役 WebP");
}

function rooms() {
  for (const [period, file] of [["day", "room-background-manifest.json"], ["night", "room-night-manifest.json"]]) check(`房间 ${period}`, () => {
    const manifest = loadJson(`assets/v20/room/${file}`);
    const entries = manifest.files.filter((entry) => entry.path.endsWith(".webp"));
    requireThat(entries.length === 4, "房间需要四档 WebP");
    for (const size of ["720", "1440", "2560", "4k"]) {
      const filePath = `assets/v20/room/room-panorama-${period}-${size}.webp`;
      const entry = entries.find((item) => item.path === filePath);
      requireThat(entry, `缺少 ${size} 档`);
      const actual = raster(entry.path, entry.fileSha256, [entry.width, entry.height], false, entry.bytes);
      requireThat(actual.width === (size === "4k" ? 3840 : Number(size)), "房间宽度档不符");
      sourceFingerprint(entry.source, entry.sourceSha256);
      sourceFingerprint(entry.reference, entry.referenceSha256);
      requireThat(entry.sourceWidth > 0 && entry.sourceHeight > 0 && entry.native4k === false, "原生尺寸/放大导出说明缺失");
      exactPrompt(entry.prompt, manifest.prompt);
      const sidecar = loadJson(`${entry.path}.json`);
      requireThat(sidecar.prompt === entry.prompt && sidecar.fileSha256 === entry.fileSha256 && sidecar.sourceSha256 === entry.sourceSha256, "房间边车与母图清单不符");
      counts.roomWebP += 1;
    }
    for (const entry of manifest.files.filter((item) => item.path.endsWith(".png"))) releasedFile(entry.path, entry.fileSha256, entry.bytes);
  });
  const shipped = walk(resolve(ROOT, "assets/v20/room")).filter((path) => extname(path) === ".webp");
  requireThat(shipped.length === 8 && shipped.every((path) => imagePaths.has(pathLabel(path))), "房间目录存在未登记或多余的现役 WebP");
}

function props() {
  const item = loadJson("assets/v20/props/lap-drawing-board-manifest.json");
  requireThat(item.id === "lap-drawing-board" && item.exports?.length === 3, "需要一块共享画板的三档发布素材");
  sourceFingerprint(item.source, item.sourceSha256);
  requireThat(item.nativeSize?.length === 2 && item.nativeSize.every((value) => value > 0), "画板原生尺寸缺失");
  requireThat(same(item.registrationCanvas, item.nativeSize), "画板定位画幅与原图不一致");
  requireThat(/不是原生\s*4k/iu.test(item.resize) && Math.max(...item.nativeSize) < 3840, "画板必须区分原生尺寸与 4K 放大档");
  exactPrompt(item.prompt, item.promptFile, item.promptSha256);
  requireThat(item.promptText === item.prompt && item.references?.length > 0, "画板精确提示词或实际参考图缺失");
  item.references.forEach((ref) => sourceFingerprint(ref.path, ref.sha256));
  sourceFingerprint(item.alphaPreparation?.source, item.alphaPreparation?.sha256);
  requireThat(item.alphaPreparation.mode === "RGBA" && same(item.alphaPreparation.range, [0, 255]) && item.alphaPreparation.filter.includes("chromakey="), "画板透明封装证据不完整");
  for (const key of ["paperCornersPx", "paperSafeCornersPx"]) {
    requireThat(item[key]?.length === 4 && item[key].every((point) => point.length === 2 && point.every((value, axis) => value >= 0 && value < item.nativeSize[axis])), `画纸四角坐标不完整：${key}`);
  }
  requireThat(item.paperCornersNormalized?.length === 4 && item.paperCornersNormalized.every((point, index) => point.every((value, axis) => Math.abs(value - item.paperCornersPx[index][axis] / item.nativeSize[axis]) < 0.00001)), "画纸归一化四角与原图坐标不一致");
  requireThat(same(item.exports.map((entry) => entry.sizeClass).sort(), ["1440", "4k", "720"]), "画板缺少 720/1440/4k 三档");
  for (const entry of item.exports) {
    requireThat(entry.file === `assets/v20/props/lap-drawing-board-${entry.sizeClass}.webp`, "画板发布路径不符");
    const actual = raster(entry.file, entry.sha256, entry.dimensions, true, entry.bytes);
    requireThat(entry.hasAlpha === true && (entry.sizeClass === "4k" ? Math.max(actual.width, actual.height) === 3840 : actual.width === Number(entry.sizeClass)), "画板透明标识或分辨率档不符");
    requireThat(Math.abs(actual.width / actual.height - item.nativeSize[0] / item.nativeSize[1]) < 0.002, "画板导出比例发生变化");
    const sidecar = loadJson(`${entry.file}.json`);
    requireThat(sidecar.prompt === item.prompt && sidecar.sourceSha256 === item.sourceSha256 && same(sidecar.exports, [entry]) && same(sidecar.paperCornersPx, item.paperCornersPx), "画板边车与源图/四角/导出不一致");
    counts.propWebP += 1;
  }
  const shipped = walk(resolve(ROOT, "assets/v20/props")).filter((path) => extname(path) === ".webp");
  requireThat(shipped.length === 3 && shipped.every((path) => imagePaths.has(pathLabel(path))), "道具目录存在未登记或多余 WebP");
}

function drawings() {
  const manifest = loadJson("assets/v20/drawings/drawings-manifest.json");
  const subjects = ["door", "blanket", "pencil"];
  const palettes = ["strawberry", "mint", "moon"];
  const expectedIds = subjects.flatMap((subject) => palettes.map((palette) => `${subject}-${palette}`));
  requireThat(manifest.count === 9 && manifest.webpCount === 36 && manifest.artworks?.length === 9, "共同成稿需要九张母图和 36 个 WebP");
  requireThat(same(manifest.artworks.map((item) => item.id).sort(), expectedIds.sort()), "九组主题与配色矩阵缺失或重复");
  for (const item of manifest.artworks) check(`共同成稿 ${item.id}`, () => {
    requireThat(item.id === `${item.subject}-${item.palette}` && item.title && item.alt && item.paletteName, "成稿主题、配色、标题或替代文字缺失");
    sourceFingerprint(item.source, item.sourceSha256);
    requireThat(!allMasterHashes.has(item.sourceSha256), "共同成稿复用了另一母图的来源哈希");
    allMasterHashes.add(item.sourceSha256);
    requireThat(same(item.nativeSize, [item.sourceWidth, item.sourceHeight]) && item.sourceWidth > 0 && item.sourceHeight > 0, "成稿原生尺寸记录不一致");
    requireThat(item.native4k === false && item.sourceWidth < 3840 && Math.abs(item.sourceWidth / item.sourceHeight - 4 / 3) < 0.001, "成稿必须标明原生 4:3 与 4K 放大档的差别");
    requireThat(item.resizeMethod?.includes("Lanczos") && item.references?.length > 0, "缺少等比导出流程或实际参考图");
    item.references.forEach((ref) => sourceFingerprint(ref.path, ref.sha256));
    exactPrompt(item.prompt, item.promptFile, item.promptSha256);
    requireThat(item.exports?.length === 4 && same(item.exports.map((entry) => entry.sizeClass).sort(), ["1440", "480", "4k", "720"]), "共同成稿缺少 480/720/1440/4k 四档");
    const bySize = new Map();
    for (const entry of item.exports) {
      requireThat(entry.file === `assets/v20/drawings/${item.id}-${entry.sizeClass}.webp`, "共同成稿发布路径不符");
      const actual = raster(entry.file, entry.sha256, entry.dimensions, false, entry.bytes);
      const width = entry.sizeClass === "4k" ? 3840 : Number(entry.sizeClass);
      requireThat(actual.width === width && actual.height === width * 3 / 4, "成稿四档必须为 4:3 的精确目标尺寸");
      const sidecar = loadJson(`${entry.file}.json`);
      requireThat(sidecar.id === item.id && sidecar.prompt === item.prompt && sidecar.sourceSha256 === item.sourceSha256 && same(sidecar.nativeSize, item.nativeSize) && sidecar.native4k === false && same(sidecar.exports, [entry]), "共同成稿边车与母图/导出清单不符");
      bySize.set(entry.sizeClass, entry.file);
      counts.drawingWebP += 1;
    }
    const mapping = manifest.mapping?.[item.subject]?.[item.palette];
    requireThat(mapping?.id === item.id && mapping.image === bySize.get("4k") && mapping.medium === bySize.get("1440") && mapping.small === bySize.get("720") && mapping.thumb === bySize.get("480"), "共同成稿运行时映射与真实配色素材不符");
    const recorded = loadJson(`assets/v20/drawings/${item.id}.source.json`);
    for (const key of ["id", "subject", "palette", "source", "sourceSha256", "nativeSize", "native4k", "prompt", "promptFile", "promptSha256", "references", "exports"]) requireThat(same(recorded[key], item[key]), `独立成稿记录与汇总清单不符：${key}`);
    requireThat(Date.parse(recorded.generatedAt) === Date.parse(item.generatedAt), "成稿来源生成时间不一致");
    counts.drawingMasters += 1;
  });
  const shipped = walk(resolve(ROOT, "assets/v20/drawings")).filter((path) => extname(path) === ".webp");
  requireThat(shipped.length === 36 && shipped.every((path) => imagePaths.has(pathLabel(path))), "共同成稿目录存在未登记或多余的 WebP");
}

function mp3Header(path) {
  const bytes = readFileSync(path);
  let offset = 0;
  if (bytes.toString("ascii", 0, 3) === "ID3") {
    offset = 10 + ((bytes[6] & 127) * 2097152 + (bytes[7] & 127) * 16384 + (bytes[8] & 127) * 128 + (bytes[9] & 127));
    if (bytes[5] & 0x10) offset += 10;
  }
  const rates = [44100, 48000, 32000];
  const bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
  let frameCount = 0; let duration = 0;
  const formats = new Set();
  while (offset + 4 <= bytes.length) {
    if (bytes.length - offset === 128 && bytes.toString("ascii", offset, offset + 3) === "TAG") break;
    const header = bytes.readUInt32BE(offset);
    requireThat((header >>> 21) === 0x7ff && ((header >>> 19) & 3) === 3 && ((header >>> 17) & 3) === 1, `MP3 帧头无效：偏移 ${offset}`);
    const bitrate = bitrates[(header >>> 12) & 15];
    const sampleRate = rates[(header >>> 10) & 3];
    const channels = ((header >>> 6) & 3) === 3 ? 1 : 2;
    requireThat(bitrate && sampleRate, "不支持或损坏的 MP3 参数");
    const length = Math.floor(144000 * bitrate / sampleRate) + ((header >>> 9) & 1);
    requireThat(offset + length <= bytes.length, "MP3 最后一帧截断");
    formats.add(`${sampleRate}/${channels}/${bitrate}`);
    frameCount += 1;
    duration += 1152 / sampleRate;
    offset += length;
  }
  requireThat(frameCount > 2, "MP3 未包含足够的音频帧");
  return { frameCount, duration, formats };
}

function voices() {
  const manifest = loadJson("assets/audio/v20/voice-manifest.json");
  requireThat(manifest.lines.length === 24 && new Set(manifest.lines.map((line) => line.id)).size === 24, "需要 24 条唯一语音");
  requireThat(manifest.model?.name === "ayousanz/piper-plus-tsukuyomi-chan" && hashShape(manifest.model.sha256) && hashShape(manifest.model.configSha256), "现有配音角色或模型来源指纹缺失");
  requireThat(manifest.rights?.training === false && manifest.rights?.voiceCloning === false && manifest.rights?.credit, "缺少配音制作与来源记录");
  for (const line of manifest.lines) check(`语音 ${line.id}`, () => {
    const path = releasedFile(line.file, line.sha256);
    requireThat(!audioPaths.has(line.file) && !audioHashes.has(line.sha256), "语音路径或音频哈希重复");
    audioPaths.add(line.file); audioHashes.add(line.sha256);
    requireThat(line.textJa && line.textZh && line.scene, "缺少场景、日文或中文字幕");
    sourceFingerprint(line.rawFile, line.rawSha256);
    releasedFile(line.query, line.querySha256);
    const query = loadJson(line.query);
    requireThat(query.id === line.id && query.textJa === line.textJa && query.textZh === line.textZh && same(query.parameters, line.parameters), "逐句复现参数/字幕不一致");
    requireThat(query.rawSha256 === line.rawSha256 && query.loudnormSecondPassFilter, "缺少原 WAV 指纹或归一化参数");
    const parsed = mp3Header(path);
    requireThat(parsed.formats.size === 1 && parsed.formats.has("44100/1/160"), "发布语音不是 44.1kHz 单声道 160kbps MP3");
    requireThat(Math.abs(parsed.duration - line.duration) < 0.08, `帧时长 ${parsed.duration.toFixed(3)} 与清单 ${line.duration} 不符`);
    requireThat(Math.abs(line.loudness?.integratedLufs - manifest.postprocessing.targetLufs) <= 1 && line.loudness.truePeakDb <= manifest.postprocessing.decodedTruePeakLimitDb, "音量测量记录超出目标");
    counts.voices += 1;
  });
  const shipped = walk(resolve(ROOT, "assets/audio/v20/voice")).filter((path) => extname(path) === ".mp3");
  requireThat(shipped.length === 24 && shipped.every((path) => audioPaths.has(pathLabel(path))), "语音目录存在未登记或多余 MP3");
}

function fonts() {
  const manifest = loadJson("assets/fonts/v20/font-manifest.json");
  requireThat(manifest.fonts.length === 3 && new Set(manifest.fonts.map((font) => font.family)).size === 3, "需要三个本地字体子集");
  for (const input of manifest.inputFiles) check(`字体扫描输入 ${input.path}`, () => {
    const path = runtimePath(input.path);
    requireThat(hashShape(input.sha256), "缺少构建时输入指纹");
    if (fileHash(path) !== input.sha256) notes.push(`字体扫描输入已变化，最终发布前重建子集：${input.path}`);
  });
  for (const font of manifest.fonts) check(`字体 ${font.family}`, () => {
    const bytes = readFileSync(releasedFile(font.output, font.outputSha256, font.bytes));
    requireThat(bytes.toString("ascii", 0, 4) === "wOF2" && bytes.readUInt32BE(8) === bytes.length && bytes.readUInt16BE(12) > 0, "WOFF2 文件头或长度损坏");
    sourceFingerprint(font.sourcePath, font.sourceSha256);
    releasedFile(`assets/fonts/v20/${font.licenseFile}`, font.licenseSha256);
    requireThat(font.url?.startsWith("https://") && font.revision && font.license && font.licenseUrl, "缺少字体固定来源或许可");
    requireThat(font.missingAfterExport?.length === 0 && font.missingLanguageCodepoints?.length === 0, "字体清单报告中日文缺字");
    requireThat(font.cmapCodepointCount > 0 && font.glyphCount > 0, "缺少字体实际字符映射检查记录");
    counts.fonts += 1;
  });
}

function snapshotBaseline(ref) {
  requireThat(/^[a-f\d]{7,40}$/iu.test(ref), "基线必须是 Git 提交哈希");
  const options = { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
  const commit = execFileSync("git", ["rev-parse", ref], options).trim();
  const rows = execFileSync("git", ["ls-tree", "-r", "-z", commit, "--", "assets"], options).split("\0").filter(Boolean).map((row) => {
    const [header, path] = row.split("\t");
    return { path, baselineGitBlob: header.split(" ")[2] };
  });
  requireThat(rows.length > 0, "基线未找到旧素材");
  const hashes = execFileSync("git", ["hash-object", "--stdin-paths"], { ...options, input: rows.map((row) => JSON.stringify(row.path)).join("\n") + "\n" }).trim().split(/\r?\n/u);
  requireThat(hashes.length === rows.length, "Git hash-object 返回条数不符");
  const pendingCanonical = [];
  const rawRecords = rows.map((row, index) => {
    requireThat(row.baselineGitBlob === hashes[index], `旧素材相对基线有改动：${row.path}`);
    const bytes = readFileSync(runtimePath(row.path));
    const rawBlob = createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
    if (rawBlob !== row.baselineGitBlob) pendingCanonical.push(row.baselineGitBlob);
    return { ...row, bytes, gitFilteredBlob: hashes[index], rawGitBlob: rawBlob };
  });
  const canonicalByBlob = new Map();
  if (pendingCanonical.length) {
    const batch = execFileSync("git", ["cat-file", "--batch"], { cwd: ROOT, input: pendingCanonical.join("\n") + "\n", maxBuffer: 128 * 1024 * 1024 });
    let offset = 0;
    for (const blob of pendingCanonical) {
      const end = batch.indexOf(10, offset);
      const header = batch.toString("utf8", offset, end).split(" ");
      requireThat(header[0] === blob && header[1] === "blob", "Git cat-file 基线对象不符");
      const size = Number(header[2]);
      canonicalByBlob.set(blob, batch.subarray(end + 1, end + 1 + size));
      offset = end + 1 + size + 1;
    }
  }
  const assets = rawRecords.map((row) => {
    const canonical = canonicalByBlob.get(row.baselineGitBlob) ?? row.bytes;
    const differs = !canonical.equals(row.bytes);
    if (differs) {
      requireThat(TEXT.has(extname(row.path)), `二进制旧素材字节变化：${row.path}`);
      const normalized = Buffer.from(new TextDecoder("utf-8", { fatal: true }).decode(row.bytes).replace(/\r\n/gu, "\n"));
      requireThat(normalized.equals(canonical), `旧文本不只是 CRLF/LF 差异：${row.path}`);
    }
    return { path: row.path, baselineGitBlob: row.baselineGitBlob, gitFilteredBlob: row.gitFilteredBlob, canonicalSha256: sha(canonical), canonicalBytes: canonical.length, workingTreeSha256: sha(row.bytes), workingTreeBytes: row.bytes.length, lineEndingDifference: differs ? "CRLF/LF only" : null };
  });
  writeFileSync(resolve(ROOT, ARCHIVE), JSON.stringify({ schemaVersion: 1, baselineCommit: commit, generatedAt: new Date().toISOString(), purpose: "V20 发布前旧素材完整保留凭证；快照时 git ls-tree 与 git hash-object 逐文件一致。CI 仅核对仓库现存文件，不依赖旧提交或忽略目录。", count: assets.length, assets }, null, 2) + "\n", "utf8");
  console.log(`已生成基线清单：${assets.length} 个旧素材；原文件未修改。`);
}

function preservedAssets() {
  const archive = loadJson(ARCHIVE);
  requireThat(archive.baselineCommit?.startsWith("e5062e9") && archive.count === archive.assets.length && archive.count > 0, "旧素材基线信息不完整");
  requireThat(new Set(archive.assets.map((item) => item.path)).size === archive.count, "旧素材清单路径重复");
  for (const item of archive.assets) check(`旧素材 ${item.path}`, () => {
    requireThat(item.baselineGitBlob === item.gitFilteredBlob && /^[a-f\d]{40}$/u.test(item.baselineGitBlob), "基线 Git 指纹与快照证据不一致");
    const path = runtimePath(item.path);
    requireThat(hashShape(item.canonicalSha256) && hashShape(item.workingTreeSha256), "缺少基线/工作区双指纹");
    const actual = fileHash(path);
    requireThat(actual === item.canonicalSha256 || actual === item.workingTreeSha256, "现有字节不是已取证的基线或工作区版本");
    requireThat(statSync(path).size === (actual === item.canonicalSha256 ? item.canonicalBytes : item.workingTreeBytes), "旧素材字节数不符");
    if (item.canonicalSha256 !== item.workingTreeSha256) {
      requireThat(item.lineEndingDifference === "CRLF/LF only" && TEXT.has(extname(item.path)), "只允许已取证的文本行尾差异");
      requireThat(sha(Buffer.from(readFileSync(path, "utf8").replace(/\r\n/gu, "\n"))) === item.canonicalSha256, "旧文本存在超出行尾的改动");
    }
    counts.oldAssets += 1;
  });
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP.has(entry.name)) return [];
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : entry.isFile() ? [path] : [];
  });
}

function encoding() {
  const bad = [[0xfffd], [0x951f, 0x65a4, 0x62f7], [0x70eb, 0x70eb, 0x70eb], [0x5c6f, 0x5c6f, 0x5c6f], [0xc3, 0xa9], [0xc2, 0xa0]].map((points) => String.fromCodePoint(...points));
  for (const path of walk(ROOT).filter((file) => TEXT.has(extname(file)))) check(`UTF-8 ${pathLabel(path)}`, () => {
    const bytes = readFileSync(path);
    requireThat(bytes.subarray(0, 3).toString("hex") !== "efbbbf", "包含 BOM");
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    requireThat(!bad.some((signature) => text.includes(signature)), "包含疑似乱码特征");
    counts.textFiles += 1;
  });
}

if (process.argv.includes("--snapshot-baseline")) {
  snapshotBaseline(process.argv[process.argv.indexOf("--snapshot-baseline") + 1]);
} else {
  check("人物资源", characters);
  check("房间资源", rooms);
  check("画板道具", props);
  check("共同成稿", drawings);
  check("语音资源", voices);
  check("字体资源", fonts);
  check("旧素材保留", preservedAssets);
  check("文本编码", encoding);
  const report = { ok: failures.length === 0, counts, failures, notes, limits: ["WebP 验证 RIFF/VP8X/VP8L/VP8 图像头与 alpha 标志，浏览器 E2E 负责真实解码和视觉边缘。", "MP3 验证全部连续帧头、格式和帧时长，非重新进行主观试听或 LUFS 测量。", "WOFF2 验证文件头、哈希及构建清单中的字符覆盖证据，浏览器 E2E 负责实际字体加载。", "忽略目录中的源图/模型不作为 CI 前提；只核对来源指纹，存在的本地源图额外验证。"] };
  if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`${report.ok ? "通过" : "未通过"}：V20 离线资产验收`);
    console.log(JSON.stringify(counts));
    failures.forEach((message) => console.error(`- ${message}`));
    notes.forEach((message) => console.log(`待办：${message}`));
  }
  if (!report.ok) process.exitCode = 1;
}
