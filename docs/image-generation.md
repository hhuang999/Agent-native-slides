# Optional cover imagery / 可选封面配图

[English README](../README.md) · [中文 README](../README.zh-CN.md)

Image generation is optional. Planning, object editing, charts, HTML packaging, PDF, and PPTX export do not require a provider key. Use generated images for cover or section art; keep data charts and meaningful diagrams as editable objects. A local resource referenced by `resources[id].path` is embedded into the standalone HTML by `build-deck.js`.

生图只用于可选的封面或章节装饰。规划、对象编辑、图表、HTML 打包及 PDF/PPTX 导出均无需密钥。有意义的数据图表和关系图应保留可编辑对象；`build-deck.js` 会把 `resources[id].path` 对应的本地图片内联进 HTML。

Copy [`.env.example`](../.env.example) to `.env` in the repository root and set `IMAGE_API_KEY`; `.env` is Git ignored. AIHubMix remains the default provider and also accepts `AIHUBMIX_API_KEY`. Shell variables override `.env`.

```bash
node scripts/imagegen.js "soft aurora over dark sea, no text" examples/cover.jpg --size 2048x1152
```

For a service that implements the **synchronous OpenAI Images API** `POST /images/generations` shape, configure:

```dotenv
IMAGE_PROVIDER=openai-compatible
IMAGE_API_URL=https://your-service.example/v1/images/generations
IMAGE_API_KEY=replace-with-your-key
IMAGE_MODEL=your-image-model
```

The compatible adapter sends `{model,prompt,n:1,size}` plus `quality` only when requested. It accepts `data[0].b64_json` or `data[0].url`. Provider-specific Gemini, Flux, or other native APIs require their own adapter; changing only the URL does not translate schemas. AIHubMix supports its own model schema lookup, async polling and a `gpt-image-2` fallback unless `--no-fallback` is set.

Run `node --test scripts/test/imagegen.test.js` for mock-server coverage; it makes no billable image calls. See [SOURCES.md](../SOURCES.md) for provider and dependency references.
