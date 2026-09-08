import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKIPPED_DIRECTORIES = new Set([
  ".git",
  ".idea",
  ".impeccable",
  ".playwright-cli",
  ".tmp",
  "node_modules",
  "output",
  "test-results"
]);
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".py",
  ".svg",
  ".txt",
  ".yaml",
  ".yml"
]);
const MOJIBAKE_SIGNATURES = [
  [0xfffd],
  [0x951f, 0x65a4, 0x62f7],
  [0x70eb, 0x70eb, 0x70eb],
  [0x5c6f, 0x5c6f, 0x5c6f],
  [0x00c3, 0x00a9],
  [0x00c3, 0x00a8],
  [0x00c3, 0x00a4],
  [0x00c3, 0x00b6],
  [0x00c3, 0x00bc],
  [0x00c2, 0x00a0],
  [0x00e2, 0x20ac, 0x2122],
  [0x00e2, 0x20ac, 0x0153],
  [0x00e2, 0x20ac],
  [0x00f0, 0x0178]
].map((codePoints) => String.fromCodePoint(...codePoints));

const failures = [];

function displayPath(filePath) {
  return relative(ROOT, filePath).split(sep).join("/") || ".";
}

function walkFiles(directory = ROOT) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) continue;
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(entryPath));
    if (entry.isFile()) files.push(entryPath);
  }
  return files;
}

