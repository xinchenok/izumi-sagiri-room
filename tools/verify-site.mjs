import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKIPPED_DIRECTORIES = new Set([
  ".git",
  ".idea",
  ".impeccable",
  ".playwright-cli",
  ".tmp",
  "node_modules",
  "output"
]);
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
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
    if (localReference) references.add(localReference);
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

const files = walkFiles();
runCheck("Node 语法", checkJavaScriptSyntax);
runCheck("HTML 的 ID 与锚点", checkHtmlStructure);
runCheck("页面本地资源", checkLocalResources);
runCheck("JSON 解析", () => checkJson(files));
runCheck("UTF-8、BOM 与乱码特征", () => checkTextEncoding(files));

if (failures.length > 0) {
  console.error("\n验证失败：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\n静态网站验证全部通过。");
}
