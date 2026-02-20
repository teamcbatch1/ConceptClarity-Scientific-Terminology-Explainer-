# Concept Clarity - AI FinTech Learning Assistant

Complete full-stack project structure with:
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI Service**: Python FastAPI

## Project Structure

```
concept-clarity/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # State management
│   │   ├── services/      # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Node.js backend
│   ├── controllers/       # Business logic
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   ├── services/         # External services
│   ├── config/           # Configuration
│   ├── package.json
│   └── server.js
│
└── ai-service/           # Python AI service
    ├── app.py            # FastAPI server
    ├── inference.py      # Prediction logic
    ├── train.py          # Training script
    ├── dataset/
    │   └── fintech_terms.json
    └── requirements.txt
```

## Setup Instructions

### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

### AI Service
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

## Environment Variables

Create `.env` files in each directory from `.env.example`

## Features
- JWT Authentication
- Role-based Access Control
- Chat History Management
- Dark/Light Theme Toggle
- Local AI Model + OpenAI Fallback
- Responsive Design with Tailwind CSS
- Clean Architecture
