<p align="center">
  <a href="https://gitee.com/xusuai/opencode-cn-nodejs">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode-CN-NodeJS logo">
    </picture>
  </a>
</p>
<p align="center">开源的 AI Coding Agent · 纯 Node.js 版 · 老机器福音</p>
<p align="center">
  <a href="https://gitee.com/xusuai/opencode-cn-nodejs/releases"><img alt="Release" src="https://img.shields.io/badge/release-v1.14.21--CN--NodeJS-blue?style=flat-square" /></a>
  <img alt="Runtime" src="https://img.shields.io/badge/runtime-Node.js%20%7C%20tsx-brightgreen?style=flat-square" />
  <img alt="Compatibility" src="https://img.shields.io/badge/compat-Node.js%2018%2B-success?style=flat-square" />
  <img alt="i18n" src="https://img.shields.io/badge/i18n-100%25%20%E4%B8%AD%E6%96%87-brightgreen?style=flat-square" />
  <img alt="IME" src="https://img.shields.io/badge/IME-%E4%B8%AD%E6%96%87%E8%BE%93%E5%85%A5%E6%94%AF%E6%8C%81-brightgreen?style=flat-square" />
</p>

<p align="center">
  <a href="README.md">简体中文</a>
</p>

---

## 🎯 项目定位

**OpenCode-CN-NodeJS** 是 [OpenCode](https://github.com/opencode-ai/opencode) 的中国区深度定制分支，核心亮点：

| 特性 | 说明 |
|------|------|
| 🟢 **纯 Node.js 运行** | 无需 Bun 运行时，`npm install` + `npx tsx` 即可启动 |
| 💻 **老机器兼容** | 低内存占用，无 AVX/AVX2 指令集要求，古董 CPU 也能跑 |
| 🇨🇳 **完全汉化** | 界面 100% 中文，AI 对话/错误提示/状态信息全部中文 |
| ⌨️ **命令行全中文** | 终端输出、交互提示、帮助文档均使用简体中文 |
| 🔌 **即装即用** | 无特殊系统依赖，Linux/Windows/macOS 一致体验 |

---

## 🚀 快速开始

### 环境要求

- **Node.js** 18.0.0 或更高版本（推荐 22.x LTS）
- **npm** 9+ 或 **pnpm** 8+
- 无需 Bun！无需 Docker！无需特殊 CPU 指令集！

### 安装

```bash
# 克隆仓库
git clone https://gitee.com/xusuai/opencode-cn-nodejs.git
cd opencode-cn-nodejs

# 安装依赖（纯 Node.js 方式）
npm install

# 启动服务（开发模式）
npx tsx --conditions=node --tsconfig tsconfig.json packages/opencode/src/index.ts serve --port 3000

# 或启动交互式终端
npx tsx --conditions=node --tsconfig tsconfig.json packages/opencode/src/index.ts
```

### 系统服务（Production）

```bash
# 使用 systemd 管理（Linux）
cat > /etc/systemd/system/opencode.service << 'EOF'
[Unit]
Description=OpenCode-CN-NodeJS Server
After=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/opencode-cn-nodejs/packages/opencode
ExecStart=/path/to/opencode-cn-nodejs/node_modules/.bin/tsx --conditions=node --tsconfig tsconfig.json ./src/index.ts serve --port 8099 --hostname 0.0.0.0
Restart=always
RestartSec=3
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now opencode
```

---

## 🏗️ 架构说明

本项目基于 **Node.js + tsx** 运行时，使用 `package.json` 的 `imports` 字段实现双运行时分发：

```
#hono  →  adapter.bun.ts  (Bun 专用，本分支未使用)
       →  adapter.node.ts  (Node.js 用，默认启用)  ✅
#db    →  db.bun.ts        (Bun 专用，本分支未使用)
       →  db.node.ts        (Node.js 用，默认启用)  ✅
#pty   →  pty.bun.ts       (Bun 专用，本分支未使用)
       →  pty.node.ts       (Node.js 用，默认启用)  ✅
```

tsconfig.json 已配置 `"customConditions": ["node"]`，确保 tsx/TypeScript 编译时自动选择 Node.js 适配器，完全绕过 Bun 相关代码路径。

### 与上游 OpenCode 的区别

| 对比项 | 上游 OpenCode | OpenCode-CN-NodeJS |
|--------|--------------|-------------------|
| 运行时 | Bun（必须） | Node.js + tsx（可选 Bun） |
| 语言 | 英文为主 | **100% 简体中文** |
| 适配器 | Bun.serve / Bun.sqlite | **Node HTTP / better-sqlite3** |
| CPU 要求 | 无限制 | **无 AVX 要求** |
| 内存 | 较高（Bun 驻留） | **更低（Node 按需分配）** |
| 安装方式 | curl 脚本 | **git clone + npm install** |

---

## 🖥️ 命令行界面（CLI）

完全中文化的命令行体验：

```bash
# 查看帮助（中文）
npx tsx packages/opencode/src/index.ts --help

# 启动 Web 服务
npx tsx packages/opencode/src/index.ts serve --port 8099

# 运行 AI Agent（中文对话）
npx tsx packages/opencode/src/index.ts run "帮我重构这个函数"

# 管理 Provider
npx tsx packages/opencode/src/index.ts providers
```

所有终端输出、交互提示、错误信息均为简体中文。

---

## 🔧 老机器兼容性

本项目已移除所有对现代 CPU 指令集（AVX-512、AVX2、AVX）的隐式依赖，可在以下老旧硬件上正常运行：

- Intel Core 2 Duo / 4 代以前系列 ✅
- AMD Phenom / Bulldozer 系列 ✅
- 低配云服务器（1核 1G） ✅
- 树莓派 3B+/4B ✅
- 虚拟主机 / OpenVZ / LXC 容器 ✅

---

## 📜 许可证

本项目基于上游 OpenCode 的许可证发布。详情请参阅 [LICENSE](LICENSE) 文件。

---

<p align="center">
  <a href="https://gitee.com/xusuai/opencode-cn-nodejs">Gitee 仓库</a>
</p>
