# GitHub Pages V2 Integration Plan

## Goal
将 `RV-Filter-Website` 以静态子路径形式部署到 `https://ragen-ai.github.io/v2/`，并在主站首页顶部增加一个可见的 `We release v2` 新闻入口。

## Scope
1. `public/v2/` 静态子站点内容
2. 首页入口相关组件与样式
3. `README.md` 与 `PROGRESS.md` 回填
4. 构建验证

## Steps
1. 让 `RV-Filter-Website` 支持按 `/v2/` 基路径构建。
2. 将 `RV-Filter-Website` 的构建产物同步到 `ragen-ai.github.io/public/v2/`。
3. 在主站首页高位增加 `We release v2` 的跳转入口。
4. 更新文档并验证主站构建结果。
