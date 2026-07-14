# CoinFlow Portfolio Tracker

CoinFlow is a clean, lightweight cryptocurrency portfolio tracker with user authentication and real-time tracking capabilities. It features a robust FastAPI backend backend-coupled with a modern React + TypeScript + Vite frontend.

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, SQLite, Pydantic, JWT (python-jose, passlib/bcrypt)
- **Frontend**: React (v19), TypeScript, Vite, CSS, Lucide Icons
- **APIs**: CoinGecko (for real-time crypto prices), Etherscan

---

## Key Features

- **User Authentication**: Secure signup and login flow using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Portfolio Management**: Complete CRUD operations to add, view, update, and remove cryptocurrency holdings.
- **Real-Time Data Integration**: Fetches latest pricing data from CoinGecko API.
- **Responsive Dashboard**: Beautiful and intuitive dashboard interface displaying portfolio statistics and assets.
- **Local DB Integration**: Built-in SQLite database support for easy and standalone local setup.

---

## Live Demo & Screenshots

- **Live Application**: [Live Demo Link](https://github.com/Arnav0107/CoinFlow) *(Placeholder)*
- **Dashboard Preview**:
  ![Dashboard Screenshot](https://raw.githubusercontent.com/Arnav0107/CoinFlow/main/docs/dashboard-screenshot.png) *(Placeholder)*

---

## Folder Structure

```text
CoinFlow/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py         # Login & registration routers
│   │   │   └── portfolio.py    # Portfolio CRUD routers
│   │   ├── auth_utils.py       # JWT helper methods, password hashing
│   │   ├── config.py           # Environment variables configuration
│   │   ├── crud.py             # Database query helpers
│   │   ├── database.py         # SQLAlchemy engine and session setup
│   │   ├── main.py             # FastAPI entrypoint, middleware, routes
│   │   ├── models.py           # SQLAlchemy database models
│   │   └── schemas.py          # Pydantic schemas for data validation
│   ├── .env.example            # Backend env configuration template
│   └── requirements.txt        # Backend dependencies list
├── frontend/
│   ├── src/
│   │   ├── assets/             # Assets and logos
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # AuthContext provider
│   │   ├── services/           # CoinGecko and backend API fetchers
│   │   ├── App.tsx             # Main dashboard UI and layout
│   │   └── main.tsx            # React application mount script
│   ├── package.json            # Node project configuration
│   └── vite.config.ts          # Vite build config
└── .gitignore                  # Git repository exclusion file
```

---

## Getting Started

Follow the instructions below to run both the backend API and frontend locally.

### Prerequisites

- Python 3.9+
- Node.js 18+ & npm

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install the required packages:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up local environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env     # Windows CMD
     cp .env.example .env       # PowerShell or Bash
     ```
   - Open `.env` and fill in the values (e.g., generate a strong `SECRET_KEY`).

5. **Run the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   *The API will start running at `http://127.0.0.1:8000`. You can access interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the Vite development server:**
   ```bash
   npm run dev
   ```
   *The client application will start at `http://localhost:5173`.*
