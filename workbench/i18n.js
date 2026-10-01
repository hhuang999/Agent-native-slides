(() => {
  "use strict";
  const zh = {
    "Edit deck": "编辑文稿",
    Undo: "撤销",
    Redo: "重做",
    Present: "演示",
    Overview: "页面总览",
    Speaker: "演讲者",
    Theme: "主题",
    Save: "保存",
    "Save as": "另存为",
    "Link file": "关联文件",
    "Download HTML": "下载 HTML 副本",
    "Restore draft": "恢复草稿",
    Backup: "覆盖前备份",
    "Editable PPTX": "可编辑 PPTX",
    "Image PPTX": "整页图片 PPTX",
    "Export current": "导出当前快照",
    Pages: "页面",
    "New page": "新建页面",
    Duplicate: "复制",
    Delete: "删除",
    Insert: "插入",
    "Choose object…": "选择对象…",
    Layers: "图层",
    Properties: "属性",
    "Speaker notes": "演讲备注",
    "Canvas zoom": "画布缩放",
    Fit: "适配窗口",
    History: "版本历史",
    "Connect helper": "连接助手",
    "Enable history": "启用此文稿历史",
    "Auto version": "空闲自动保存并记录版本",
    "Record version": "重试记录版本",
    "Refresh history": "刷新历史",
    "Preview version": "预览版本",
    "Restore version": "恢复为新版本",
    "Export latest": "导出最新状态",
    "Retry snapshot": "重试相同快照",
    Close: "关闭",
    Language: "界面语言",
    "Local helper token": "本地助手令牌",
    text: "文字",
    image: "图片",
    shape: "形状",
    connector: "连线",
    diagram: "关系图",
    table: "表格",
    chart: "图表",
    formula: "公式",
    code: "代码",
    "Select an object to edit its content and style.":
      "选择对象后编辑内容与样式。",
    "LaTeX source": "LaTeX 源码",
    Content: "内容",
    "Alt text": "替代文本",
    "Crop x %": "裁剪 X %",
    "Crop y %": "裁剪 Y %",
    "Shape: rect / ellipse": "形状：矩形／椭圆",
    Fill: "填充",
    "Chart type": "图表类型",
    "Categories (comma separated)": "分类（逗号分隔）",
    "Series JSON": "系列 JSON",
    "Rows (TSV)": "表格（制表符分隔）",
    Order: "顺序",
    "Group ID": "组 ID",
    "Animation: none / fade / rise": "动画：无／淡入／上浮",
    "Reveal step": "逐步显示序号",
    Front: "置于顶层",
    Back: "置于底层",
    "Group selected": "组合所选",
    Ungroup: "取消组合",
    Align: "对齐与分布",
    "Align left": "左对齐",
    "Align center": "水平居中",
    "Align right": "右对齐",
    "Distribute horizontal": "水平分布",
    "Distribute vertical": "垂直分布",
    Nodes: "节点",
    Node: "节点",
    "Node label": "节点标签",
    "Delete node": "删除节点",
    "Add node": "添加节点",
    Connections: "连接",
    "Delete connection": "删除连接",
    "Add connection": "添加连接",
    Row: "行",
    Column: "列",
    "Add row": "添加行",
    "Add column": "添加列",
    "Remove row": "删除行",
    "Remove column": "删除列",
    Category: "分类",
    Series: "系列",
    "Series name": "系列名称",
    "Add category": "添加分类",
    "Remove category": "删除分类",
    "Add series": "添加系列",
    "Remove series": "删除系列",
    bar: "柱状图",
    line: "折线图",
    pie: "饼图",
    scatter: "散点图",
    rect: "矩形",
    ellipse: "椭圆",
    none: "无",
    fade: "淡入",
    rise: "上浮",
    Download: "下载",
    Slide: "幻灯片",
    "Untitled deck": "未命名文稿",
    "No notes": "暂无备注",
    "End of deck": "文稿结束",
    "Close overview ×": "关闭总览 ×",
    "Presenter view": "演讲者视图",
    "Next slide": "下一页",
    Previous: "上一页",
    Next: "下一页",
    "File history": "文件历史",
    "Draft saved": "草稿已记录",
    "Saved snapshot": "已保存",
    "Unsaved changes · browser draft active": "未保存 · 浏览器草稿已启用",
    "No browser draft": "没有浏览器草稿",
    "Restore browser draft from {date}?": "恢复 {date} 的浏览器草稿？",
    "Browser draft restored · save to keep it":
      "浏览器草稿已恢复 · 请保存到文件",
    "Draft unavailable: {error}": "草稿不可用：{error}",
    "No overwrite backup for this deck yet": "尚无覆盖前备份",
    "Downloaded pre-overwrite backup from {date}": "已下载 {date} 的覆盖前备份",
    "Disk file changed; save as a new file or reopen it.":
      "磁盘文件已被外部修改；请另存为或重新打开。",
    "Save failed: {error}": "保存失败：{error}",
    "Saved to {name}": "已写入文件 {name}",
    "Associated with {name}": "已关联 {name}",
    "Direct write unavailable; use Download HTML":
      "浏览器不支持直接写入，请下载 HTML 副本",
    "Downloaded HTML copy; source file unchanged": "已下载副本，原文件未写回",
    "Choose the current deck file": "请选择当前文稿文件",
    "Connect to selected file {path}?": "关联助手选定的文件 {path}？",
    "Start local export helper, then enter its token":
      "请启动本地助手并填写令牌",
    "Submitting current snapshot {hash}…": "正在提交当前快照 {hash}…",
    "Export failed: {error}": "导出失败：{error}",
    "Downloaded {mode} · input SHA256 {hash}":
      "已下载 {mode} · 输入 SHA256 {hash}",
    "Export has not started": "导出尚未开始",
    "Exporting in background": "正在后台导出",
    Accepted: "已接收",
    Converting: "正在转换",
    Complete: "已完成",
    Failed: "失败",
    "Helper is not running": "助手未运行",
    "Helper connection failed": "助手连接失败",
    "Wrong helper token": "助手令牌错误",
    "Select current HTML in helper": "助手未关联当前 HTML",
    "History is disabled": "此文稿尚未启用 Git 历史",
    "History stored at {path}": "版本存放于 {path}",
    "File {path} · document {id} · disk {hash}":
      "文件 {path} · 文档 {id} · 磁盘 {hash}",
    "Version {id} · {date}": "版本 {id} · {date}",
    "No versions yet": "尚无版本",
    "File saved; version not recorded: {error}":
      "文件已保存；版本未记录：{error}",
    "Version recorded {id}": "版本已记录 {id}",
    "Restored as new version {id}": "已恢复并创建新版本 {id}",
    "Git recording": "Git 记录中",
    Saving: "保存中",
    Conflict: "文件冲突",
    "Invalid value: {error}": "输入无效：{error}",
    "Name this version (optional)": "为版本填写说明（可选）",
    "Confirm restore as a new version?":
      "将此版本恢复并创建新版本？当前磁盘内容会先记录。",
    "Auto version paused after conflict": "检测到冲突，已暂停自动保存",
    "No changes to record": "内容没有变化，不创建空提交",
    "File not selected": "助手未指定文稿文件",
    "Source unchanged": "原文件未写回",
    "New page title": "新页面",
    "Snap to guides": "吸附辅助线",
    "Record saved deck": "记录已保存文稿",
  };
  const extra = {
    color: "文字颜色",
    background: "背景",
    fontSize: "字号",
    fontFamily: "字体",
    fontWeight: "字重",
    textAlign: "文字对齐",
    x: "横坐标 X",
    y: "纵坐标 Y",
    w: "宽度",
    h: "高度",
    "from.x": "起点 X",
    "from.y": "起点 Y",
    "to.x": "终点 X",
    "to.y": "终点 Y",
    "Page title": "页面标题",
    "Export format": "导出格式",
    "LaTeX source: {source}": "LaTeX 源码：{source}",
    "Advanced source": "高级源数据",
    "Align top": "顶端对齐",
    "Align middle": "垂直居中",
    "Align bottom": "底端对齐",
    "Auto version paused": "自动记录已暂停",
    "Browser draft available · Restore from File menu":
      "发现浏览器草稿 · 可点击恢复草稿",
    "Task snapshot hash mismatch": "导出任务快照哈希不一致",
    "Invalid document model": "文档模型无效",
    "Duplicate or missing ID: {id}": "ID 缺失或重复：{id}",
    "Invalid page layout": "页面布局无效",
    "Unknown object type: {type}": "未知对象类型：{type}",
    "Invalid object box": "对象位置或尺寸无效",
    "Text source required": "缺少文本源",
    "Embedded image required": "缺少内嵌图片",
    "Shape must be rect or ellipse": "形状必须是矩形或椭圆",
    "Connector endpoints must be numeric": "连线端点必须是数值",
    "Diagram nodes and edges required": "关系图需要节点和连接",
    "Invalid diagram node": "关系图节点无效",
    "Diagram edge refers to missing node": "连接指向不存在的节点",
    "Table rows must have equal columns": "表格每行列数必须一致",
    "Chart needs type, categories and series": "图表需要类型、分类和系列",
    "Chart values must match categories and be numeric":
      "图表值必须与分类数一致且为数值",
    "Unsupported animation": "不支持的动画",
    "Invalid object order": "对象顺序无效",
    "Crop must be 0–100": "裁剪值必须在 0–100 之间",
    "Percent must be 0–100": "百分比必须在 0–100 之间",
    "Numeric value required": "请输入数值",
    "Category count must match series length": "分类数必须与系列数一致",
    "Finite number required": "请输入有效数值",
    "Positive font size required": "字号必须为正数",
    "Invalid color": "颜色无效",
    "Invalid style value": "样式值无效",
    "Nonnegative integer required": "请输入非负整数",
    "Endpoint must be 0–100": "端点坐标必须在 0–100 之间",
    "Git recording failed": "Git 记录失败",
    "Invalid snapshot or hash": "快照或哈希无效",
    "Editable deck model missing": "缺少可编辑文稿模型",
    "Result unavailable": "导出结果尚不可用",
    "Invalid deck model": "文稿模型无效",
    "Snapshot too large": "快照过大",
    "Unknown export task": "找不到导出任务",
    "Unknown helper route": "本地助手接口不存在",
    "Manifest unavailable": "转换清单不可用",
    "Saved file needs a Git version": "文件已保存，待记录 Git 版本",
    "Helper error": "本地助手错误",
  };
  const errors = {
    BAD_TOKEN: "Wrong helper token",
    FILE_NOT_SELECTED: "File not selected",
    DISK_CONFLICT: "Disk file changed; save as a new file or reopen it.",
    DOCUMENT_MISMATCH: "Choose the current deck file",
    HISTORY_DISABLED: "History is disabled",
    HASH_MISMATCH: "Invalid snapshot or hash",
    MODEL_MISSING: "Editable deck model missing",
    MODEL_INVALID: "Invalid deck model",
    TOO_LARGE: "Snapshot too large",
    GIT_FAILED: "Git recording failed",
    GIT_PENDING: "Saved file needs a Git version",
    RESULT_UNAVAILABLE: "Result unavailable",
    UNKNOWN_TASK: "Unknown export task",
    UNKNOWN_ROUTE: "Unknown helper route",
    MANIFEST_MISSING: "Manifest unavailable",
    HELPER_ERROR: "Helper error",
  };
  const staticIds = {
    "#ans-edit": "Edit deck",
    "#ans-undo": "Undo",
    "#ans-redo": "Redo",
    "#ans-present": "Present",
    "#ans-overview": "Overview",
    "#ans-speaker": "Speaker",
    "#ans-save": "Save",
    "#ans-saveas": "Save as",
    "#ans-associate": "Link file",
    "#ans-download": "Download HTML",
    "#ans-restore": "Restore draft",
    "#ans-backup": "Backup",
    "#ans-export": "Export current",
    "#ans-add-page": "Duplicate",
    "#ans-new-page": "New page",
    "#ans-del-page": "Delete",
    "#ans-fit": "Fit",
    "#ans-helper-connect": "Connect helper",
    "#ans-history-enable": "Enable history",
    "#ans-history-refresh": "Refresh history",
    "#ans-history-record": "Record version",
    "#ans-task-retry": "Retry snapshot",
    "#ans-task-latest": "Export latest",
    "#ans-task-close": "Close",
  };
  const staticSelectors = {
    ".ans-left-title-pages": "Pages",
    ".ans-left-title-insert": "Insert",
    ".ans-left-title-layers": "Layers",
    ".ans-side:not(.ans-right) > h2:last-of-type": "Align",
    ".ans-right-title-props": "Properties",
    ".ans-right-title-notes": "Speaker notes",
    ".ans-right-title-zoom": "Canvas zoom",
    ".ans-right-title-history": "File history",
    "#ans-speaker-panel header strong": "Presenter view",
    "#ans-speaker-close": "Close",
    "#ans-speaker-panel aside h2:first-of-type": "Speaker notes",
    "#ans-speaker-panel aside h2:last-of-type": "Next slide",
    "#ans-speaker-prev": "Previous",
    "#ans-speaker-forward": "Next",
  };
  let language = "zh-CN";
  try {
    if (localStorage.getItem("ans-workbench-language") === "en")
      language = "en";
  } catch {}
  function t(key, values = {}) {
    let result = language === "en" ? key : zh[key] || extra[key] || key;
    for (const [name, value] of Object.entries(values))
      result = result.replaceAll(`{${name}}`, String(value));
    return result;
  }
  function translateStatic() {
    for (const [selector, key] of Object.entries({
      ...staticIds,
      ...staticSelectors,
    })) {
      const node = document.querySelector(selector);
      if (node) node.textContent = t(key);
    }
    for (const option of document.querySelectorAll(
      "#ans-theme option,#ans-insert option,#ans-export-mode option",
    )) {
      const key = option.dataset.i18n || option.textContent;
      option.dataset.i18n = key;
      option.textContent = t(key);
    }
    const token = document.querySelector("#ans-helper-token");
    if (token) {
      token.placeholder = t("Local helper token");
      token.title = t("Local helper token");
    }
    const select = document.querySelector("#ans-ui-language");
    if (select) {
      select.value = language;
      select.setAttribute("aria-label", t("Language"));
    }
    for (const [selector, key] of Object.entries({
      "#ans-theme": "Theme",
      "#ans-insert": "Insert",
      "#ans-export-mode": "Export format",
      "#ans-zoom": "Canvas zoom",
      "#ans-notes": "Speaker notes",
      "#ans-task-close": "Close",
    })) {
      const node = document.querySelector(selector);
      if (node) node.setAttribute("aria-label", t(key));
    }
    const auto = document.querySelector(".ans-toggle");
    if (auto) auto.lastChild.textContent = " " + t("Auto version");
    for (const button of document.querySelectorAll("[data-align]")) {
      const key = {
        left: "Align left",
        center: "Align center",
        right: "Align right",
        top: "Align top",
        middle: "Align middle",
        bottom: "Align bottom",
        "distribute-horizontal": "Distribute horizontal",
        "distribute-vertical": "Distribute vertical",
      }[button.dataset.align];
      button.title = t(key);
      button.setAttribute("aria-label", t(key));
    }
    document.documentElement.dataset.workbenchLanguage = language;
  }
  function setLanguage(next) {
    language = next === "en" ? "en" : "zh-CN";
    try {
      localStorage.setItem("ans-workbench-language", language);
    } catch {}
    translateStatic();
    document.dispatchEvent(new Event("ans-language-change"));
  }
  window.ANSI18N = {
    t,
    setLanguage,
    translateStatic,
    error: (code, fallback) => t(errors[code] || fallback || code),
    get language() {
      return language;
    },
  };
})();