function readUtf8(filePath) {
  const bytes = readFileSync(filePath);
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function runCheck(label, check) {
  try {
    const issues = check();
    if (issues.length === 0) {
      console.log(`通过：${label}`);
      return;
    }
    for (const issue of issues) failures.push(`${label}：${issue}`);
  } catch (error) {
    failures.push(`${label}：${error.message}`);
  }
}

function checkJavaScriptSyntax() {
  const result = spawnSync(process.execPath, ["--check", resolve(ROOT, "script.js")], {
    encoding: "utf8"
  });
  if (result.status === 0) return [];
  return [(result.stderr || result.stdout || "Node 语法检查失败").trim()];
}

function checkHtmlStructure() {
  const html = readUtf8(resolve(ROOT, "index.html"));
  const ids = new Map();
  const issues = [];
  for (const match of html.matchAll(/\sid\s*=\s*(["'])(.*?)\1/giu)) {
    const id = match[2];
    ids.set(id, (ids.get(id) || 0) + 1);
  }

  for (const [id, count] of ids) {
    if (count > 1) issues.push(`重复 ID “${id}” 出现 ${count} 次`);
  }

  const anchors = new Set();
  for (const match of html.matchAll(/\shref\s*=\s*(["'])#([^"']*)\1/giu)) {
    if (match[2]) anchors.add(decodeURIComponent(match[2]));
  }
  for (const anchor of anchors) {
    if (!ids.has(anchor)) issues.push(`锚点 #${anchor} 没有对应的 ID`);
  }
  return issues;
}

function normalizeLocalReference(reference) {
  const value = reference.trim();
  if (!value || /^(?:[a-z]+:|\/\/|#)/iu.test(value)) return null;
  const withoutQuery = value.split(/[?#]/u, 1)[0];
  if (!withoutQuery) return null;
  try {
    return decodeURIComponent(withoutQuery).replaceAll("/", sep);
  } catch {
    return withoutQuery.replaceAll("/", sep);
  }
}

function checkLocalResources() {
  const html = readUtf8(resolve(ROOT, "index.html"));
  const css = readUtf8(resolve(ROOT, "styles.css"));
  const script = readUtf8(resolve(ROOT, "script.js"));
  const references = new Set();

  for (const match of html.matchAll(/\s(?:href|poster|src)\s*=\s*(["'])(.*?)\1/giu)) {
    const localReference = normalizeLocalReference(match[2]);
    if (localReference) references.add(localReference);
  }
  for (const match of html.matchAll(/\s(?:imagesrcset|srcset)\s*=\s*(["'])(.*?)\1/giu)) {
    for (const candidate of match[2].split(",")) {
      const localReference = normalizeLocalReference(candidate.trim().split(/\s+/u)[0]);
      if (localReference) references.add(localReference);
    }
  }
  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/giu)) {
    const localReference = normalizeLocalReference(match[2]);
    if (localReference) references.add(localReference);
  }
  for (const match of script.matchAll(/(["'`])(assets\/[^"'`\s?#)]+)(?:\?[^"'`\s)]*)?\1/giu)) {
    const localReference = normalizeLocalReference(match[2]);
    if (localReference && !localReference.includes("${")) references.add(localReference);
  }

  const issues = [];
  for (const reference of [...references].sort()) {
    const filePath = resolve(ROOT, reference);
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      issues.push(`本地资源不存在：${reference.split(sep).join("/")}`);
    }
  }
  if (issues.length === 0) console.log(`信息：已检查 ${references.size} 个页面本地资源引用`);
  return issues;
}

function checkJson(files) {
  const issues = [];
  for (const filePath of files.filter((file) => extname(file).toLowerCase() === ".json")) {
    try {
      JSON.parse(readUtf8(filePath));
    } catch (error) {
      issues.push(`${displayPath(filePath)} 无法解析：${error.message}`);
    }
  }
  return issues;
}

function checkTextEncoding(files) {
  const issues = [];
  const textFiles = files.filter((file) => TEXT_EXTENSIONS.has(extname(file).toLowerCase()));
  for (const filePath of textFiles) {
    const bytes = readFileSync(filePath);
    if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
      issues.push(`${displayPath(filePath)} 含 UTF-8 BOM`);
    }

    let text;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch (error) {
      issues.push(`${displayPath(filePath)} 不是有效 UTF-8：${error.message}`);
      continue;
    }

    const signatures = MOJIBAKE_SIGNATURES.filter((signature) => text.includes(signature));
    if (signatures.length > 0) {
      issues.push(`${displayPath(filePath)} 命中乱码特征：${signatures.join("、")}`);
    }
  }
  if (issues.length === 0) console.log(`信息：已检查 ${textFiles.length} 个 UTF-8 文本文件`);
  return issues;
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function normalizeNewlines(value) {
  return value.replace(/\r\n?/gu, "\n");
}

function checkV18Images() {
  const manifestPath = resolve(ROOT, "assets", "v18", "manifest.json");
  const archivePath = resolve(ROOT, "assets", "archive", "pre-v18-images.json");
  const issues = [];
  if (!existsSync(manifestPath)) return ["缺少 assets/v18/manifest.json"];
  if (!existsSync(archivePath)) return ["缺少 assets/archive/pre-v18-images.json"];

  const manifest = JSON.parse(readUtf8(manifestPath));
  const archive = JSON.parse(readUtf8(archivePath));
  if (!Array.isArray(manifest.assets) || manifest.assets.length !== 29) {
    issues.push(`V18 清单应包含 29 张母版，实际为 ${manifest.assets?.length ?? 0}`);
  }

  for (const asset of manifest.assets || []) {
    const promptPath = resolve(ROOT, asset.prompt || "");
    const expectedPrompt = existsSync(promptPath) ? readUtf8(promptPath) : "";
    if (!expectedPrompt) issues.push(`V18 资产缺少精确提示词：${asset.prompt}`);
    const oldSourcePath = resolve(ROOT, asset.oldSource || "");
    if (!existsSync(oldSourcePath)) {
      issues.push(`V18 对应旧图不存在：${asset.oldSource}`);
    } else if (sha256(oldSourcePath) !== asset.oldSourceSha256) {
      issues.push(`V18 对应旧图哈希不一致：${asset.oldSource}`);
    }
    for (const version of Object.values(asset.versions || {})) {
      const filePath = resolve(ROOT, version.path || "");
      const provenancePath = resolve(ROOT, version.provenance || "");
      if (!existsSync(filePath)) {
        issues.push(`V18 图片不存在：${version.path}`);
        continue;
      }
      if (sha256(filePath) !== version.sha256) issues.push(`V18 图片哈希不一致：${version.path}`);
      if (!existsSync(provenancePath)) {
        issues.push(`V18 图片缺少提示词来源：${version.provenance}`);
      } else {
        const provenance = JSON.parse(readUtf8(provenancePath));
        if (normalizeNewlines(provenance.prompt) !== normalizeNewlines(expectedPrompt)) {
          issues.push(`V18 图片提示词来源不一致：${version.provenance}`);
        }
      }
    }
  }

  for (const image of archive.images || []) {
    const filePath = resolve(ROOT, image.path || "");
    if (!existsSync(filePath)) {
      issues.push(`归档旧图不存在：${image.path}`);
      continue;
    }
    if (sha256(filePath) !== image.sha256) issues.push(`归档旧图哈希不一致：${image.path}`);
  }

  if (issues.length === 0) {
    console.log(`信息：已核对 ${manifest.assets.length} 张 V18 母版矩阵、对应旧图与 ${archive.images.length} 个初始归档引用`);
  }
  return issues;
}

function checkV19Release() {
  const imageManifestPath = resolve(ROOT, "assets", "v19", "manifest.json");
  const archivePath = resolve(ROOT, "assets", "archive", "pre-v19-cinematic-images.json");
  const voiceManifestPath = resolve(ROOT, "assets", "audio", "v19", "voice-manifest.json");
  const foleyManifestPath = resolve(ROOT, "assets", "audio", "v19", "scene-sound-manifest.json");
  const issues = [];
  for (const required of [imageManifestPath, archivePath, voiceManifestPath, foleyManifestPath]) {
    if (!existsSync(required)) issues.push(`缺少 ${displayPath(required)}`);
  }
  if (issues.length) return issues;

  const imageManifest = JSON.parse(readUtf8(imageManifestPath));
  const archive = JSON.parse(readUtf8(archivePath));
  if (imageManifest.assets?.length !== 26) {
    issues.push(`V19 图片清单应为 26 张母版，实际 ${imageManifest.assets?.length ?? 0}`);
  }
  const imagePaths = new Set();
  let imageVersionCount = 0;
  for (const asset of imageManifest.assets || []) {
    const promptPath = resolve(ROOT, asset.prompt || "");
    const prompt = existsSync(promptPath) ? readUtf8(promptPath) : "";
    if (!prompt.trim()) issues.push(`V19 精确提示词缺失：${asset.prompt}`);
    for (const version of Object.values(asset.versions || {})) {
      imageVersionCount += 1;
      const filePath = resolve(ROOT, version.path || "");
      const provenancePath = resolve(ROOT, version.provenance || "");
      if (imagePaths.has(version.path)) issues.push(`V19 图片路径重复：${version.path}`);
      imagePaths.add(version.path);
      if (!existsSync(filePath)) {
        issues.push(`V19 图片不存在：${version.path}`);
        continue;
      }
      if (sha256(filePath) !== version.sha256) issues.push(`V19 图片哈希不一致：${version.path}`);
      if (!existsSync(provenancePath)) {
        issues.push(`V19 图片缺少 provenance：${version.provenance}`);
      } else if (normalizeNewlines(JSON.parse(readUtf8(provenancePath)).prompt || "") !== normalizeNewlines(prompt)) {
        issues.push(`V19 图片 provenance 与提示词不一致：${version.provenance}`);
      }
    }
  }
  if (imageVersionCount !== 96) issues.push(`V19 现役 WebP 应为 96 个，实际 ${imageVersionCount}`);
  if (archive.images?.length !== 107) issues.push(`V19 发布前归档应记录 107 个 V18.1 路径，实际 ${archive.images?.length ?? 0}`);
  for (const image of archive.images || []) {
    const filePath = resolve(ROOT, image.path || "");
    if (!existsSync(filePath)) issues.push(`V19 归档引用不存在：${image.path}`);
    else if (sha256(filePath) !== image.sha256) issues.push(`V19 归档引用哈希不一致：${image.path}`);
  }

  const voiceManifest = JSON.parse(readUtf8(voiceManifestPath));
  const voiceLines = voiceManifest.lines || [];
  if (voiceLines.length !== 28) issues.push(`V19 语音应为 28 句，实际 ${voiceLines.length}`);
  if (voiceManifest.engine?.model_sha256 !== "5289e9b6eaf21080803b7fe1c4dc85b5491d4c216121207a41df18dd5f68e5d7") {
    issues.push("V19 Piper Plus 模型哈希与固定版本不一致");
  }
  if (voiceManifest.engine?.training !== false || voiceManifest.engine?.fine_tuning !== false || voiceManifest.engine?.voice_cloning !== false) {
    issues.push("V19 语音清单必须明确记录未训练、未微调、未克隆声纹");
  }
  const voicePaths = new Set();
  const voiceHashes = new Set();
  for (const line of voiceLines) {
    if (voicePaths.has(line.audio)) issues.push(`V19 语音路径重复：${line.audio}`);
    if (voiceHashes.has(line.sha256)) issues.push(`V19 语音哈希重复：${line.id}`);
    voicePaths.add(line.audio);
    voiceHashes.add(line.sha256);
    const audioPath = resolve(dirname(voiceManifestPath), line.audio || "");
    if (!existsSync(audioPath)) issues.push(`V19 语音不存在：${line.audio}`);
    else if (sha256(audioPath) !== line.sha256) issues.push(`V19 语音哈希不一致：${line.audio}`);
    if (line.sample_rate_hz !== 44100 || line.channels !== 1 || line.bitrate_kbps !== 160) {
      issues.push(`V19 语音规格不一致：${line.id}`);
    }
    const queryPath = resolve(dirname(voiceManifestPath), line.query || "");
    if (!existsSync(queryPath)) issues.push(`V19 语音缺少逐句查询记录：${line.query}`);
  }

  const foleyManifest = JSON.parse(readUtf8(foleyManifestPath));
  const foleyFiles = foleyManifest.files || [];
  const foleySources = foleyManifest.sources || [];
  if (foleyFiles.length !== 21 || foleySources.length !== 21) {
    issues.push(`V19 拟音应为 21 个文件与 21 个来源，实际 ${foleyFiles.length}/${foleySources.length}`);
  }
  if (new Set(foleyFiles.map((item) => item.audio)).size !== 21) issues.push("V19 拟音路径存在复用");
  if (new Set(foleyFiles.map((item) => item.sha256)).size !== 21) issues.push("V19 拟音哈希存在复用");
  if (new Set(foleySources.map((item) => item.id)).size !== 21) issues.push("V19 拟音来源 ID 存在复用");
  for (const source of foleySources) {
    if (source.license !== "CC0 1.0") issues.push(`V19 拟音来源不是 CC0：${source.id}`);
  }
  for (const item of foleyFiles) {
    const audioPath = resolve(dirname(foleyManifestPath), item.audio || "");
    if (!existsSync(audioPath)) issues.push(`V19 拟音不存在：${item.audio}`);
    else if (sha256(audioPath) !== item.sha256) issues.push(`V19 拟音哈希不一致：${item.audio}`);
    if (item.duration_seconds < 0.4 || item.duration_seconds > 1.8) issues.push(`V19 拟音时长超出 0.4–1.8 秒：${item.audio}`);
    if (item.integrated_lufs < -22.5 || item.integrated_lufs > -19.5) issues.push(`V19 拟音响度不在约 -21 LUFS：${item.audio}`);
  }

  const scriptSource = readUtf8(resolve(ROOT, "script.js"));
  const sceneStart = scriptSource.indexOf("cinematicScenes:");
  const voiceStart = scriptSource.indexOf("cinematicVoices:");
  const sceneBlock = sceneStart >= 0 && voiceStart > sceneStart ? scriptSource.slice(sceneStart, voiceStart) : "";
  const usedVoiceIds = [...sceneBlock.matchAll(/(?:characterVoiceId|voiceId):\s*"([^"]+)"/gu)].map((match) => match[1]);
  const usedFoleyIds = [...sceneBlock.matchAll(/foleyId:\s*"([^"]+)"/gu)].map((match) => match[1]);
  const expectedVoiceIds = voiceLines.map((line) => line.id);
  const expectedFoleyIds = foleyFiles.map((item) => item.audio.split("/").at(-1).replace(/\.mp3$/u, ""));
  if (usedVoiceIds.length !== 28 || new Set(usedVoiceIds).size !== 28) {
    issues.push(`CONTENT 七幕语音绑定应为 28 个且不复用，实际 ${usedVoiceIds.length}/${new Set(usedVoiceIds).size}`);
  }
  if (usedFoleyIds.length !== 21 || new Set(usedFoleyIds).size !== 21) {
    issues.push(`CONTENT 七幕拟音绑定应为 21 个且不复用，实际 ${usedFoleyIds.length}/${new Set(usedFoleyIds).size}`);
  }
  for (const id of expectedVoiceIds) {
    if (!usedVoiceIds.includes(id)) issues.push(`语音清单条目未绑定到 CONTENT：${id}`);
  }
  for (const id of usedVoiceIds) {
    if (!expectedVoiceIds.includes(id)) issues.push(`CONTENT 绑定了清单外语音：${id}`);
  }
  for (const id of expectedFoleyIds) {
    if (!usedFoleyIds.includes(id)) issues.push(`拟音清单条目未绑定到 CONTENT：${id}`);
  }
  for (const id of usedFoleyIds) {
    if (!expectedFoleyIds.includes(id)) issues.push(`CONTENT 绑定了清单外拟音：${id}`);
  }

  if (issues.length === 0) {
    console.log("信息：已核对 26 张母版、96 个 WebP、28 句语音、21 段独立拟音及全部哈希");
  }
  return issues;
}

const files = walkFiles();
runCheck("Node 语法", checkJavaScriptSyntax);
runCheck("HTML 的 ID 与锚点", checkHtmlStructure);
runCheck("页面本地资源", checkLocalResources);
runCheck("JSON 解析", () => checkJson(files));
runCheck("V18 图片矩阵与旧图归档", checkV18Images);
runCheck("V19 连续镜头、语音、拟音与归档", checkV19Release);
runCheck("UTF-8、BOM 与乱码特征", () => checkTextEncoding(files));

if (failures.length > 0) {
  console.error("\n验证失败：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\n静态网站验证全部通过。");
}
