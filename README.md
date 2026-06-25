# 🏗️ BuildFlow ERP

BuildFlow ERP is a modern, modular Enterprise Resource Planning and Real Estate Management System built for construction firms and real estate developers. It simplifies complex workflows like project tracking, investment management, property sales, and office administration into a clean, simple, and intuitive dashboard.

![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge) ![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel) ![Backend](https://img.shields.io/badge/Backend-Render-blue?style=for-the-badge) ![Database](https://img.shields.io/badge/Database-Neon_Postgres-00E599?style=for-the-badge&logo=postgresql)

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Ant Design (UI), TanStack Query (State Management)
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy (Async), Alembic
- **Database:** PostgreSQL (Hosted on Neon)
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🚀 Current Progress & Features

**Overall Completion: ~50%**

| Module | Frontend UI | Backend API | Status |
|--------|-------------|-------------|--------|
| **0. Core Foundation** | ✅ Complete | ✅ Complete | Done (Auth, DB Models, Router) |
| **1. Dashboard** | ✅ Complete | ⏳ Mocked | Done |
| **2. Projects** | ✅ Complete | ⏳ Mocked | Done |
| **3. Office Management** | ✅ Complete | ✅ Complete | **In Progress** (Employees wired, Salaries/Expenses pending wiring) |
| **4. Investments** | ✅ Complete | ⬜ Pending | Frontend Done |
| **5. Property Sales** | ✅ Complete | ⬜ Pending | Frontend Done |
| **6. Tuesday Payments** | ✅ Complete | ⬜ Pending | Frontend Done |
| **7. Loans** | ✅ Complete | ⬜ Pending | Frontend Done |
| **8. Reports** | ✅ Complete | ⬜ Pending | Frontend Done |
| **9. Documents** | ⬜ Pending | ⬜ Pending | Planned |
| **10. User Auth/Admin**| ⬜ Pending | ⬜ Pending | Planned |

---

## 💻 Local Development

### 1. Database Setup
Ensure you have the Neon connection string in your backend environment.
```env
# backend/.env
DATABASE_URL=postgresql+asyncpg://neondb_owner:YOUR_PASSWORD@ep-crimson-lab-aoanw3m4.c-2.ap-southeast-1.aws.neon.tech/buildflow_erp?ssl=require
```

### 2. Run the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.