# Web, from zero

给产品经理的互动式 Web 技术演进指南。通过 7 个阶段的可交互演示，解释网页如何工作、技术为什么变化，以及 PM 在每个阶段应该追问什么。

## 本地运行

```bash
npm install
npm run dev
```

## 内容维护

- 阶段内容统一维护在 `src/data.ts`。
- 界面对应的示例代码与代码地图维护在 `src/codeExamples.ts`。
- 页面结构与互动演示维护在 `src/App.tsx`。
- 视觉样式维护在 `src/index.css`。
- 每个阶段都包含：交互界面、对应代码、代码地图、系统链路、演进代价和术语。

## 发布

项目为纯前端 Vite 应用，构建产物位于 `dist/`。目标站点为 [whx8720-ui.github.io/oopshui.github.io](https://whx8720-ui.github.io/oopshui.github.io/)。
