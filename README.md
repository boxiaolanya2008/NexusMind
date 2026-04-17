# NexusMind AI Model Proxy

<div align="center">

A unified, production-grade AI model proxy service that aggregates multiple mainstream AI model providers into a single OpenAI-compatible API interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Vue 3](https://img.shields.io/badge/Vue-3.4+-4FC08D.svg)](https://vuejs.org)

[中文文档](./README_ZH.md) | [Features](#features) | [Quick Start](#quick-start) | [API Docs](#api-documentation) | [Architecture](#architecture)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Supported Models](#supported-models)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

NexusMind is a sophisticated AI model proxy service designed to simplify integration with multiple AI model providers. It provides a unified, OpenAI-compatible API interface that allows developers to switch between different AI models without changing their application code.

**Key Benefits:**

- **Unified Interface**: Single API endpoint for all supported AI models
- **Cost Optimization**: Transparent pricing with token-based billing
- **Flexibility**: Hot-reload configuration for dynamic model management
- **Enterprise Ready**: Complete user management, authentication, and admin panel
- **Enhanced Capabilities**: RAG knowledge base integration and memory systems

---

## Features

### Core Capabilities

- **Multi-Model Support**: Access to 10+ AI model providers including OpenAI, Anthropic, Google, xAI, Zhipu AI, Qwen, Mistral, and Meta
- **OpenAI-Compatible API**: Drop-in replacement for OpenAI's API format
- **Dynamic Model Intelligence**: Adjust model intelligence levels on-the-fly
- **Request Queue Management**: Intelligent queue handling for concurrent requests
- **Hot Reload Configuration**: Update model settings without server restart

### User & Billing System

- **Complete User Management**: Registration, login, profile management
- **JWT Authentication**: Secure token-based authentication
- **Token-Based Billing**: Precise billing based on actual token consumption
- **Usage Statistics**: Detailed analytics and usage tracking
- **Balance Management**: Recharge and balance monitoring

### Admin & Monitoring

- **Admin Dashboard**: Comprehensive admin panel for system management
- **User Management**: View, manage, and control user accounts
- **Model Configuration**: Centralized model settings and pricing
- **System Statistics**: Real-time metrics and analytics
- **Health Monitoring**: Built-in health check endpoints

### Advanced Features

- **RAG Knowledge Base**: Retrieval-Augmented Generation for enhanced responses
- **Memory Fragment System**: Context-aware memory management
- **Cache Service**: Intelligent caching for improved performance
- **Internationalization**: Full bilingual support (English/Chinese)
- **Modern UI**: Frosted glass effect design with responsive layout
- **API Documentation**: Interactive API documentation

---

## Supported Models

| Model | Provider | Input Price | Output Price | Intelligence |
|-------|----------|-------------|--------------|--------------|
| GPT-5.4 | OpenAI | $2.50 | $15.00 | 98 |
| Claude 4.6 Opus | Anthropic | $15.00 | $75.00 | 99 |
| Claude 4.6 Sonnet | Anthropic | $3.00 | $15.00 | 95 |
| Gemini 3.1 Ultra | Google | $2.00 | $12.00 | 99 |
| Gemini 3.1 Pro | Google | $2.00 | $12.00 | 96 |
| Grok 4 | xAI | $2.00 | $15.00 | 96 |
| GLM-5.1 | Zhipu AI | $0.50 | $2.00 | 94 |
| Qwen 3.5 | Alibaba Qwen | $0.80 | $2.00 | 92 |
| Mistral Small 4 | Mistral AI | $0.20 | $0.60 | 88 |
| Llama 4 | Meta | $0.30 | $0.90 | 90 |

*Prices are per million tokens*

---

## Architecture

NexusMind follows a clean, modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Vue 3)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Dashboard│ │  Chat    │ │  Admin   │ │  Config  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Routes  │ │Controllers│ │Services  │ │Middleware│      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Core Services                           │   │
│  │  • Billing Service  • Request Queue  • Cache Service  │   │
│  │  • Knowledge Base  • Memory System  • Format Conv.  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │  SQLite  │ │ Knowledge│ │  Config  │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              External AI Providers                          │
│  OpenAI │ Anthropic │ Google │ xAI │ Zhipu │ Qwen │ ...     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (sql.js)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, cors, express-rate-limit
- **HTTP Client**: axios
- **Logging**: winston
- **Utilities**: dotenv, uuid

### Frontend

- **Framework**: Vue 3.4+
- **Build Tool**: Vite 5.0+
- **State Management**: Pinia 2.1+
- **Routing**: Vue Router 4.2+
- **UI Components**: Element Plus 2.5+
- **Styling**: Tailwind CSS 3.4+
- **Charts**: ECharts 5.6+
- **Internationalization**: vue-i18n 9.9+
- **HTTP Client**: axios

---

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/NexusMind.git
cd NexusMind
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

4. **Configure Environment**

Create a `.env` file in the `backend` directory:

```env
PORT=3000
JWT_SECRET=your-secure-jwt-secret-key-here
```

5. **Start the Backend Server**

```bash
cd backend
npm start
```

The backend will run on `http://localhost:3000`

6. **Start the Frontend Development Server**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

7. **Access the Application**

Open your browser and navigate to `http://localhost:5173`

---

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | `3000` | No |
| `JWT_SECRET` | Secret key for JWT token generation | - | Yes |

### Model Configuration

Model configurations are stored in `backend/src/config/models.js`. This file supports hot reload, meaning you can update model settings without restarting the server.

**Adding a New Model:**

```javascript
{
  name: 'your-model-name',
  display_name: 'Your Model Display Name',
  provider: 'Provider Name',
  input_price: 1.0,      // Price per million input tokens
  output_price: 2.0,     // Price per million output tokens
  api_format: 'openai',  // API format: openai, anthropic, google
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

### Knowledge Base Configuration

Knowledge base entries are stored in `knowledge_base/` directory as JSON files. Each file contains:

```json
{
  "name": "Knowledge Base Name",
  "version": "1.0",
  "entries": [
    {
      "id": "entry-id",
      "content": "Your knowledge content here",
      "tags": ["tag1", "tag2"],
      "metadata": {
        "source": "source-name",
        "category": "category-name"
      }
    }
  ]
}
```

---

## API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

All API endpoints (except registration and login) require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication

##### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "your-username",
  "email": "your-email@example.com",
  "password": "your-secure-password"
}
```

##### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "your-username",
  "password": "your-secure-password"
}
```

##### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

##### Get User Statistics
```http
GET /api/auth/stats
Authorization: Bearer <token>
```

#### Models

##### List Available Models
```http
GET /api/models
Authorization: Bearer <token>
```

##### Chat Completion (OpenAI Compatible)
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

#### Admin

##### List Users
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

##### Get System Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

##### Update Model Intelligence
```http
POST /api/admin/model-intelligence
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "model_name": "gpt-5.4",
  "intelligence_level": 95
}
```

#### Health Check

##### Server Health
```http
GET /health
```

Returns server status, uptime, memory usage, and queue statistics.

---

## Project Structure

```
NexusMind/
├── backend/                    # Backend Service
│   ├── src/
│   │   ├── app.js             # Application entry point
│   │   ├── config/            # Configuration files
│   │   │   ├── database.js    # Database initialization
│   │   │   └── models.js      # Model definitions
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── modelController.js
│   │   │   └── adminController.js
│   │   ├── middleware/        # Express middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── rateLimitMiddleware.js
│   │   ├── routes/           # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── apiRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── services/         # Business logic
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
│   │   └── utils/            # Utility functions
│   │       ├── logger.js
│   │       └── systemPrompts.js
│   ├── data/                 # SQLite database files
│   │   └── nexusmind.db
│   ├── logs/                 # Application logs
│   │   ├── combined.log
│   │   └── error.log
│   ├── cli/                  # CLI tools
│   │   └── nexus-cli.js
│   ├── package.json
│   └── .env                  # Environment variables
├── frontend/                  # Frontend Application
│   ├── src/
│   │   ├── App.vue           # Root component
│   │   ├── main.js           # Application entry
│   │   ├── components/       # Reusable components
│   │   │   └── NavBar.vue
│   │   ├── views/            # Page components
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Home.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── Config.vue
│   │   │   ├── Chat.vue
│   │   │   ├── ApiDocs.vue
│   │   │   ├── ModelDetail.vue
│   │   │   └── Admin.vue
│   │   ├── stores/           # Pinia stores
│   │   ├── router/           # Vue Router configuration
│   │   ├── locales/          # i18n translations
│   │   │   ├── en-US.js
│   │   │   └── zh-CN.js
│   │   └── style.css         # Global styles
│   ├── public/
│   │   └── logos/            # Model provider logos
│   │       ├── openai.svg
│   │       ├── anthropic.svg
│   │       ├── google.svg
│   │       └── ...
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── knowledge_base/            # RAG knowledge base
│   └── RAG-1.json
├── AGENTS.md                  # System prompts configuration
├── README.md                  # This file
├── README_ZH.md              # Chinese documentation
├── LICENSE                    # MIT License
└── .gitignore
```

---

## Development

### Backend Development

Run the backend in development mode with hot reload:

```bash
cd backend
npm run dev
```

### Frontend Development

Run the frontend in development mode:

```bash
cd frontend
npm run dev
```

### Building for Production

Build the frontend for production:

```bash
cd frontend
npm run build
```

Preview the production build:

```bash
cd frontend
npm run preview
```

### CLI Tools

NexusMind includes a CLI tool for administrative tasks:

```bash
cd backend
npm run cli
```

---

## Deployment

### Production Deployment

1. **Environment Setup**

Set up your production environment variables:

```env
PORT=3000
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

2. **Build Frontend**

```bash
cd frontend
npm run build
```

3. **Start Backend**

```bash
cd backend
npm start
```

4. **Process Manager (Recommended)**

Use PM2 for production process management:

```bash
npm install -g pm2
pm2 start backend/src/app.js --name nexusmind
pm2 save
pm2 startup
```

5. **Reverse Proxy (Optional)**

Configure Nginx as a reverse proxy:

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

### Docker Deployment (Coming Soon)

Docker support is planned for future releases.

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub.

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [Vue.js](https://vuejs.org)
- Powered by [Express.js](https://expressjs.com)
- UI components by [Element Plus](https://element-plus.org)
- Icons from [Element Plus Icons](https://element-plus.org/en-US/component/icon.html)

---

## Support

- Documentation: [README.md](README.md) | [README_ZH.md](README_ZH.md)
- Issues: [GitHub Issues](https://github.com/yourusername/NexusMind/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/NexusMind/discussions)

---

<div align="center">

Made with ❤️ by the NexusMind Team

[⬆ Back to Top](#nexusmind-ai-model-proxy)

</div>
