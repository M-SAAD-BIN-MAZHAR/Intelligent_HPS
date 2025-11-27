# Intelligent Healthcare Management System

A comprehensive healthcare management platform featuring AI-powered diagnostics, health risk assessment, and intelligent chatbot assistance. This project combines a modern React frontend with a robust Python backend to deliver advanced healthcare services.

## 🌟 Features

### Frontend (React Application)
- 🏥 **Health Risk Prediction** - AI-powered lifestyle and health risk assessment
- 🫁 **Pneumonia Detection** - X-ray image analysis using deep learning
- 🧠 **Depression Assessment** - Mental health risk evaluation questionnaire
- 💬 **Medical Chatbot** - RAG-powered AI assistant for health queries
- 👨‍⚕️ **Doctor Dashboard** - Professional interface for healthcare providers
- 🔐 **Secure Authentication** - User registration and login system
- 📱 **Responsive Design** - Mobile-first approach with glassmorphism UI

### Backend (Python/FastAPI)
- 🤖 **Machine Learning Models** - XGBoost for health prediction, CNN for pneumonia detection
- 🗄️ **Database Integration** - SQLite with user management and chat history
- 🔗 **RESTful API** - FastAPI with automatic documentation
- 🧠 **RAG Chatbot** - Retrieval-Augmented Generation for medical queries
- 🔒 **Security** - JWT authentication and CORS configuration

## 🏗️ Architecture

```
├── healthcare-app/          # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── IntelligentBasedHMS/     # Python Backend
│   ├── api_server.py       # FastAPI server
│   ├── chat_responder.py   # RAG chatbot logic
│   ├── database.py         # Database operations
│   ├── models/             # ML model files
│   └── requirements.txt
│
└── .kiro/specs/            # Project specifications
    └── streamlit-to-react-conversion/
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd healthcare-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.development .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd IntelligentBasedHMS
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
python api_server.py
```

The backend API will be available at `http://localhost:8000`

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Management**: React Hook Form with Zod validation
- **Styling**: Emotion (CSS-in-JS) with glassmorphism effects
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI
- **Database**: SQLite with custom ORM
- **ML Libraries**: scikit-learn, XGBoost, TensorFlow/Keras
- **Authentication**: JWT tokens
- **File Processing**: PIL for image handling
- **RAG System**: Custom implementation with vector search

## 📊 Machine Learning Models

### Health Risk Prediction
- **Algorithm**: XGBoost Classifier
- **Features**: Age, BMI, lifestyle factors, medical history
- **Output**: Risk probability and classification

### Pneumonia Detection
- **Architecture**: Convolutional Neural Network (CNN)
- **Input**: Chest X-ray images (224x224 pixels)
- **Output**: Pneumonia probability with confidence score

### Depression Assessment
- **Method**: Rule-based scoring system
- **Input**: Standardized questionnaire responses
- **Output**: Risk level categorization

## 🔧 Development

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

### Backend Development
```bash
python api_server.py          # Start FastAPI server
python -m pytest tests/       # Run tests (if available)
```

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Health Services
- `POST /predict/health` - Health risk prediction
- `POST /predict/pneumonia` - Pneumonia detection from X-ray
- `POST /predict/depression` - Depression risk assessment

### Chatbot
- `POST /chat/message` - Send message to medical chatbot
- `GET /chat/threads` - Get user's chat threads
- `POST /chat/threads` - Create new chat thread

## 🔒 Security Features

- JWT-based authentication
- Input validation and sanitization
- CORS configuration
- Secure file upload handling
- Environment-based configuration

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Glassmorphism UI effects
- Smooth animations and transitions
- Touch-friendly interface elements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Medical datasets and research papers that informed the ML models
- Open-source libraries and frameworks used in this project
- Healthcare professionals who provided domain expertise

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This is a demonstration project for educational purposes. Always consult with qualified healthcare professionals for medical advice.