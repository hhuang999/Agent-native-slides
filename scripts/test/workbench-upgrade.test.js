import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  unlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { launchChromium } from "../lib/browser.js";

const root = resolve(import.meta.dirname, "../..");
const dir = mkdtempSync(join(tmpdir(), "ans-upgrade-test-"));
const sha = (data) => createHash("sha256").update(data).digest("hex");
const run = (script, args) => {
  const result = spawnSync(
    process.execPath,
    [resolve(root, "scripts", script), ...args],
    { cwd: root, encoding: "utf8", maxBuffer: 5_000_000 },
  );
  assert.equal(
    result.status,
    0,
    `${script}: ${result.stdout}\n${result.stderr}`,
  );
};
const sample = () => ({
  version: 1,
  id: "upgrade-acceptance",
  title: "中文 English 工作台",
  language: "zh-CN",
  styleId: "A01",
  theme: {
    css: ":root{--color-bg:#10242b;--color-body:#eff9f8;--color-accent:#4bd7cb}.slide{background:#10242b;font-family:Arial,sans-serif}",
  },
  resources: {},
  pages: [
    {
      id: "first",
      title: "第一页 First",
      layout: "absolute",
      notes: "中文与 English notes",
      objects: [
        {
          id: "title",
          type: "text",
          text: "初始标题 Start",
          box: { x: 120, y: 120, w: 1120, h: 130 },
          style: { fontSize: 72, color: "#ffffff" },
        },
        {
          id: "shape",
          type: "shape",
          shape: "rect",
          fill: "#4bd7cb",
          box: { x: 140, y: 400, w: 280, h: 180 },
        },
        {
          id: "chart",
          type: "chart",
          chartType: "bar",
          categories: ["甲", "B"],
          series: [{ name: "数值 Values", values: [2, 5] }],
          box: { x: 650, y: 390, w: 800, h: 420 },
        },
      ],
    },
    {
      id: "second",
      title: "Second",
      layout: "absolute",
      notes: "Second notes",
      objects: [
        {
          id: "tail",
          type: "text",
          text: "结束 End",
          box: { x: 140, y: 160, w: 900, h: 120 },
          style: { fontSize: 70, color: "#ffffff" },
        },
        {
          id: "matrix",
          type: "table",
          rows: [
            ["名称", "值"],
            ["A", "1"],
          ],
          box: { x: 140, y: 390, w: 610, h: 290 },
        },
        {
          id: "relations",
          type: "diagram",
          nodes: [
            { id: "left", label: "输入", x: 4, y: 35, w: 30, h: 24 },
            { id: "right", label: "输出", x: 65, y: 35, w: 30, h: 24 },
          ],
          edges: [{ from: "left", to: "right" }],
          box: { x: 880, y: 390, w: 790, h: 290 },
        },
      ],
    },
  ],
});

