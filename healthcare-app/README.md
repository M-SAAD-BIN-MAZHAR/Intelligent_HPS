# Smart Healthcare System

A modern React-based web application for intelligent hospital management with AI-powered healthcare services.

## Features

- 🏥 **Health Risk Prediction** - AI-powered health risk assessment
- 🫁 **Pneumonia Detection** - X-ray image analysis for pneumonia diagnosis
- 🧠 **Depression Assessment** - Mental health risk evaluation
- 💬 **Medical Chatbot** - AI assistant for health-related questions
- 👨‍⚕️ **Doctor Dashboard** - Professional interface for healthcare providers
- 🔐 **Secure Authentication** - User registration and login system

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Management**: React Hook Form with Zod validation
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.development .env
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API services
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── store/          # Zustand state management
└── assets/         # Static assets
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name
- `VITE_ENABLE_ANALYTICS` - Enable/disable analytics

## Backend Integration

The application communicates with FastAPI backends for:
- Health risk prediction
- Pneumonia detection
- Depression assessment
- Medical chatbot (RAG)
- User authentication

Ensure the backend services are running on the configured API base URL.

## License

MIT
