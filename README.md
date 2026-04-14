# NexusMind AI Model Proxy

A unified AI model proxy service supporting multiple mainstream AI model providers with a unified OpenAI-compatible API interface.

[中文文档](./README_ZH.md)

## Features

- **Multi-Model Support**: Supports OpenAI, Anthropic, Google, MiniMax, Mistral, Qwen, XAI, Zhipu and other AI model providers
- **Unified API**: Provides a unified OpenAI-compatible API interface
- **User Management**: Complete user registration, login, and permission management system
- **Billing System**: Precise billing based on token consumption
- **Admin Panel**: User management, model management, statistics viewing
- **Model Intelligence Adjustment**: Supports dynamic adjustment of model intelligence levels
- **Knowledge Base Integration**: Supports RAG knowledge base retrieval enhancement
- **Internationalization**: Supports bilingual Chinese and English interface
- **Responsive Design**: Modern frosted glass effect UI design

## Tech Stack

### Backend
- Node.js + Express
- SQLite Database
- JWT Authentication
- Request Queue Management
- Hot Reload Configuration

### Frontend
- Vue 3 + Vite
- Pinia State Management
- Vue Router
- Tailwind CSS
- Element Plus UI Components
- ECharts Charts

## Quick Start

### Backend Start

```bash
cd backend
npm install
npm start
```

Backend service will run on `http://localhost:3000`

### Frontend Start

```bash
cd frontend
npm install
npm run dev
```

Frontend service will run on `http://localhost:5173`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user information
- `GET /api/auth/stats` - Get user statistics

### Model Endpoints

- `GET /api/models` - Get available model list
- `POST /api/v1/chat/completions` - Chat completion endpoint (OpenAI compatible)

### Admin Endpoints

- `GET /api/admin/users` - Get user list
- `GET /api/admin/stats` - Get system statistics
- `POST /api/admin/model-intelligence` - Update model intelligence

## Configuration

### Environment Variables

Create `.env` file in `backend` directory:

```env
PORT=3000
JWT_SECRET=your-secret-key
```

### Model Configuration

Model configuration is located in `backend/src/config/models.js` and supports hot reload.

## Project Structure

```
NexusMind/
├── backend/          # Backend service
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── controllers/ # Controllers
│   │   ├── middleware/ # Middleware
│   │   ├── routes/   # Routes
│   │   ├── services/ # Services
│   │   └── utils/    # Utility functions
│   └── data/         # Database files
├── frontend/         # Frontend application
│   ├── src/
│   │   ├── components/ # Components
│   │   ├── locales/  # Internationalization files
│   │   ├── stores/   # State management
│   │   ├── views/    # Pages
│   │   └── router/   # Router configuration
│   └── public/       # Static assets
└── knowledge_base/   # Knowledge base files
```

## License

MIT License

## Contributing

Welcome to submit Issues and Pull Requests!
