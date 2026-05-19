const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = process.env.PORT || 8003;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

http.createServer((req, res) => {
  const rawPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  if (rawPath === "/favicon.ico" || rawPath.startsWith("/apple-touch-icon")) {
    res.writeHead(204);
    res.end();
    return;
  }
  const urlPath = decodeURIComponent(rawPath);
  const filePath = path.join(root, urlPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`Gamblers running at http://127.0.0.1:${port}`);
});
