#!/usr/bin/env node
/** Loopback-only current-snapshot export helper. Run locally, paste token into workbench. */
import { createServer } from "node:http";
import { randomBytes, createHash, randomUUID } from "node:crypto";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
const token = randomBytes(18).toString("hex"),
  jobs = new Map(),
  dir = mkdtempSync(join(tmpdir(), "ans-export-"));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const send = (res, code, data, type = "application/json") => {
  res.writeHead(code, {
    "Content-Type": type,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,x-ans-token",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Cache-Control": "no-store",
  });
  res.end(type === "application/json" ? JSON.stringify(data) : data);
};
const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, "");
  if (req.headers["x-ans-token"] !== token)
    return send(res, 403, { error: "Wrong helper token" });
  const path = (req.url || "").split("?")[0];
  if (req.method === "POST" && path === "/export") {
    let raw = "";
    for await (const c of req) {
      raw += c;
      if (raw.length > 40_000_000)
        return send(res, 413, { error: "Snapshot too large" });
    }
    try {
      const data = JSON.parse(raw);
      if (
        !["editable", "image", "pdf"].includes(data.mode) ||
        typeof data.html !== "string" ||
        sha(data.html) !== data.sha256
      )
        throw Error("Invalid snapshot or hash");
      if (!data.html.includes('id="ans-document"'))
        throw Error("Editable deck model missing");
      const id = randomUUID(),
        input = join(dir, id + ".html"),
        output = join(dir, id + (data.mode === "pdf" ? ".pdf" : ".pptx"));
      writeFileSync(input, data.html);
      const task = {
        id,
        state: "queued",
        progress: "Starting",
        sha256: data.sha256,
        mode: data.mode,
        output,
      };
      jobs.set(id, task);
      const argv =
        data.mode === "pdf"
          ? [resolve(import.meta.dirname, "export-pdf.js"), input, output]
          : [
              resolve(import.meta.dirname, "export-pptx.js"),
              input,
              output,
              ...(data.mode === "image" ? ["--image"] : []),
            ];
      const child = spawn(process.execPath, argv, {
        cwd: resolve(import.meta.dirname, ".."),
        windowsHide: true,
      });
      task.state = "running";
      let stderr = "";
      child.stdout.on(
        "data",
        (c) => (task.progress = String(c).trim().slice(-220)),
      );
      child.stderr.on(
        "data",
        (c) => (stderr = (stderr + String(c)).slice(-4000)),
      );
      child.on("error", (e) => {
        task.state = "failed";
        task.error = e.message;
      });
      child.on("exit", (code) => {
        task.state = code === 0 ? "done" : "failed";
        if (code !== 0) task.error = stderr || `Exit ${code}`;
        task.progress =
          task.state === "done" ? `Input SHA256 ${task.sha256}` : task.error;
      });
      return send(res, 202, { id, sha256: data.sha256 });
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }
  const m = path.match(/^\/(task|result|manifest)\/([0-9a-f-]+)$/);
  if (!m) return send(res, 404, { error: "Unknown route" });
  const task = jobs.get(m[2]);
  if (!task) return send(res, 404, { error: "Unknown task" });
  if (m[1] === "task")
    return send(res, 200, {
      id: task.id,
      state: task.state,
      progress: task.progress,
      error: task.error,
      sha256: task.sha256,
      mode: task.mode,
    });
  if (task.state !== "done" || !existsSync(task.output))
    return send(res, 409, { error: "Result unavailable" });
  if (m[1] === "manifest") {
    const file = task.output + ".manifest.json";
    return existsSync(file)
      ? send(res, 200, readFileSync(file), "application/json; charset=utf-8")
      : send(res, 404, { error: "No manifest for this format" });
  }
  return send(
    res,
    200,
    readFileSync(task.output),
    task.mode === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  );
});
server.listen(8765, "127.0.0.1", () =>
  console.log(
    `Local export helper on http://127.0.0.1:8765\nWorkbench token: ${token}`,
  ),
);
