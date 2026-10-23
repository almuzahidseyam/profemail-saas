// Local QA only. Logs request metadata and sentinel presence, never raw CV data.
import http from "node:http";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
const directory = new URL("../artifacts/", import.meta.url);
mkdirSync(directory, { recursive: true });
const output = new URL("privacy-probe.jsonl", directory);
writeFileSync(output, "");
const sentinel = "CV_QA_PRIVATE_SENTINEL";
http
  .createServer((request, response) => {
    let size = 0,
      leaked = (request.url || "").includes(sentinel),
      tail = "";
    const upstream = http.request(
      {
        hostname: "127.0.0.1",
        port: 3097,
        path: request.url,
        method: request.method,
        headers: { ...request.headers, host: "127.0.0.1:3097" },
      },
      (incoming) => {
        response.writeHead(incoming.statusCode || 502, incoming.headers);
        incoming.pipe(response);
      },
    );
    request.on("data", (chunk) => {
      size += chunk.length;
      const text = tail + chunk.toString();
      leaked ||= text.includes(sentinel);
      tail = text.slice(-sentinel.length);
    });
    request.on("end", () =>
      appendFileSync(
        output,
        JSON.stringify({
          method: request.method,
          path: request.url?.split("?")[0],
          bytes: size,
          sentinelLeaked: leaked,
        }) + "\n",
      ),
    );
    upstream.on("error", () => {
      response.writeHead(502);
      response.end("Local application unavailable");
    });
    request.pipe(upstream);
  })
  .listen(3098, "127.0.0.1", () =>
    console.log("Privacy QA proxy: http://127.0.0.1:3098/resume-checker"),
  );
