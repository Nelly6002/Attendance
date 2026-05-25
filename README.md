# AttendPro — Attendance Management System

A **portfolio-grade** school attendance portal built with React. Professional UI, real-time analytics, exportable reports, and optional **Supabase** cloud backend.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)

## Group Members

| Name | Matric Number | Role |
|------|---------------|------|
| _Your Name_ | _CSC/20XX/XXX_ | Developer |
| _Member 2_ | _CSC/20XX/XXX_ | Developer |
| _Member 3_ | _CSC/20XX/XXX_ | Developer |

## Features

- Mark attendance (Present / Absent / Late)
- Admin dashboard with bar & pie charts (Recharts)
- Student management with search & profiles
- Attendance records with date filter
- CSV & PDF export
- Dark mode
- Toast notifications
- Protected routes & auth
- **Supabase** cloud OR **Local Storage** offline

## React Requirements (All Covered)

| Requirement | Implementation |
|-------------|----------------|
| Components | Navbar, Footer, Sidebar, StudentCard, AttendanceTable, Loader, UI kit |
| React Router | 12 routes, protected admin layout |
| useState | Forms, search, filters, theme |
| useEffect | Data fetching on mount |
| Props | StudentCard, StatCard, AttendanceTable |
| Event Handling | Attendance buttons, form submit |
| Forms | Login, Register, Add Student, Contact |

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** — register with any email/password (demo mode).

## Connect Supabase (Optional — for high marks)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` → `.env` and add your keys
3. Run `supabase/schema.sql` in the SQL Editor
4. Restart dev server — sidebar shows **Supabase Cloud**

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Deploy to Vercel

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com) — preset: **Vite**
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy

## Project Structure

```
src/
├── components/     # Navbar, Footer, Sidebar, tables, cards
├── components/ui/  # StatCard, PageHeader, EmptyState, Skeleton
├── pages/          # All 12 pages
├── context/        # Auth, Students, Toast
├── services/       # Supabase + Local Storage data layer
├── lib/            # Supabase client
├── utils/          # Helpers & storage
└── styles/         # Global CSS + Tailwind
```

## Tools Used

React · React Router · Vite · Tailwind CSS · Recharts · Lucide Icons · Supabase · Local Storage

## Challenges

- Building a dual data layer (Supabase + Local Storage fallback)
- Responsive dashboard with sidebar on mobile
- Real-time attendance sync and percentage calculations

## Conclusion

AttendPro demonstrates professional front-end development with all compulsory React concepts, modern UI design, and production-ready architecture suitable for software engineering coursework and deployment.

## Screenshots

_Add screenshots of Home, Dashboard, Mark Attendance, and Records pages before submission._
