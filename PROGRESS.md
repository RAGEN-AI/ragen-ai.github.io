# PROGRESS.md

## Current Focus
- 说明主站在本地如何预览 `/.` 与 `/v2/` 两个路径。
- 保持 `public/v2/` 静态产物与 `RV-Filter-Website` 源页面同步，并准备后续线上部署。

## Status
- Date: 2026-03-12
- Phase: Verification / Handoff
- Overall: In Progress

## Completed This Round
1. 读取当前工作区与目标 repo 的 `AGENTS.md`、README、Astro 配置和首页结构。
2. 确认两套站点均为 Astro 项目，并识别出直接合并 `public/` 会产生同名资源冲突。
3. 确定采用“将第一套站点构建为 `/v2/` 静态产物，再同步到主站 `public/v2/`”的最小实现方案。
4. 创建本轮任务的 `plans.md` 与 `PROGRESS.md`，记录当前目标与执行步骤。
5. 在 `RV-Filter-Website` 中加入 `SITE_URL` / `SITE_BASE` 构建支持，并将页面资源路径改为兼容子路径部署。
6. 修正 `RV-Filter-Website` 首页顶部两个占位按钮，避免部署后出现死链接。
7. 生成 `SITE_BASE=/v2/` 的静态产物，并同步到 `ragen-ai.github.io/public/v2/`。
8. 在主站首页 hero 顶部新增 `News: We released RAGEN-2` 入口，点击跳转 `/v2/`。
9. 更新两个 repo 的 README，记录 v2 子路径构建与同步方式。
10. 完成主站构建验证：`npm run build` 成功，且产物中同时存在 `dist/index.html` 的 news 入口和 `dist/v2/index.html` 子站页面。
11. 确认主站当前本地未安装 `node_modules`，本地预览前需要先执行 `npm install`。

## Pending
1. 将改动提交并推送到实际承载 `https://ragen-ai.github.io/` 的分支/仓库。
2. 如果 `RV-Filter-Website` 页面后续继续更新，重新执行 README 中的同步步骤刷新 `public/v2/`。
3. 在用户本地机器上启动主站开发服务器，人工检查首页和 `/v2/` 页面观感。

## Next Actions
1. 在 `ragen-ai.github.io` 目录执行 `npm install && npm run dev`，本地打开首页和 `/v2/`。
2. 本地确认无误后，将 `ragen-ai.github.io` 与 `RV-Filter-Website` 的变更提交到版本库。
3. 触发 GitHub Pages 部署，确认线上 `https://ragen-ai.github.io/` 与 `https://ragen-ai.github.io/v2/` 均可访问。

## Risks / Notes
- 两个站点存在同名 `public` 资源，不能直接整目录复制到主站根路径。
- 主站当前未长期安装 `node_modules`；本轮验证是临时复用邻近 repo 的依赖完成的。
- `public/v2/` 是同步后的静态产物，不会自动跟随 `RV-Filter-Website` 源码更新。
