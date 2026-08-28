import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const workbookPath = join(root, "Cash_Management.xlsx");
const mime = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json; charset=utf-8", ".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".svg":"image/svg+xml", ".png":"image/png" };
function safeFile(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const resolved = normalize(join(root, requested));
  return resolved.startsWith(normalize(root)) ? resolved : null;
}
function workbookStatus() {
  if (!existsSync(workbookPath)) return null;
  const stats = statSync(workbookPath);
  return {
    name: "Cash_Management.xlsx",
    size: stats.size,
    modifiedAt: stats.mtime.toISOString(),
    version: `${Math.round(stats.mtimeMs)}-${stats.size}`
  };
}
function json(response, status, body) {
  response.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate","Access-Control-Allow-Origin":"*"});
  response.end(JSON.stringify(body));
}
function streamWorkbook(response) {
  const status = workbookStatus();
  if (!status) { json(response,404,{status:"missing",message:"Classeur Cash_Management.xlsx introuvable"}); return; }
  response.writeHead(200,{"Content-Type":mime[".xlsx"],"Content-Length":status.size,"Last-Modified":new Date(status.modifiedAt).toUTCString(),ETag:`\"${status.version}\"`,"Cache-Control":"no-store, no-cache, must-revalidate",Pragma:"no-cache","Access-Control-Allow-Origin":"*"});
  createReadStream(workbookPath).pipe(response);
}
const server = createServer((request, response) => {
  const requestUrl = new URL(request.url || "/", "http://localhost");
  if (requestUrl.pathname === "/health") { json(response,200,{status:"ok",workbook:"Cash_Management.xlsx",sync:"automatic"}); return; }
  if (requestUrl.pathname === "/api/workbook-status") {
    const status = workbookStatus();
    json(response,status?200:404,status?{status:"ready",...status}:{status:"missing",message:"Classeur Cash_Management.xlsx introuvable"});
    return;
  }
  if (requestUrl.pathname === "/api/workbook") { streamWorkbook(response); return; }
  const file = safeFile(request.url || "/");
  if (!file || !existsSync(file) || !statSync(file).isFile()) { response.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"}); response.end("Fichier introuvable"); return; }
  const stats = statSync(file);
  response.writeHead(200,{"Content-Type":mime[extname(file).toLowerCase()]||"application/octet-stream","Content-Length":stats.size,"Last-Modified":stats.mtime.toUTCString(),"Cache-Control":"no-store, no-cache, must-revalidate",Pragma:"no-cache"});
  createReadStream(file).pipe(response);
});
server.listen(port,"127.0.0.1",()=>{console.log(`BUILD YOUR EDGE — http://localhost:${port}`);console.log("Enregistrez le fichier Excel : l'application se synchronise automatiquement sous 2 secondes.");});
