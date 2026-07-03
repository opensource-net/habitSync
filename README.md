# habitSync

> A gamified habit tracker with a 32-bit pixel aesthetic — build streaks, earn XP, and evolve your companion pet as you complete daily and weekly quests.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)

![habitSync](client/src/assets/hero.png)

## Overview

habitSync turns habit tracking into a game. Every completed habit ("quest") earns XP, XP levels up a pixel-art companion pet, and progress is visualized through chunky, retro-styled dashboards. The goal is to make consistency feel rewarding instead of like a chore.

The project is a TypeScript monorepo with a React SPA client and an Express + Supabase (PostgreSQL) backend, sharing a common data contract for habits between the two.

## Features

- **Quest log** — create, complete, and delete daily/weekly habits with instant, optimistic UI updates
- **XP & pet evolution** — completing habits earns XP that evolves a companion pet through multiple growth stages (Tiny Pup → Puppy → Dog)
- **Progress dashboard** — live completion rate, total/completed quest counts, and a pixel-styled progress bar
- **Authentication** — email/password signup and login backed by JWT sessions stored in HTTP-only cookies
- **Light/dark theme** — persisted per-browser via `localStorage`
- **32-bit design system** — custom pixel typography (Press Start 2P), chunky 4px borders, and hard drop-shadows instead of soft gradients

## Tech Stack

| Layer | Technology |
|---|---|
| **Client** | React 19, TypeScript, Vite 8, React Router v6 |
| **Server** | Node.js, Express 5, TypeScript |
| **Database** | PostgreSQL via [Supabase](https://supabase.com/) |
| **Auth** | JWT sessions, HTTP-only cookies, `cookie-parser` |
| **HTTP client** | Axios |
| **Styling** | Tailwind CSS v4 + custom pixel-art CSS |
| **Animation** | Framer Motion, `canvas-confetti` |
| **Tooling** | ESLint, Prettier, Vitest |

## Project Structure

```
habitSync/
├── client/                    # React + Vite SPA
│   └── src/
│       ├── app/                # App shell, root component, router
│       ├── components/         # UI components (auth, habits, layout, pet, progress)
│       ├── features/           # Feature-scoped API clients & types (auth, habits, pet)
│       ├── hooks/               # Shared React hooks (e.g. theme)
│       ├── pages/               # Route-level pages (Dashboard, Login, Signup, 404)
│       └── styles/              # Global styles, theme tokens, pixel-art CSS
├── server/                    # Express API
│   ├── authentication/         # Signup/login/session controllers, JWT + middleware
│   ├── controllers/            # Habit CRUD controllers
│   ├── routers/                # Express route definitions
│   ├── types/                  # Shared server-side types
│   └── server.ts                # App entry point
└── package.json                # npm workspaces root (client, server, packages/*)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com/) project (PostgreSQL database + service role key)

### Installation

```bash
git clone https://github.com/PTRI-20-Team-Pikachu/habitSync.git
cd habitSync
npm install
```

### Environment Variables

Create a `server/.env` file (see `server/.env.example`):

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Development

Run the client and server together from the repo root:

```bash
npm run dev
```

This starts:
- **Client** → `http://localhost:5173` (Vite dev server with HMR)
- **Server** → `http://localhost:3434` (Express API)

Or run each independently:

```bash
npm run dev:client   # client only
npm run dev:server   # server only
```

### Building for Production

```bash
cd client
npm run build     # type-check + production build
npm run preview   # preview the production build locally
```

The Express server also serves the built client from `client/dist` when the build is present.

## API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/users` | Create a new user account | No |
| `POST` | `/api/session` | Log in, issue a session cookie | No |
| `GET` | `/api/session` | Get the current session/user | Yes |
| `DELETE` | `/api/session` | Log out | No |
| `GET` | `/api/habits` | List the current user's habits | Yes |
| `GET` | `/api/habits/:id` | Get a single habit | Yes |
| `POST` | `/api/habits` | Create a habit (`title`, `goal`, `frequency`) | Yes |
| `PATCH` | `/api/habits/:id/complete` | Toggle a habit's completed state | Yes |
| `DELETE` | `/api/habits/:id` | Delete a habit | Yes |
| `GET` | `/health` | Health check | No |

Routes marked **Auth: Yes** require a valid session cookie, enforced via the `requireUser` middleware.

## License

Distributed under the [MIT License](./LICENSE).
