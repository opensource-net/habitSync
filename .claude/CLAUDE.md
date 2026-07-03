# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

habitSync is a full stack habit tracker web-app, gamified habit-tracking application featuring a 32-bit pixel aesthetic. It focuses on high-performance UI, real-time animations (XP gains, badge unlocks), and data-driven progress visualization.
The repo is a npm workspace monorepo with three workspace roots: `client/`, `server/`, and `packages/*` (packages not yet scaffolded).

## Core Tech Stack
- **Foundation:** React 18 (Concurrent Rendering) + Vite + TypeScript.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** PostgreSQL
- **Routing & Auth:** React Router v6 (Protected Routes) + Axios (Interceptors for JWT/401 handling).
- **State Management:** - **Server State:** TanStack Query (Caching, background refetching, optimistic updates).
  - **Client State:** Zustand (UI state, modals, animation queues).
- **Styling (32-bit Aesthetic):**
  - Tailwind CSS (Layout/Spacing).
  - Custom CSS: `image-rendering: pixelated`, chunky 4px borders, `4px 4px 0px #000` box shadows.
  - Typography: **Press Start 2P** for UI/Headings; clean Sans for body copy.
- **Animation & FX:** Framer Motion (XP floats, card shakes) + `canvas-confetti` for milestones.
- **Data Visualization:** Recharts (XP/Streaks) + `react-calendar-heatmap` (Contribution grids).
- **Forms & Validation:** React Hook Form + Zod (Schema-based validation).
- **Tooling:** Vitest (Testing), ESLint, Prettier, Husky.

## Coding Standards & Preferences
- **Language:** Always use **TypeScript**. Prefer interfaces over types for public APIs.
- **State Management:** Use React Context or Zustand; avoid Redux unless specified.
- **Styling:** Use Tailwind CSS utility classes. Avoid inline styles or CSS modules.
- **Naming Conventions:** - PascalCase for Components and Interfaces.
  - camelCase for functions and variables.
  - kebab-case for file names (e.g., `user-profile.tsx`).
- **Imports:** Use absolute paths (e.g., `@/components/...`). Use named exports instead of default exports.

## Commands

All client commands run from the `client/` directory:

```bash
cd client
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check then build for production (tsc -b && vite build)
npm run lint      # Run ESLint on TypeScript/TSX files
npm run preview   # Preview the production build locally
```

All server commands run from the `server/` directory:

No test runner is configured yet (`npm test` at root exits with an error).

## Key Workflows
- **Git:** We use conventional commits (e.g., `feat:`, `fix:`, `refactor:`).
- **Testing:** Use Vitest for unit testing E2E testing unless specified.
- **Deployment:** GitHub Actions handle CI/CD to [Platform].
- **Workflow:** Conventional Commits; GitHub Actions for Slack/Discord notifications.

## Architecture

**Client** (`client/`) — React 19 + Vite 8 + TypeScript 6 SPA

- Entry: `client/src/main.tsx` → mounts `<App />` into `#root`
- `client/src/App.tsx` — top-level component (currently placeholder scaffold)
- Vite config uses `@vitejs/plugin-react` + `@rolldown/plugin-babel` with the React Compiler preset (`babel-plugin-react-compiler`), so manual `useMemo`/`useCallback` memoization is generally unnecessary
- TypeScript is in bundler mode (`moduleResolution: bundler`, `noEmit: true`); `tsc` only type-checks, Vite handles transpilation

**Server** (`server/`) — `server/server.ts` exists but is currently empty; no package.json or runtime yet

**Monorepo root** (`package.json`) — workspaces declared for `client`, `server`, and `packages/*`; root has no build or lint scripts of its own

## Instructions for Claude
1. **Be Concise:** Provide code snippets first, followed by brief explanations.
1. **Prioritize Vite/Vitest:** When suggesting commands or config changes, use Vite-specific syntax.
2. **Animation Context:** When a habit is completed, suggest code that triggers both the backend update and a Framer Motion/Confetti sequence.
2. **Security:** Never suggest committing `.env` files or hardcoding secrets.
3. **Refactoring:** When suggesting changes, prioritize readability and reducing complexity.

## Token Efficiency Rules
1. **Partial Code Only:** Unless I ask for a full file, only provide the specific functions or components being changed.
2. **No Boilerplate:** Omit standard imports (React, Lucide icons, etc.) if they haven't changed. Use comments like `// ... existing imports` to save tokens.
3. **Dry Explanations:** Do not explain how basic React hooks work. Focus only on the custom logic of HabitSync.
4. **Compact CSS:** When providing Tailwind classes, combine them into single lines.


## Coding Standards & Preferences
- **Optimistic UI:** Always implement optimistic updates for habit completions to ensure the UI feels "instant."
- **Type Safety:** Strict TypeScript interfaces for Habit objects, XP events, and Badge types.
- **Component Pattern:** Functional components. Extract game logic/API calls into custom hooks.
- **Security:** Use Axios interceptors to manage tokens; never store secrets in client-side code.
- **Pixel Perfection:** Ensure all UI elements adhere to the "chunky" 32-bit design system—avoid thin borders or smooth gradients unless specified.
