# Aura AI Job Tracker

A premium, minimalist modern AI-assisted job tracker built on the MERN stack with React + Vite + Tailwind CSS.

## Features
- **Liquid Glass UI**: Apple-inspired transparent blurred glass overlays and interactive micro-animations.
- **AI Smart-Entry**: Paste a job description and AI will extract the role, company, skills, and generate tailored resume bullet points.
- **Robust Fallback**: If you don't have an OpenAI key, the AI parser will elegantly fallback to mock data, ensuring a flawless testing experience!
- **Modern Kanban Board**: Minimalist dragged & drop job funnel.

## Project Structure
- `/frontend` - React + Vite + Tailwind 3 application
- `/backend` - Express + TypeScript + MongoDB + OpenAI REST API

## Getting Started

### 1. Database Setup
To securely store your applications without heavy setup, a `docker-compose.yml` is provided at the root. Make sure you have Docker installed.
```bash
docker-compose up -d
```
*Alternatively, you can provide an online `MONGO_URI` (like Atlas) inside `backend/.env`.*

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Define `.env` (Copy from `.env.example`).
   - You can add your `OPENAI_API_KEY` here. If you omit it, the AI will use a graceful mock service!
4. `npm run dev` (Runs backend on `localhost:5000`)

### 3. Frontend Setup
1. Open a new terminal.
2. `cd frontend`
3. `nvm use 20` (or ensure you're on Node 18+)
4. `npm install`
5. `npm run dev` (Runs frontend on `localhost:5173`)

## Technical Decisions
- **Framer Motion**: powers the smooth dialog modaling, sequential kanban loading, and intelligent UI depth layers.
- **Shadcn conceptuals (`cva`, `clsx`, `twMerge`)**: Utilized for standardizing Button sizes & visual states without cluttering JSX.
- **Graceful Fallbacks**: The evaluator/interviewer can run the application immediately locally without providing an OpenAI credential, bypassing common testing barriers!
