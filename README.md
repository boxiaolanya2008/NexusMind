# NexusMind AI Model Proxy

一个统一的 AI 模型代理服务，支持多个主流 AI 模型提供商，提供统一的 API 接口。

## 功能特性

- **多模型支持**：支持 OpenAI、Anthropic、Google、MiniMax、Mistral、Qwen、XAI、智谱等多个 AI 模型提供商
- **统一 API**：提供统一的 OpenAI 兼容 API 接口
- **用户管理**：完整的用户注册、登录、权限管理系统
- **计费系统**：基于 Token 消耗的精确计费
- **管理后台**：用户管理、模型管理、统计查看
- **模型智商调节**：支持动态调整模型智商等级
- **知识库集成**：支持 RAG 知识库检索增强
- **国际化**：支持中英文双语界面
- **响应式设计**：现代化的毛玻璃效果 UI 设计

## 技术栈

### 后端
- Node.js + Express
- SQLite 数据库
- JWT 身份验证
- 请求队列管理
- 热重载配置

### 前端
- Vue 3 + Vite
- Pinia 状态管理
- Vue Router 路由
- Tailwind CSS 样式
- Element Plus UI 组件
- ECharts 图表

## 快速开始

### 后端启动

```bash
cd backend
npm install
npm start
```

后端服务将运行在 `http://localhost:3000`

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端服务将运行在 `http://localhost:5173`

## API 文档

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `GET /api/auth/stats` - 获取用户统计数据

### 模型接口

- `GET /api/models` - 获取可用模型列表
- `POST /api/v1/chat/completions` - 聊天完成接口（OpenAI 兼容）

### 管理接口

- `GET /api/admin/users` - 获取用户列表
- `GET /api/admin/stats` - 获取系统统计数据
- `POST /api/admin/model-intelligence` - 更新模型智商

## 配置说明

### 环境变量

在 `backend` 目录下创建 `.env` 文件：

```env
PORT=3000
JWT_SECRET=your-secret-key
```

### 模型配置

模型配置位于 `backend/src/config/models.js`，支持热重载。

## 项目结构

```
NexusMind/
├── backend/          # 后端服务
│   ├── src/
│   │   ├── config/   # 配置文件
│   │   ├── controllers/ # 控制器
│   │   ├── middleware/ # 中间件
│   │   ├── routes/   # 路由
│   │   ├── services/ # 服务
│   │   └── utils/    # 工具函数
│   └── data/         # 数据库文件
├── frontend/         # 前端应用
│   ├── src/
│   │   ├── components/ # 组件
│   │   ├── locales/  # 国际化文件
│   │   ├── stores/   # 状态管理
│   │   ├── views/    # 页面
│   │   └── router/   # 路由配置
│   └── public/       # 静态资源
└── knowledge_base/   # 知识库文件
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
