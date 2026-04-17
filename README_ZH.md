# NexusMind AI 模型代理

<div align="center">

一个统一的、生产级的 AI 模型代理服务，将多个主流 AI 模型提供商聚合到一个兼容 OpenAI 的统一 API 接口中。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Vue 3](https://img.shields.io/badge/Vue-3.4+-4FC08D.svg)](https://vuejs.org)

[English](./README.md) | [功能特性](#功能特性) | [快速开始](#快速开始) | [API 文档](#api-文档) | [架构](#架构)

</div>

---

## 目录

- [项目概述](#项目概述)
- [功能特性](#功能特性)
- [支持的模型](#支持的模型)
- [架构设计](#架构设计)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [API 文档](#api-文档)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [部署指南](#部署指南)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目概述

NexusMind 是一个精密的 AI 模型代理服务，旨在简化与多个 AI 模型提供商的集成。它提供统一的、兼容 OpenAI 的 API 接口，使开发者能够在不更改应用程序代码的情况下切换不同的 AI 模型。

**核心优势：**

- **统一接口**：所有支持的 AI 模型使用单一 API 端点
- **成本优化**：基于 Token 消耗的透明计费
- **灵活性**：热重载配置支持动态模型管理
- **企业级就绪**：完整的用户管理、身份验证和管理面板
- **增强能力**：RAG 知识库集成和内存系统

---

## 功能特性

### 核心能力

- **多模型支持**：接入 10+ AI 模型提供商，包括 OpenAI、Anthropic、Google、xAI、智谱 AI、通义千问、Mistral 和 Meta
- **OpenAI 兼容 API**：可直接替换 OpenAI 的 API 格式
- **动态模型智商**：实时调整模型智商等级
- **请求队列管理**：智能队列处理并发请求
- **热重载配置**：无需重启服务器即可更新模型设置

### 用户与计费系统

- **完整用户管理**：注册、登录、个人资料管理
- **JWT 身份验证**：安全的基于令牌的身份验证
- **基于 Token 的计费**：根据实际 Token 消耗精确计费
- **使用统计**：详细的分析和使用追踪
- **余额管理**：充值和余额监控

### 管理与监控

- **管理仪表板**：用于系统管理的综合管理面板
- **用户管理**：查看、管理和控制用户账户
- **模型配置**：集中化模型设置和定价
- **系统统计**：实时指标和分析
- **健康监控**：内置健康检查端点

### 高级功能

- **RAG 知识库**：检索增强生成以提升响应质量
- **内存碎片系统**：上下文感知的内存管理
- **缓存服务**：智能缓存以提升性能
- **国际化**：完整的中英文双语支持
- **现代 UI**：毛玻璃效果设计和响应式布局
- **API 文档**：交互式 API 文档

---

## 支持的模型

| 模型 | 提供商 | 输入价格 | 输出价格 | 智商等级 |
|------|--------|----------|----------|----------|
| GPT-5.4 | OpenAI | $2.50 | $15.00 | 98 |
| Claude 4.6 Opus | Anthropic | $15.00 | $75.00 | 99 |
| Claude 4.6 Sonnet | Anthropic | $3.00 | $15.00 | 95 |
| Gemini 3.1 Ultra | Google | $2.00 | $12.00 | 99 |
| Gemini 3.1 Pro | Google | $2.00 | $12.00 | 96 |
| Grok 4 | xAI | $2.00 | $15.00 | 96 |
| GLM-5.1 | 智谱 AI | $0.50 | $2.00 | 94 |
| Qwen 3.5 | 阿里通义千问 | $0.80 | $2.00 | 92 |
| Mistral Small 4 | Mistral AI | $0.20 | $0.60 | 88 |
| Llama 4 | Meta | $0.30 | $0.90 | 90 |

*价格为每百万 Token*

---

## 架构设计

NexusMind 遵循清晰的模块化架构，具有明确的关注点分离：

```
┌─────────────────────────────────────────────────────────────┐
│                     前端 (Vue 3)                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 仪表板   │ │  聊天    │ │  管理    │ │  配置    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   后端 (Express.js)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  路由    │ │ 控制器   │ │  服务    │ │ 中间件   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              核心服务                                 │   │
│  │  • 计费服务  • 请求队列  • 缓存服务                    │   │
│  │  • 知识库    • 内存系统  • 格式转换                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据层                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │  SQLite  │ │ 知识库   │ │  配置    │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              外部 AI 提供商                                 │
│  OpenAI │ Anthropic │ Google │ xAI │ 智谱 │ 通义 │ ...      │
└─────────────────────────────────────────────────────────────┘
```

---

## 技术栈

### 后端

- **运行时**：Node.js 18+
- **框架**：Express.js
- **数据库**：SQLite (sql.js)
- **身份验证**：JWT (jsonwebtoken)
- **安全**：bcryptjs, cors, express-rate-limit
- **HTTP 客户端**：axios
- **日志**：winston
- **工具**：dotenv, uuid

### 前端

- **框架**：Vue 3.4+
- **构建工具**：Vite 5.0+
- **状态管理**：Pinia 2.1+
- **路由**：Vue Router 4.2+
- **UI 组件**：Element Plus 2.5+
- **样式**：Tailwind CSS 3.4+
- **图表**：ECharts 5.6+
- **国际化**：vue-i18n 9.9+
- **HTTP 客户端**：axios

---

## 快速开始

### 前置要求

- Node.js 18 或更高版本
- npm 或 yarn
- Git

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/yourusername/NexusMind.git
cd NexusMind
```

2. **安装后端依赖**

```bash
cd backend
npm install
```

3. **安装前端依赖**

```bash
cd ../frontend
npm install
```

4. **配置环境变量**

在 `backend` 目录下创建 `.env` 文件：

```env
PORT=3000
JWT_SECRET=your-secure-jwt-secret-key-here
```

5. **启动后端服务器**

```bash
cd backend
npm start
```

后端将运行在 `http://localhost:3000`

6. **启动前端开发服务器**

```bash
cd frontend
npm run dev
```

前端将运行在 `http://localhost:5173`

7. **访问应用**

在浏览器中打开 `http://localhost:5173`

---

## 配置说明

### 环境变量

| 变量 | 描述 | 默认值 | 必需 |
|------|------|--------|------|
| `PORT` | 后端服务器端口 | `3000` | 否 |
| `JWT_SECRET` | JWT 令牌生成的密钥 | - | 是 |

### 模型配置

模型配置存储在 `backend/src/config/models.js` 中。该文件支持热重载，意味着您可以在不重启服务器的情况下更新模型设置。

**添加新模型：**

```javascript
{
  name: 'your-model-name',
  display_name: 'Your Model Display Name',
  provider: 'Provider Name',
  input_price: 1.0,      // 每百万输入 Token 的价格
  output_price: 2.0,     // 每百万输出 Token 的价格
  api_format: 'openai',  // API 格式：openai, anthropic, google
  intelligence_level: 90,
  quality_level: 'high',
  logo_url: '/logos/your-logo.svg',
  benchmarks: {
    swe_bench: 50.0,
    arc_agi: 80.0,
    gpqa: 85.0,
    mmlu: 90.0
  }
}
```

### 知识库配置

知识库条目存储在 `knowledge_base/` 目录下的 JSON 文件中。每个文件包含：

```json
{
  "name": "知识库名称",
  "version": "1.0",
  "entries": [
    {
      "id": "entry-id",
      "content": "您的知识内容",
      "tags": ["标签1", "标签2"],
      "metadata": {
        "source": "来源名称",
        "category": "类别名称"
      }
    }
  ]
}
```

---

## API 文档

### 基础 URL

```
http://localhost:3000
```

### 身份验证

所有 API 端点（注册和登录除外）都需要在 `Authorization` 头中提供 JWT 令牌：

```
Authorization: Bearer <your-jwt-token>
```

### 端点

#### 身份验证

##### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "your-username",
  "email": "your-email@example.com",
  "password": "your-secure-password"
}
```

##### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "your-username",
  "password": "your-secure-password"
}
```

##### 获取用户资料
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

##### 获取用户统计
```http
GET /api/auth/stats
Authorization: Bearer <token>
```

#### 模型

##### 列出可用模型
```http
GET /api/models
Authorization: Bearer <token>
```

##### 聊天完成（OpenAI 兼容）
```http
POST /api/v1/chat/completions
Authorization: Bearer <token>
Content-Type: application/json

{
  "model": "gpt-5.4",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

#### 管理

##### 列出用户
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

##### 获取系统统计
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

##### 更新模型智商
```http
POST /api/admin/model-intelligence
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "model_name": "gpt-5.4",
  "intelligence_level": 95
}
```

#### 健康检查

##### 服务器健康状态
```http
GET /health
```

返回服务器状态、运行时间、内存使用情况和队列统计信息。

---

## 项目结构

```
NexusMind/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── app.js             # 应用入口
│   │   ├── config/            # 配置文件
│   │   │   ├── database.js    # 数据库初始化
│   │   │   └── models.js      # 模型定义
│   │   ├── controllers/       # 请求处理器
│   │   │   ├── authController.js
│   │   │   ├── modelController.js
│   │   │   └── adminController.js
│   │   ├── middleware/        # Express 中间件
│   │   │   ├── authMiddleware.js
│   │   │   └── rateLimitMiddleware.js
│   │   ├── routes/           # API 路由
│   │   │   ├── authRoutes.js
│   │   │   ├── apiRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── services/         # 业务逻辑
│   │   │   ├── billingService.js
│   │   │   ├── cacheService.js
│   │   │   ├── formatConverter.js
│   │   │   ├── glmService.js
│   │   │   ├── hotReloadService.js
│   │   │   ├── knowledgeBaseService.js
│   │   │   ├── memoryFragmentSystem.js
│   │   │   ├── memoryManager.js
│   │   │   ├── requestQueue.js
│   │   │   └── toolService.js
│   │   └── utils/            # 工具函数
│   │       ├── logger.js
│   │       └── systemPrompts.js
│   ├── data/                 # SQLite 数据库文件
│   │   └── nexusmind.db
│   ├── logs/                 # 应用日志
│   │   ├── combined.log
│   │   └── error.log
│   ├── cli/                  # CLI 工具
│   │   └── nexus-cli.js
│   ├── package.json
│   └── .env                  # 环境变量
├── frontend/                  # 前端应用
│   ├── src/
│   │   ├── App.vue           # 根组件
│   │   ├── main.js           # 应用入口
│   │   ├── components/       # 可复用组件
│   │   │   └── NavBar.vue
│   │   ├── views/            # 页面组件
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Home.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── Config.vue
│   │   │   ├── Chat.vue
│   │   │   ├── ApiDocs.vue
│   │   │   ├── ModelDetail.vue
│   │   │   └── Admin.vue
│   │   ├── stores/           # Pinia 状态管理
│   │   ├── router/           # Vue Router 配置
│   │   ├── locales/          # i18n 翻译
│   │   │   ├── en-US.js
│   │   │   └── zh-CN.js
│   │   └── style.css         # 全局样式
│   ├── public/
│   │   └── logos/            # 模型提供商 Logo
│   │       ├── openai.svg
│   │       ├── anthropic.svg
│   │       ├── google.svg
│   │       └── ...
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── knowledge_base/            # RAG 知识库
│   └── RAG-1.json
├── AGENTS.md                  # 系统提示词配置
├── README.md                  # 英文文档
├── README_ZH.md              # 本文件
├── LICENSE                    # MIT 许可证
└── .gitignore
```

---

## 开发指南

### 后端开发

在开发模式下运行后端，支持热重载：

```bash
cd backend
npm run dev
```

### 前端开发

在开发模式下运行前端：

```bash
cd frontend
npm run dev
```

### 生产构建

构建前端用于生产环境：

```bash
cd frontend
npm run build
```

预览生产构建：

```bash
cd frontend
npm run preview
```

### CLI 工具

NexusMind 包含用于管理任务的 CLI 工具：

```bash
cd backend
npm run cli
```

---

## 部署指南

### 生产部署

1. **环境设置**

配置生产环境变量：

```env
PORT=3000
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

2. **构建前端**

```bash
cd frontend
npm run build
```

3. **启动后端**

```bash
cd backend
npm start
```

4. **进程管理（推荐）**

使用 PM2 进行生产进程管理：

```bash
npm install -g pm2
pm2 start backend/src/app.js --name nexusmind
pm2 save
pm2 startup
```

5. **反向代理（可选）**

配置 Nginx 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker 部署（即将推出）

Docker 支持计划在未来版本中提供。

---

## 贡献指南

我们欢迎社区的贡献！以下是如何提供帮助的方式：

### 报告问题

如果您发现错误或有功能请求，请在 GitHub 上打开 issue。

### 拉取请求

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

### 开发指南

- 遵循现有代码风格
- 编写清晰的提交信息
- 为新功能添加测试
- 根据需要更新文档

---

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

---

## 致谢

- 使用 [Vue.js](https://vuejs.org) 构建
- 由 [Express.js](https://expressjs.com) 驱动
- UI 组件来自 [Element Plus](https://element-plus.org)
- 图标来自 [Element Plus Icons](https://element-plus.org/zh-CN/component/icon.html)

---

## 支持

- 文档：[README.md](README.md) | [README_ZH.md](README_ZH.md)
- 问题：[GitHub Issues](https://github.com/yourusername/NexusMind/issues)
- 讨论：[GitHub Discussions](https://github.com/yourusername/NexusMind/discussions)

---

<div align="center">

由 NexusMind 团队用 ❤️ 制作

[⬆ 返回顶部](#nexusmind-ai-模型代理)

</div>
