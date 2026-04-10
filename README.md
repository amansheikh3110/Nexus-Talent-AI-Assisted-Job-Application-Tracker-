# 🚀 Nexus Talent: AI-Assisted Job Application Tracker

**Nexus Talent** is a state-of-the-art, premium job application management platform. Built for high-performance job seekers, it leverages Artificial Intelligence to transform chaotic job hunts into structured, data-driven career strategies.

![Premium UI Showcase](https://raw.githubusercontent.com/amansheikh3110/Nexus-Talent-AI-Assisted-Job-Application-Tracker-/main/frontend/public/images/dashboard_preview.png)
*(Note: Replace with actual screenshot path if available)*

---

## ✨ Key Features

### 🧠 Architect AI Module
Parsing job descriptions is a thing of the past. Simply paste the text, and our AI will:
- **Extract Market Signals**: Automatically identify Company, Role, Seniority, and Location.
- **Skill Extraction**: Generate a clean list of required vs. nice-to-have technical skills.
- **Resume Optimization**: Generate 5 metric-driven, high-impact bullet points tailored specifically to that job description to help you beat the ATS.

### 🛡️ Resilient AI Infrastructure
Never worry about API rate limits or downtime.
- **Cascading Fallbacks**: Built with a service-oriented architecture that automatically cycles through multiple free AI models (Mistral, Llama, Qwen, etc.) via OpenRouter if the primary model fails.
- **Zero-Crash Design**: Graceful error handling for network failures or malformed AI responses.

### 📋 Strategy Board (Kanban)
A fluid, drag-and-drop interface powered by `@dnd-kit`:
- **Interactive Funnel**: Move applications through stages: *Applied*, *Phone Screen*, *Interviewing*, *Offer*, and *Rejected*.
- **Visual Intelligence**: Status badges and adaptive color-coding ensure you never miss a follow-up.

---

## 🛠️ Technical Stack

- **Frontend**: 
  - React 19 + Vite
  - Tailwind CSS 3 (Premium Glassmorphism Design)
  - Framer Motion (Micro-animations)
  - TanStack Query v5 (Server State Management)
  - dnd-kit (Kanban Logic)
- **Backend**: 
  - Node.js + Express
  - TypeScript
  - MongoDB (Mongoose)
  - OpenRouter API (AI Orchestration)
- **Security**: 
  - JWT Authentication
  - Bcrypt Password Hashing
  - Environment-isolated API Keys

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)
- OpenRouter API Key (Free tier works perfectly)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
*Update `.env` with your `MONGODB_URI`, `JWT_SECRET`, and `OPENROUTER_API_KEY`.*

```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The application should now be running at `http://localhost:5173`.*

---

## 📂 Project Structure

```text
├── backend
│   ├── src
│   │   ├── services/    # AI Orchestration & Business Logic
│   │   ├── routes/      # Express Endpoint Handlers
│   │   ├── models/      # MongoDB Schemas
│   │   └── middleware/  # Auth & Security
├── frontend
│   ├── src
│   │   ├── components/  # Atomic UI & Smart Components
│   │   ├── pages/       # View Layouts
│   │   ├── lib/         # API (Axios) Configuration
│   │   └── contexts/    # Auth & Notification State
```

---

## 📜 Architectural Decisions

- **Service Layer Abstraction**: AI logic is completely isolated from HTTP routes, allowing for easy model swapping or testing.
- **Custom Design System**: Instead of generic UI libraries, we use a bespoke design system with CSS variables for seamless dark/light mode transitions.
- **Global Error Interceptors**: Centrally managed axios response interceptors handle session expiry and network failures across the entire app.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Developed with 💜 by [Aman Sheikh](https://github.com/amansheikh3110)**
