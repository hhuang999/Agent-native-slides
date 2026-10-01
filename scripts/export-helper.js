#!/usr/bin/env node
/** Loopback helper for snapshot exports and optional history of one explicitly selected HTML file. */
import { createServer } from "node:http";
import { randomBytes, createHash, randomUUID } from "node:crypto";
import {
  mkdtempSync,
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  renameSync,
  unlinkSync,
  realpathSync,
} from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { assertDocument } from "./lib/document-model.js";

const token = randomBytes(18).toString("hex");
const jobs = new Map();
const temp = mkdtempSync(join(tmpdir(), "ans-helper-"));
const namedFile =
  process.argv[2] === "--file" && process.argv[3]
    ? resolve(process.argv[3])
    : null;
if (namedFile && !existsSync(namedFile))
  throw Error(`Selected HTML does not exist: ${namedFile}`);
const selectedFile = namedFile ? realpathSync(namedFile) : null;
const port = Number(process.env.ANS_HELPER_PORT || 8765);
const sha = (value) => createHash("sha256").update(value).digest("hex");
const model = (html) => {
  const match = html.match(
    /<script\s+id="ans-document"\s+type="application\/json">([\s\S]*?)<\/script>/i,
  );
  if (!match) throw coded("MODEL_MISSING");
  const document = JSON.parse(match[1]);
  if (!document?.id || document.version !== 1) throw coded("MODEL_INVALID");
  return assertDocument(document);
};
const coded = (code, message = code) =>
  Object.assign(new Error(message), { code });
const selected =
  selectedFile && existsSync(selectedFile)
    ? model(readFileSync(selectedFile, "utf8"))
    : null;
const historyBase = process.env.ANS_HISTORY_ROOT
  ? resolve(process.env.ANS_HISTORY_ROOT)
  : join(homedir(), ".agent-native-slides", "history");
const historyRoot =
  selectedFile &&
  join(
    historyBase,
    sha(
      (process.platform === "win32"
        ? selectedFile.toLowerCase()
        : selectedFile) +
        "\0" +
        selected.id,
    ).slice(0, 20),
  );
const trackedFile = historyRoot && join(historyRoot, "deck.html");
const git = (...args) => {
  const result = spawnSync("git", args, {
    cwd: historyRoot,
    encoding: "utf8",
    windowsHide: true,
    maxBuffer: 50_000_000,
  });
  return {
    ...result,
    stdout: result.stdout || "",
    stderr: result.stderr || result.error?.message || "",
  };
};
const historyEnabled = () =>
  historyRoot && existsSync(join(historyRoot, ".git"));
