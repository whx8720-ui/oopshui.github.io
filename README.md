# Web, from zero

给产品经理的互动式 Web 技术演进指南。通过 7 个阶段的可交互演示，解释网页如何工作、技术为什么变化，以及 PM 在每个阶段应该追问什么。

## 本地运行

```bash
npm install
npm run dev
```

## 内容维护

- 阶段内容统一维护在 `src/data.ts`。
- 页面结构与互动演示维护在 `src/App.tsx`。
- 视觉样式维护在 `src/index.css`。
- 每个阶段都包含：出现原因、系统链路、代价、PM 问题和术语。

## 发布

项目为纯前端 Vite 应用，构建产物位于 `dist/`。目标站点为 [oopshui.github.io](https://oopshui.github.io/)。