async function startHelper(html) {
  const child = spawn(
    process.execPath,
    [resolve(root, "scripts/export-helper.js"), "--file", html],
    {
      cwd: root,
      env: { ...process.env, ANS_HISTORY_ROOT: join(dir, "histories") },
      windowsHide: true,
    },
  );
  let token = "";
  await new Promise((resolve, reject) => {
    child.stdout.on("data", (chunk) => {
      const match = String(chunk).match(/Workbench token: ([a-f0-9]+)/);
      if (match) {
        token = match[1];
        resolve();
      }
    });
    child.on("error", reject);
    child.on("exit", (code) => reject(Error(`helper exited ${code}`)));
    setTimeout(() => reject(Error("helper startup timeout")), 8000);
  });
  const request = async (path, data) => {
    const response = await fetch("http://127.0.0.1:8765" + path, {
      method: data ? "POST" : "GET",
      headers: { "x-ans-token": token, "content-type": "application/json" },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    const json = await response.json();
    return { status: response.status, ...json };
  };
  return { child, token, request };
}

test("Chinese UI, deterministic snapshots, visual editing, dedicated Git history, and background export", async () => {
  const source = join(dir, "upgrade.json"),
    html = join(dir, "upgrade.html");
  writeFileSync(source, JSON.stringify(sample()));
  run("build-deck.js", [source, html]);
  const browser = await launchChromium();
  const helper = await startHelper(html);
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      acceptDownloads: true,
    });
    const browserErrors = [];
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("dialog", (dialog) => dialog.accept());
    await page.goto("file:///" + html.replaceAll("\\", "/"));
    await page.locator("#ans-edit").click();
    assert.equal(
      await page.locator("#ans-pages button").count(),
      2,
      browserErrors.join("\n"),
    );
    assert.equal(await page.locator("#ans-save").textContent(), "保存");
    assert.equal(await page.locator("#ans-ui-language").inputValue(), "zh-CN");
    const firstSnapshot = await page.evaluate(() => ANSWorkbench.serialize());
    const firstHash = sha(firstSnapshot);
    await page.locator("#ans-ui-language").selectOption("en");
    assert.equal(await page.locator("#ans-save").textContent(), "Save");
    await page.locator("#ans-ui-language").selectOption("zh-CN");
    assert.equal(
      sha(await page.evaluate(() => ANSWorkbench.serialize())),
      firstHash,
    );
    assert.doesNotMatch(
      await page.locator("#ans-status").textContent(),
      /未保存/,
    );
    const top = page.locator(".ans-top");
    assert.equal(
      await top.evaluate(
        (node) =>
          node.scrollWidth <= node.clientWidth + 1 &&
          node.scrollHeight <= node.clientHeight + 1,
      ),
      true,
      "toolbar fits 1440px",
    );
    await page.setViewportSize({ width: 1280, height: 800 });
    assert.equal(
      await top.evaluate(
        (node) =>
          node.scrollWidth <= node.clientWidth + 1 &&
          node.scrollHeight <= node.clientHeight + 1,
      ),
      true,
      "toolbar fits 1280px",
    );
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator("#ans-helper-token").fill(helper.token);
    await page.locator("#ans-helper-connect").click();
    await page.waitForFunction(() =>
      document
        .querySelector("#ans-file-info")
        ?.textContent.includes("upgrade.html"),
    );
    assert.match(
      await page.locator("#ans-file-info").textContent(),
      /upgrade.html/,
    );
    await page.locator("#ans-history-enable").click();
    await page.waitForFunction(() =>
      document.querySelector("#ans-history-list")?.querySelector("button"),
    );
    const initial = await helper.request("/history");
    assert.equal(initial.versions.length, 1);
    const selectedId = initial.versions[0].id;
    const gitPath = initial.historyPath;
    const tree = spawnSync("git", ["ls-tree", "-r", "--name-only", "HEAD"], {
      cwd: gitPath,
      encoding: "utf8",
    });
    assert.equal(
      tree.stdout.trim(),
      "deck.html",
      "history only tracks selected HTML",
    );

    await page
      .locator("#ans-layers button")
      .filter({ hasText: "图表" })
      .first()
      .click();
    const number = page
      .locator("#ans-props .ans-data-grid input[type=number]")
      .first();
    await number.fill("7");
    await number.dispatchEvent("change");
    assert.equal(
      await page.evaluate(
        () =>
          ANSWorkbench.document.pages[0].objects.find((o) => o.id === "chart")
            .series[0].values[0],
      ),
      7,
    );
    await page.locator("#ans-undo").click();
    assert.equal(
      await page.evaluate(
        () =>
          ANSWorkbench.document.pages[0].objects.find((o) => o.id === "chart")
            .series[0].values[0],
      ),
      2,
    );
    await page.locator("#ans-redo").click();
    await page
      .locator("#ans-props .ans-data-grid input[type=number]")
      .first()
      .fill("");
    await page
      .locator("#ans-props .ans-data-grid input[type=number]")
      .first()
      .dispatchEvent("change");
    assert.equal(
      await page.evaluate(
        () =>
          ANSWorkbench.document.pages[0].objects.find((o) => o.id === "chart")
            .series[0].values[0],
      ),
      7,
      "invalid chart value is rejected",
    );
    await page.locator("#ans-pages button").nth(1).click();
    await page
      .locator("#ans-layers button")
      .filter({ hasText: "表格" })
      .click();
    const cell = page.locator("#ans-props .ans-data-grid input").nth(3);
    await cell.fill("9");
    await cell.dispatchEvent("change");
    await page
      .locator("#ans-layers button")
      .filter({ hasText: "关系图" })
      .click();
    const nodeLabel = page
      .locator(
        "#ans-props .ans-structured-editor .ans-data-row input:not([type=number])",
      )
      .first();
    await nodeLabel.fill("新输入");
    await nodeLabel.dispatchEvent("change");
    assert.equal(
      await page.evaluate(
        () =>
          ANSWorkbench.document.pages[1].objects.find((o) => o.id === "matrix")
            .rows[1][1],
      ),
      "9",
    );
    assert.equal(
      await page.evaluate(
        () =>
          ANSWorkbench.document.pages[1].objects.find(
            (o) => o.id === "relations",
          ).nodes[0].label,
      ),
      "新输入",
    );
    await page.locator("#ans-pages button").first().click();

    await page
      .locator("#ans-layers button")
      .filter({ hasText: "文字" })
      .first()
      .click();
    const before = await page.evaluate(
      () => ANSWorkbench.document.pages[0].objects[0].box,
    );
    const target = page.locator(".slide.is-active [data-object-id=title]");
    const box = await target.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box.x + box.width / 2 + 42,
      box.y + box.height / 2 + 18,
      { steps: 5 },
    );
    await page.mouse.up();
    const moved = await page.evaluate(
      () => ANSWorkbench.document.pages[0].objects[0].box,
    );
    assert.notEqual(moved.x, before.x);
    await page.locator("#ans-undo").click();
    assert.equal(
      (await page.evaluate(() => ANSWorkbench.document.pages[0].objects[0].box))
        .x,
      before.x,
    );
    await page.locator("#ans-redo").click();
    assert.equal(
      (await page.evaluate(() => ANSWorkbench.document.pages[0].objects[0].box))
        .x,
      moved.x,
    );
    const handle = page.locator(
      ".slide.is-active [data-object-id=title] .ans-resize-handle",
    );
    const hb = await handle.boundingBox();
    await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
    await page.mouse.down();
    await page.mouse.move(hb.x + hb.width / 2 + 24, hb.y + hb.height / 2 + 18, {
      steps: 4,
    });
    await page.mouse.up();
    assert.ok(
      (await page.evaluate(
        () => ANSWorkbench.document.pages[0].objects[0].box.w,
      )) > before.w,
    );
    await page
      .locator("#ans-layers button")
      .filter({ hasText: "文字" })
      .first()
      .click();
    await page
      .locator("#ans-props textarea")
      .first()
      .fill("人工修改 · Human edit");
    await page.locator("#ans-props textarea").first().dispatchEvent("change");
    await page.locator("#ans-version-message").fill("Human review one");
    await page.locator("#ans-save").click();
    await page.waitForFunction(() =>
      document.querySelector("#ans-status")?.textContent.includes("版本已记录"),
    );
    const saved = await helper.request("/history");
    assert.equal(saved.versions.length, 2);
    assert.equal(saved.versions[0].message, "Human review one");
    assert.match(readFileSync(html, "utf8"), /人工修改 · Human edit/);
    const backup = page.waitForEvent("download");
    await page.locator("#ans-backup").click();
    assert.match((await backup).suggestedFilename(), /backup\.html$/);
    await page.locator("#ans-save").click();
    assert.equal(
      (await helper.request("/history")).versions.length,
      2,
      "no empty commit",
    );
    await page.close();
    const reopened = await browser.newPage();
    await reopened.goto("file:///" + html.replaceAll("\\", "/"));
    assert.equal(
      await reopened.evaluate(
        () => ANSWorkbench.document.pages[0].objects[0].text,
      ),
      "人工修改 · Human edit",
    );
    assert.equal(
      await reopened.evaluate(() => ANSWorkbench.document.pages[0].id),
      "first",
    );
    await reopened.close();

    const copy = join(dir, "standalone-copy.html");
    copyFileSync(html, copy);
    const detached = await browser.newPage();
    await detached.goto("file:///" + copy.replaceAll("\\", "/"));
    await detached.locator("#ans-edit").click();
    assert.equal(await detached.locator("#ans-save").textContent(), "保存");
    await detached.close();

    const editPage = await browser.newPage({ acceptDownloads: true });
    editPage.on("dialog", (dialog) => dialog.accept());
    await editPage.goto("file:///" + html.replaceAll("\\", "/"));
    await editPage.locator("#ans-edit").click();
    await editPage.locator("#ans-helper-token").fill(helper.token);
    await editPage.locator("#ans-helper-connect").click();
    await editPage.waitForFunction(() =>
      document.querySelector("#ans-file-info")?.textContent.includes("版本"),
    );
    await editPage
      .locator("#ans-layers button")
      .filter({ hasText: "文字" })
      .first()
      .click();
    await editPage
      .locator("#ans-props textarea")
      .first()
      .fill("自动版本 Auto version");
    await editPage
      .locator("#ans-props textarea")
      .first()
      .dispatchEvent("change");
    await editPage.clock.install();
    await editPage.locator("#ans-history-auto").check();
    await editPage.clock.runFor(61000);
    await editPage.waitForTimeout(1200);
    assert.equal(
      (await helper.request("/history")).versions.length,
      3,
      await editPage.locator("#ans-status").textContent(),
    );

    const snapshot = await editPage.evaluate(() => ANSWorkbench.serialize());
    const clickedHash = sha(snapshot);
    await editPage.locator("#ans-export-mode").selectOption("editable");
    await editPage.locator("#ans-helper-token").fill("wrong-token");
    await editPage.locator("#ans-export").click();
    await editPage.waitForFunction(
      () => document.querySelector("#ans-task-title")?.textContent === "失败",
    );
    assert.match(
      await editPage.locator("#ans-task-details").textContent(),
      /令牌错误/,
    );
    await editPage.locator("#ans-helper-token").fill(helper.token);
    const download = editPage.waitForEvent("download", { timeout: 30000 });
    await editPage.locator("#ans-task-retry").click();
    await editPage
      .locator("#ans-layers button")
      .filter({ hasText: "文字" })
      .first()
      .click();
    await editPage
      .locator("#ans-props textarea")
      .first()
      .fill("后来改的 Late edit");
    await editPage
      .locator("#ans-props textarea")
      .first()
      .dispatchEvent("change");
    assert.notEqual(
      sha(await editPage.evaluate(() => ANSWorkbench.serialize())),
      clickedHash,
    );
    assert.match((await download).suggestedFilename(), /\.pptx$/);
    await editPage.waitForFunction(
      () => document.querySelector("#ans-task-title")?.textContent === "已完成",
      null,
      { timeout: 30000 },
    );
    assert.match(
      await editPage.locator("#ans-task-details").textContent(),
      new RegExp(clickedHash),
    );
    writeFileSync(
      html,
      readFileSync(html, "utf8") + "<!-- external change -->",
    );
    await editPage.locator("#ans-history-auto").uncheck();
    await editPage.locator("#ans-save").click();
    await editPage.waitForFunction(() =>
      document.querySelector("#ans-status")?.textContent.includes("冲突"),
    );
    assert.equal((await helper.request("/history")).versions.length, 3);
    await editPage.close();

    const conflict = await helper.request("/file/save", {
      html: snapshot,
      sha256: clickedHash,
      baseline: "bad",
    });
    assert.equal(conflict.status, 409);
    assert.equal(conflict.code, "DISK_CONFLICT");
    const current = await helper.request("/file/info");
    const restore = await helper.request("/history/restore", {
      id: selectedId,
      baseline: current.diskSha256,
    });
    assert.equal(restore.status, 200);
    assert.equal(restore.documentId, "upgrade-acceptance");
    const afterRestore = await helper.request("/history");
    assert.equal(afterRestore.versions.length, 5);
    assert.equal(afterRestore.versions[1].message, "Before restore");
    assert.equal(
      JSON.parse(
        readFileSync(html, "utf8").match(
          /<script id="ans-document" type="application\/json">([\s\S]*?)<\/script>/,
        )[1],
      ).pages[0].objects[0].text,
      "初始标题 Start",
    );

    const historyPage = await browser.newPage();
    historyPage.on("dialog", (dialog) => dialog.accept());
    await historyPage.goto("file:///" + html.replaceAll("\\", "/"));
    await historyPage.locator("#ans-edit").click();
    await historyPage.locator("#ans-helper-token").fill(helper.token);
    await historyPage.locator("#ans-helper-connect").click();
    await historyPage.waitForFunction(() =>
      document.querySelector("#ans-history-list button"),
    );
    await historyPage
      .locator("#ans-history-list button")
      .filter({ hasText: saved.versions[0].id.slice(0, 10) })
      .click();
    await historyPage.waitForFunction(() =>
      document
        .querySelector("#ans-history-preview")
        ?.textContent.includes("第一页 First"),
    );
    assert.match(
      await historyPage.locator("#ans-history-preview").textContent(),
      /第一页 First/,
    );
    await historyPage
      .frameLocator("#ans-history-preview iframe")
      .locator(".slide.is-active")
      .waitFor();
    await historyPage.locator("#ans-history-preview button").click();
    await historyPage.waitForFunction(() =>
      document
        .querySelector("#ans-status")
        ?.textContent.includes("已恢复并创建新版本"),
    );
    assert.equal((await helper.request("/history")).versions.length, 6);
    assert.match(readFileSync(html, "utf8"), /人工修改 · Human edit/);
    await historyPage.close();

    const partialPage = await browser.newPage();
    partialPage.on("dialog", (dialog) => dialog.accept());
    await partialPage.goto("file:///" + html.replaceAll("\\", "/"));
    await partialPage.locator("#ans-edit").click();
    await partialPage.locator("#ans-helper-token").fill(helper.token);
    await partialPage.locator("#ans-helper-connect").click();
    await partialPage.waitForFunction(() =>
      document.querySelector("#ans-file-info")?.textContent.includes("版本"),
    );
    await partialPage
      .locator("#ans-layers button")
      .filter({ hasText: "文字" })
      .first()
      .click();
    await partialPage
      .locator("#ans-props textarea")
      .first()
      .fill("文件已存，Git 待记录");
    await partialPage
      .locator("#ans-props textarea")
      .first()
      .dispatchEvent("change");
    const lock = join(gitPath, ".git", "index.lock");
    writeFileSync(lock, "simulate Git index lock");
    await partialPage.locator("#ans-save").click();
    await partialPage.waitForFunction(() =>
      document
        .querySelector("#ans-status")
        ?.textContent.includes("文件已保存；版本未记录"),
    );
    const writtenHash = (await helper.request("/file/info")).diskSha256;
    assert.match(readFileSync(html, "utf8"), /文件已存，Git 待记录/);
    assert.equal((await helper.request("/history")).versions.length, 6);
    unlinkSync(lock);
    await partialPage.locator("#ans-history-record").click();
    await partialPage.waitForFunction(() =>
      document.querySelector("#ans-status")?.textContent.includes("版本已记录"),
    );
    assert.equal((await helper.request("/history")).versions.length, 7);
    assert.equal(
      (await helper.request("/file/info")).diskSha256,
      writtenHash,
      "retry does not rewrite saved HTML",
    );
    await partialPage.close();
  } finally {
    helper.child.kill();
    await browser.close();
  }
});
