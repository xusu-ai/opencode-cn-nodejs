<p align="center">
  <a href="https://github.com/xusu-ai/opencode-cn-nodejs">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode-CN-NodeJS logo">
    </picture>
  </a>
</p>
<p align="center">Open-Source AI Coding Agent · Pure Node.js Edition · Old-Hardware Friendly</p>
<p align="center">
  <a href="https://github.com/xusu-ai/opencode-cn-nodejs/releases"><img alt="Release" src="https://img.shields.io/badge/release-v1.14.21--CN--NodeJS-blue?style=flat-square" /></a>
  <img alt="Runtime" src="https://img.shields.io/badge/runtime-Node.js%20%7C%20tsx-brightgreen?style=flat-square" />
  <img alt="Compatibility" src="https://img.shields.io/badge/compat-Node.js%2018%2B-success?style=flat-square" />
  <img alt="i18n" src="https://img.shields.io/badge/i18n-100%25%20Chinese-brightgreen?style=flat-square" />
  <img alt="IME" src="https://img.shields.io/badge/IME-Chinese%20Input%20Supported-brightgreen?style=flat-square" />
</p>

<p align="center">
  <a href="README.en.md">English</a> | <a href="README.zh.md">简体中文</a>
</p>

---

## 🎯 Project Overview

**OpenCode-CN-NodeJS** is a deeply customized China-region fork of [OpenCode](https://github.com/opencode-ai/opencode), with these key differentiators:

| Feature | Description |
|---------|-------------|
| 🟢 **Pure Node.js Runtime** | No Bun required — just `npm install` + `npx tsx` to start |
| 💻 **Old Hardware Compatible** | Low memory footprint, no AVX/AVX2 instruction set requirement, runs on vintage CPUs |
| 🇨🇳 **Fully Chinese Localized** | 100% Chinese UI, AI conversations, error messages, and status info |
| ⌨️ **Chinese CLI** | All terminal output, interactive prompts, and help docs in Simplified Chinese |
| 🔌 **Plug & Play** | No special system dependencies — consistent on Linux/Windows/macOS |

---

## 🚀 Quick Start

### Requirements

- **Node.js** 18.0.0 or higher (22.x LTS recommended)
- **npm** 9+ or **pnpm** 8+
- No Bun! No Docker! No special CPU instructions!

### Installation

```bash
git clone https://github.com/xusu-ai/opencode-cn-nodejs.git
cd opencode-cn-nodejs
npm install
npx tsx --conditions=node --tsconfig tsconfig.json packages/opencode/src/index.ts serve --port 3000
```

### Systemd Service (Production)

```ini
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

[Install]
WantedBy=multi-user.target
```

---

## 🏗️ Architecture

Dual-runtime dispatch via `package.json` `imports`:

```
#hono  →  adapter.node.ts  (Node.js — default)  ✅
#db    →  db.node.ts        (Node.js — default)  ✅
#pty   →  pty.node.ts       (Node.js — default)  ✅
```

`tsconfig.json` sets `"customConditions": ["node"]` to always prefer Node.js adapters.

### Differences from Upstream

| Aspect | Upstream | OpenCode-CN-NodeJS |
|--------|----------|-------------------|
| Runtime | Bun (required) | **Node.js + tsx** |
| Language | English | **100% Chinese** |
| Server | Bun.serve | **Node HTTP** |
| Install | curl script | **git clone + npm** |

---

## 🔧 Old Hardware Compatibility

Works on any machine with Node.js 18+:
- Intel Core 2 Duo / pre-4th-gen ✅
- AMD Phenom / Bulldozer ✅
- 1C1G cloud VPS / Raspberry Pi ✅
- OpenVZ / LXC containers ✅

No AVX/AVX2 required — no native addon dependency chains.

---

## 📜 License

Same as upstream OpenCode. See [LICENSE](LICENSE).

---

<p align="center">
  <a href="https://github.com/xusu-ai/opencode-cn-nodejs">GitHub Repository</a>
</p>
