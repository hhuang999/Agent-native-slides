# Charts — ECharts 学术配色方案

Agent-Native Slides — 图表层

默认图表引擎：ECharts 5.4.3（Apache-2.0）。  
所有配色从当前风格 CSS token 读取，不硬编码颜色。

---

## 通用初始化模式

```js
// 从 CSS token 读取风格色
function getToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function buildTheme() {
  return {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: getToken('--type-label'), color: getToken('--color-muted') },
    color: [
      getToken('--chart-c1'),  // primary accent
      getToken('--chart-c2'),  // secondary
      getToken('--chart-c3'),  // tertiary
      getToken('--chart-c4'),
      getToken('--chart-c5'),
    ]
  }
}

// 每套风格在其 design.md 中定义 --chart-c1..c5
// 学术/深色风格示例：
// --chart-c1: oklch(0.72 0.18 235)
// --chart-c2: oklch(0.75 0.12 185)
// --chart-c3: oklch(0.65 0.14 280)
// --chart-c4: oklch(0.70 0.10 145)
// --chart-c5: oklch(0.60 0.08 30)
```

---

## 全局 ECharts Option 基座

```js
const BASE_OPTION = {
  animation: true,
  animationDuration: 800,
  animationEasing: 'cubicOut',
  animationDelay: idx => idx * 60,

  grid: {
    top: 48, right: 32, bottom: 48, left: 56,
    containLabel: true
  },

  tooltip: {
    trigger: 'axis',
    backgroundColor: getToken('--color-raised-surface'),
    borderColor: getToken('--color-border'),
    borderWidth: 1,
    textStyle: {
      color: getToken('--color-body'),
      fontFamily: getToken('--type-label'),
      fontSize: 11
    }
  },

  legend: {
    top: 8,
    textStyle: { color: getToken('--color-muted'), fontSize: 11 },
    icon: 'circle',
    itemWidth: 8, itemHeight: 8
  }
}
```

---

## 1. 折线图（Line）— 常用于 Training Curve

```js
function makeLineChart(el, { xData, series }) {
  const chart = echarts.init(el, null, { renderer: 'canvas' })
  chart.setOption({
    ...BASE_OPTION,
    xAxis: {
      type: 'category', data: xData,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: getToken('--color-border') } },
      axisLabel: { color: getToken('--color-muted'), fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: getToken('--color-border'), type: 'dashed' } },
      axisLabel: { color: getToken('--color-muted'), fontSize: 10 }
    },
    series: series.map((s, i) => ({
      name: s.name, type: 'line', data: s.data,
      smooth: 0.4,
      lineStyle: { width: 2 },
      symbol: 'none',
      // 高亮最后一点
      markPoint: s.markLast ? {
        data: [{ type: 'max', label: { color: getToken('--color-heading') } }]
      } : undefined
    }))
  })
  return chart
}
```

**使用示例（论文 training loss）**：
```js
makeLineChart(document.getElementById('loss-chart'), {
  xData: ['1k', '5k', '10k', '50k', '100k'],
  series: [
    { name: 'Train Loss', data: [2.8, 1.9, 1.4, 0.9, 0.72], markLast: true },
    { name: 'Val Loss',   data: [3.1, 2.2, 1.7, 1.1, 0.85] }
  ]
})
```

---

## 2. 柱状图（Bar）— Benchmark 对比

```js
function makeBarChart(el, { categories, series, horizontal = false }) {
  const chart = echarts.init(el)
  chart.setOption({
    ...BASE_OPTION,
    xAxis: horizontal
      ? { type: 'value', splitLine: { lineStyle: { color: getToken('--color-border'), type: 'dashed' } } }
      : { type: 'category', data: categories, axisTick: { show: false },
          axisLine: { lineStyle: { color: getToken('--color-border') } },
          axisLabel: { color: getToken('--color-muted'), fontSize: 10 } },
    yAxis: horizontal
      ? { type: 'category', data: categories,
          axisLine: { show: false }, axisTick: { show: false },
          axisLabel: { color: getToken('--color-body'), fontSize: 11 } }
      : { type: 'value', splitLine: { lineStyle: { color: getToken('--color-border'), type: 'dashed' } },
          axisLabel: { color: getToken('--color-muted'), fontSize: 10 } },
    series: series.map((s, i) => ({
      name: s.name, type: 'bar', data: s.data,
      barMaxWidth: horizontal ? 20 : 40,
      barGap: '20%',
      itemStyle: { borderRadius: horizontal ? [0,3,3,0] : [3,3,0,0] },
      // 高亮"ours"列
      emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.3)' } }
    }))
  })
  return chart
}
```

**高亮"我们的方法"**：通过 `visualMap` 或给 data 加 `itemStyle`:
```js
data: scores.map((v, i) => ({
  value: v,
  itemStyle: isOurs[i] ? { color: getToken('--color-accent') } : {}
}))
```

---

## 3. 散点图（Scatter）— 能力对比 / Pareto 图

