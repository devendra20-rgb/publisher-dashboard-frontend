# Publisher Admin Dashboard

Modern admin dashboard built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components for monitoring publisher onboarding activity from multiple Google Sheets.

## Features

- 📊 **Dashboard** — total publishers, active sheets, monthly onboarding chart, delivery-person performance
- 👥 **Publishers** — searchable, filterable, paginated responsive table with sticky headers
- 📑 **Sheet Management** — add sheets, toggle active status
- 🎨 Sidebar + Navbar layout, fully responsive (mobile drawer)
- 💀 Loading skeletons + empty states
- 🔌 API-ready (falls back to dummy data if backend unreachable)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Connect to your backend

Set in `.env.local`:

```
NEXT_PUBLIC_API_BASE=https://publisher-dashboard-backend.onrender.com/api
NEXT_PUBLIC_USE_DUMMY=false
```

Endpoints expected (matches your provided spec):

- `GET    /api/sheets`
- `POST   /api/sheets`
- `PATCH  /api/sheets/:id/toggle`
- `GET    /api/publishers?usedBy=&market=&status=&publisherName=&sheetId=&page=&limit=`

## Project structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/page.tsx
│   ├── publishers/page.tsx
│   ├── sheets/page.tsx
│   ├── layout.tsx
│   ├── page.tsx            # redirects to /dashboard
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn-style primitives (button, card, dialog, table, …)
│   ├── layout/             # Sidebar, Navbar, AppShell
│   ├── dashboard/          # StatCard, MonthlyChart, PersonList
│   ├── publishers/         # Filters, Table, Pagination
│   └── sheets/             # AddSheetDialog
├── lib/
│   ├── api.ts              # API client (dummy fallback)
│   └── utils.ts            # cn() helper
├── types/index.ts          # Shared TypeScript types
└── data/dummy.ts           # Dummy data
```

## Build

```bash
npm run build && npm start
```
