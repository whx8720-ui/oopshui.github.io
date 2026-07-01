# Web, from zero

给产品经理的可拆解网站实验室。通过演进时间线和知识地图理解网页、网络、后端、数据与基础设施，并通过关闭组件观察系统如何退化或失败。

## 本地运行

```bash
npm install
npm run dev
```

## 内容维护

- 阶段内容统一维护在 `src/data.ts`。
- 界面对应的示例代码与代码地图维护在 `src/codeExamples.ts`。
- 知识节点、依赖关系和阶段预设维护在 `src/knowledge.ts`。
- 实验状态与性能指标由 `src/simulator.ts` 统一计算。
- 页面结构与互动演示维护在 `src/App.tsx`。
- 视觉样式维护在 `src/index.css`。
- 每个知识点都包含：原理、出现原因、链路位置、依赖、代码映射和关闭效果。
- 网站不保存个人笔记；学习问题在 Codex 中回答后，再由用户确认是否沉淀到 Obsidian 或加入网站。

## 发布

项目为纯前端 Vite 应用，构建产物位于 `dist/`。目标站点为 [whx8720-ui.github.io/oopshui.github.io](https://whx8720-ui.github.io/oopshui.github.io/)。