const head = () => {
  if (!historyEnabled()) return null;
  const r = git("rev-parse", "HEAD");
  return r.status === 0 ? r.stdout.trim() : null;
};
function commit(html, message) {
  if (!historyEnabled()) throw coded("HISTORY_DISABLED");
  writeFileSync(trackedFile, html, "utf8");
  let r = git("add", "--", "deck.html");
  if (r.status !== 0) throw coded("GIT_FAILED", r.stderr.trim());
  r = git("diff", "--cached", "--quiet", "--", "deck.html");
  if (r.status === 0) return { commit: head(), changed: false };
  r = git(
    "-c",
    "user.name=Agent Native Slides",
    "-c",
    "user.email=local@agent-native-slides.invalid",
    "commit",
    "-m",
    message,
    "--",
    "deck.html",
  );
  if (r.status !== 0) throw coded("GIT_FAILED", r.stderr.trim());
  return { commit: head(), changed: true };
}
function enableHistory() {
  if (!selectedFile || !selected) throw coded("FILE_NOT_SELECTED");
  if (!historyEnabled()) {
    mkdirSync(historyRoot, { recursive: true });
    const r = git("init", "--quiet");
    if (r.status !== 0) throw coded("GIT_FAILED", r.stderr.trim());
    writeFileSync(join(historyRoot, ".gitignore"), "*\n!deck.html\n", "utf8");
  }
  return commit(readFileSync(selectedFile, "utf8"), "Initial deck version");
}
function fileInfo() {
  if (!selectedFile || !selected) throw coded("FILE_NOT_SELECTED");
  const html = readFileSync(selectedFile, "utf8");
  if (model(html).id !== selected.id) throw coded("DOCUMENT_MISMATCH");
  const version = head();
  const date = version
    ? git("show", "-s", "--format=%aI", version).stdout.trim()
    : null;
  return {
    path: selectedFile,
    documentId: selected.id,
    diskSha256: sha(html),
    historyPath: historyRoot,
    historyEnabled: !!historyEnabled(),
    version,
    versionDate: date,
  };
}
function atomicWrite(html) {
  const backup = join(temp, randomUUID() + ".before.html");
  copyFileSync(selectedFile, backup);
  const staging = join(dirname(selectedFile), `.ans-${randomUUID()}.tmp`);
  writeFileSync(staging, html, "utf8");
  try {
    renameSync(staging, selectedFile);
  } catch (error) {
    // Windows can deny replacement of an existing file. Keep the backup before falling back.
    writeFileSync(selectedFile, html, "utf8");
    if (existsSync(staging)) unlinkSync(staging);
  }
  return backup;
}
function saveSelected(data, recordHistory = true) {
  const info = fileInfo();
  if (typeof data.html !== "string" || sha(data.html) !== data.sha256)
    throw coded("HASH_MISMATCH");
  if (model(data.html).id !== selected.id) throw coded("DOCUMENT_MISMATCH");
  if (data.baseline !== info.diskSha256) throw coded("DISK_CONFLICT");
  if (
    JSON.stringify(model(data.html)) ===
    JSON.stringify(model(readFileSync(selectedFile, "utf8")))
  ) {
    const committed =
      historyEnabled() && head() ? git("show", "HEAD:deck.html").stdout : null;
    const versionSaved =
      !!committed &&
      JSON.stringify(model(committed)) ===
        JSON.stringify(model(readFileSync(selectedFile, "utf8")));
    return {
      fileSaved: true,
      versionSaved,
      changed: false,
      ...info,
      error:
        historyEnabled() && !versionSaved
          ? {
              code: "GIT_PENDING",
              message:
                "File is saved but its current version is not recorded; retry Record version",
            }
          : null,
    };
  }
  atomicWrite(data.html);
  let versionSaved = false,
    version = head(),
    error = null;
  if (historyEnabled() && recordHistory) {
    try {
      const result = commit(data.html, data.message || "Save deck");
      version = result.commit;
      versionSaved = true;
    } catch (e) {
      error = { code: e.code || "GIT_FAILED", message: e.message };
    }
  }
  return {
    fileSaved: true,
    versionSaved,
    error,
    changed: true,
    ...fileInfo(),
    version,
  };
}
function listHistory() {
  if (!historyEnabled()) throw coded("HISTORY_DISABLED");
  const r = git("log", "--format=%H%x09%aI%x09%s", "--", "deck.html");
  if (r.status !== 0) throw coded("GIT_FAILED", r.stderr.trim());
  return r.stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [id, date, ...message] = line.split("\t");
      return { id, date, message: message.join("\t") };
    });
}
function versionHtml(id) {
  if (!/^[0-9a-f]{40}$/.test(id) || !listHistory().some((v) => v.id === id))
    throw coded("VERSION_MISSING");
  const r = git("show", `${id}:deck.html`);
  if (r.status !== 0) throw coded("GIT_FAILED", r.stderr.trim());
  return r.stdout;
}
function restoreVersion(data) {
  const info = fileInfo();
  if (data.baseline !== info.diskSha256) throw coded("DISK_CONFLICT");
  const older = versionHtml(data.id);
  if (model(older).id !== selected.id) throw coded("DOCUMENT_MISMATCH");
  // Preserve the current disk state before restoring. Restore is a new commit, never a reset.
  commit(readFileSync(selectedFile, "utf8"), "Before restore");
  atomicWrite(older);
  const result = commit(older, `Restore ${data.id.slice(0, 10)}`);
  return {
    ...fileInfo(),
    restoredSha256: sha(older),
    version: result.commit,
    html: older,
  };
}
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
async function body(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 40_000_000) throw coded("TOO_LARGE");
  }
  return raw ? JSON.parse(raw) : {};
}
const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, "");
  if (req.headers["x-ans-token"] !== token)
    return send(res, 403, { code: "BAD_TOKEN", error: "Wrong helper token" });
  if (req.method === "GET" && req.url === "/health")
    return send(res, 200, { service: "agent-native-slides-helper" });
  const path = (req.url || "").split("?")[0];
  try {
    if (path === "/file/info" && req.method === "GET")
      return send(res, 200, fileInfo());
    if (path === "/file/current" && req.method === "GET") {
      const info = fileInfo();
      const html = readFileSync(selectedFile, "utf8");
      return send(res, 200, { html, sha256: info.diskSha256 });
    }
    if (path === "/file/enable-history" && req.method === "POST") {
      const result = enableHistory();
      return send(res, 200, { ...fileInfo(), ...result });
    }
    if (path === "/file/save" && req.method === "POST")
      return send(res, 200, saveSelected(await body(req)));
    if (path === "/file/write" && req.method === "POST")
      return send(res, 200, saveSelected(await body(req), false));
    if (path === "/history" && req.method === "GET")
      return send(res, 200, { versions: listHistory(), ...fileInfo() });
    if (path === "/history/record" && req.method === "POST") {
      const data = await body(req),
        info = fileInfo();
      if (data.baseline !== info.diskSha256) throw coded("DISK_CONFLICT");
      return send(res, 200, {
        ...commit(
          readFileSync(selectedFile, "utf8"),
          data.message || "Record saved deck",
        ),
        ...fileInfo(),
      });
    }
    if (path === "/history/restore" && req.method === "POST")
      return send(res, 200, restoreVersion(await body(req)));
    const preview = path.match(/^\/history\/([0-9a-f]{40})$/);
    if (preview && req.method === "GET") {
      const html = versionHtml(preview[1]);
      return send(res, 200, {
        id: preview[1],
        sha256: sha(html),
        document: model(html),
        html,
      });
    }
    if (path === "/export" && req.method === "POST") {
      const data = await body(req);
      if (
        !["editable", "image", "pdf"].includes(data.mode) ||
        typeof data.html !== "string" ||
        sha(data.html) !== data.sha256
      )
        throw coded("HASH_MISMATCH");
      model(data.html);
      const id = randomUUID(),
        input = join(temp, id + ".html"),
        output = join(temp, id + (data.mode === "pdf" ? ".pdf" : ".pptx"));
      writeFileSync(input, data.html);
      const task = {
        id,
        state: "queued",
        stage: "accepted",
        sha256: data.sha256,
        mode: data.mode,
        output,
        startedAt: Date.now(),
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
      task.stage = "converting";
      let stderr = "";
      child.stderr.on(
        "data",
        (chunk) => (stderr = (stderr + String(chunk)).slice(-4000)),
      );
      child.on("error", (e) => {
        task.state = "failed";
        task.stage = "failed";
        task.error = e.message;
      });
      child.on("exit", (code) => {
        if (task.state === "failed") return;
        task.state = code === 0 ? "done" : "failed";
        task.stage = task.state;
        if (code !== 0) task.error = stderr || `Exit ${code}`;
      });
      return send(res, 202, { id, sha256: data.sha256, state: task.state });
    }
    const m = path.match(/^\/(task|result|manifest)\/([0-9a-f-]+)$/);
    if (!m)
      return send(res, 404, { code: "UNKNOWN_ROUTE", error: "Unknown route" });
    const task = jobs.get(m[2]);
    if (!task)
      return send(res, 404, { code: "UNKNOWN_TASK", error: "Unknown task" });
    if (m[1] === "task")
      return send(res, 200, {
        id: task.id,
        state: task.state,
        stage: task.stage,
        error: task.error,
        sha256: task.sha256,
        mode: task.mode,
        elapsedMs: Date.now() - task.startedAt,
      });
    if (task.state !== "done" || !existsSync(task.output))
      throw coded("RESULT_UNAVAILABLE");
    if (m[1] === "manifest") {
      const file = task.output + ".manifest.json";
      return existsSync(file)
        ? send(res, 200, readFileSync(file), "application/json; charset=utf-8")
        : send(res, 404, { code: "MANIFEST_MISSING", error: "No manifest" });
    }
    return send(
      res,
      200,
      readFileSync(task.output),
      task.mode === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
  } catch (e) {
    return send(
      res,
      ["DISK_CONFLICT", "DOCUMENT_MISMATCH"].includes(e.code) ? 409 : 400,
      { code: e.code || "HELPER_ERROR", error: e.message },
    );
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(
    `Local deck helper on http://127.0.0.1:${port}\nWorkbench token: ${token}\nSelected file: ${selectedFile || "none (export only)"}\nHistory location: ${historyRoot || "not available"}`,
  ),
);
