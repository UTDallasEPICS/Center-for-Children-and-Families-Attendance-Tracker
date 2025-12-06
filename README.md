# Development Environment Setup

## Prerequisites
Install the following:

- **Node.js 18 or later**  
  https://nodejs.org/en
- **npm 9 or later** (bundled with Node.js)
- **Git**

---

## 1. Clone the Repository

```bash
git clone https://github.com/UTDallasEPICS/Center-for-Children-and-Families-Attendance-Tracker.git
cd Center-for-Children-and-Families-Attendance-Tracker
```

---

## 2. Install Dependencies

```bash
npm install
```

This installs all Nuxt dependencies and prepares the project for local development.

---

## 3. Start the Development Server

```bash
npm run dev
```

Nuxt will automatically select another port if **3000** is in use.

Example output:

```
Local: http://localhost:3005/
```

---

## 4. Access the Application

Open the printed localhost URL in your browser.

To expose the dev server on your network:

```bash
npm run dev -- --host
```

---

## 5. Recommended Tools

- **Visual Studio Code**
- **Volar extension** (Vue/Nuxt)
- **Nuxt Documentation**  
  https://nuxt.com/docs

---

## Database Status (Fall 2025)

The backend database layer is still in development

- `npm run dev` starts the frontend only; backend and database operations are not yet active.
- Full database initialization steps will be added later.

---

## Authentication Status (Fall 2025)

Authentication is not yet connected to a backend identity system.

- UI components for login and role-based flows exist, but external authentication providers are not configured.
- No environment variables, OAuth settings, or callback URLs are required for local development.
- Future teams will integrate university SSO and third‑party providers (Google, Microsoft, Facebook) and document the setup process.

---

## Tech Stack

### Frontend
- **Nuxt 4**  
  Core framework used for building the application.
- **Vue 3 (Composition API)**  
  Frontend component system.
- **TypeScript**  
  Used across the codebase for type safety.
- **TailwindCSS**  
  Utility-first styling framework.
- **shadcn-vue components**  
  Provides reusable UI components such as buttons, inputs, dialogs, and selects.
- **Vite**  
  Dev server and bundler used by Nuxt for fast HMR.

---

### Backend (In Development)
- **Nuxt Nitro Server**  
  Server engine behind API routes and backend logic.
- **Prisma ORM (planned)**  
  For modeling schema and interacting with the database. Backend queries are still being developed.

---

### Database
- **SQLite (dev.db)**  
  Temporary development-only database file included in development branches. Not currently connected to the running app.

---

### Tooling
- **Node.js 18+**  
- **npm 9+**  
- **Git**  
- **VS Code + Volar extension**

---

### Planned Integrations
- OAuth / SSO authentication  
- Cloud-hosted production database  