```js
function makeScatterChart(el, { points, quadrantLines }) {
  const chart = echarts.init(el)
  chart.setOption({
    ...BASE_OPTION,
    xAxis: {
      type: 'value', name: 'Parameters (B)', nameLocation: 'middle', nameGap: 32,
      splitLine: { lineStyle: { color: getToken('--color-border'), type: 'dashed' } },
      axisLabel: { color: getToken('--color-muted'), fontSize: 10 }
    },
    yAxis: {
      type: 'value', name: 'Accuracy (%)', nameLocation: 'middle', nameGap: 48,
      splitLine: { lineStyle: { color: getToken('--color-border'), type: 'dashed' } },
      axisLabel: { color: getToken('--color-muted'), fontSize: 10 }
    },
    series: [{
      type: 'scatter', data: points,
      symbolSize: val => Math.sqrt(val[2]) * 4,  // size = 第3维
      label: {
        show: true, position: 'right', formatter: p => p.data[3],  // 4th dim = name
        color: getToken('--color-body'), fontSize: 10
      },
      // 高亮"ours"
      itemStyle: { color: pt => pt.data[4] ? getToken('--color-accent') : getToken('--chart-c2') }
    }]
  })
  return chart
}
```

---

## 4. 雷达图（Radar）— 多维能力对比

```js
function makeRadarChart(el, { indicators, series }) {
  const chart = echarts.init(el)
  chart.setOption({
    ...BASE_OPTION,
    radar: {
      shape: 'polygon',
      indicator: indicators,
      splitLine: { lineStyle: { color: getToken('--color-border') } },
      splitArea: { areaStyle: { color: ['transparent', 'transparent'] } },
      axisName: { color: getToken('--color-muted'), fontSize: 10 }
    },
    series: [{
      type: 'radar',
      data: series.map((s, i) => ({
        name: s.name, value: s.data,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.08 }
      }))
    }]
  })
  return chart
}
```

---

## 5. 热力图（Heatmap）— Attention Weight 可视化

```js
function makeHeatmap(el, { xLabels, yLabels, data }) {
  const chart = echarts.init(el)
  chart.setOption({
    ...BASE_OPTION,
    grid: { top: 40, right: 80, bottom: 60, left: 80 },
    xAxis: {
      type: 'category', data: xLabels, splitArea: { show: true },
      axisLabel: { color: getToken('--color-muted'), fontSize: 9 }
    },
    yAxis: {
      type: 'category', data: yLabels, splitArea: { show: true },
      axisLabel: { color: getToken('--color-muted'), fontSize: 9 }
    },
    visualMap: {
      min: 0, max: 1,
      calculable: true,
      orient: 'vertical', right: 8, top: 40,
      inRange: {
        color: [
          getToken('--color-surface'),
          getToken('--color-accent')
        ]
      }
    },
    series: [{
      type: 'heatmap', data: data,
      label: { show: data.length <= 100, fontSize: 8 },
      emphasis: { itemStyle: { shadowBlur: 5 } }
    }]
  })
  return chart
}
```

---

## 6. 桑基图（Sankey）— 数据流向

```js
function makeSankeyChart(el, { nodes, links }) {
  const chart = echarts.init(el)
  chart.setOption({
    ...BASE_OPTION,
    series: [{
      type: 'sankey',
      data: nodes.map(n => ({ name: n, label: { color: getToken('--color-body') } })),
      links: links,
      lineStyle: { color: 'gradient', opacity: 0.3 },
      emphasis: { focus: 'adjacency' }
    }]
  })
  return chart
}
```

---

## 响应式 & 幻灯片集成

```js
// 切换到该幻灯片时初始化（避免 display:none 状态下尺寸为 0）
function initChartOnReveal(chartId, initFn) {
  const observer = new MutationObserver((_, obs) => {
    const el = document.getElementById(chartId)
    if (!el) return
    const slide = el.closest('[data-slide]')
    if (slide && slide.classList.contains('is-active')) {
      obs.disconnect()
      initFn(el)
    }
  })
  observer.observe(document.querySelector('.deck'), {
    attributes: true, subtree: true, attributeFilter: ['class']
  })
}

// 窗口缩放时 resize（注意：幻灯片用 CSS transform scale，不需要 resize）
// 只在 studio 编辑器模式下启用：
window.addEventListener('resize', () => {
  if (window.__inStudio) echarts.instances().forEach(c => c.resize())
})
```

---

## 配色对照（与风格 token 映射）

| 风格族 | --chart-c1 | --chart-c2 | --chart-c3 |
|--------|-----------|-----------|-----------|
| Dark Tech (A) | 亮蓝 oklch(0.72 0.18 235) | 青 0.75/0.12/185 | 紫 0.65/0.14/280 |
| Aurora (F) | 极光绿 0.70/0.22/165 | 极光蓝 0.68/0.18/225 | 洋红 0.65/0.20/320 |
| Academic (G) | 深蓝 0.45/0.16/235 | 砖红 0.50/0.18/25 | 灰绿 0.55/0.08/155 |
| AI/Deep (L) | 亮青 0.75/0.20/195 | 紫 0.65/0.22/275 | 品红 0.68/0.18/320 |
| Corporate (H) | 品牌蓝 0.50/0.20/240 | 深橙 0.55/0.18/50 | 灰 0.50/0.02/240 |

各风格的精确值在各自的 `design.md` 中定义。
