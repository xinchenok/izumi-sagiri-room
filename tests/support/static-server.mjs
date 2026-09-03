import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = Number(process.env.PORT || 4173);
const HOST = "127.0.0.1";
const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mjs": "text/javascript; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".webp": "image/webp",
  ".woff2": "font/woff2"
};

const server = createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || "/", `http://${HOST}:${PORT}`).pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^[/\\]+/u, "");
    const filePath = resolve(ROOT, relativePath);

    if (!filePath.startsWith(`${ROOT}${sep}`) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("未找到资源");
      return;
    }

    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": CONTENT_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }

    const stream = createReadStream(filePath);
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  } catch {
    if (!response.headersSent) {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    }
    response.end("请求格式无效");
  }
});

server.on("clientError", (_error, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
});

server.listen(PORT, HOST, () => {
  console.log(`静态测试服务器已启动：http://${HOST}:${PORT}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
