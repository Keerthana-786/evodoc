# EvoDoc — Healthcare Staff Portal

A full-featured staff portal for nurses, receptionists, and doctors built with React + Vite.

## Live Demo

> Deploy to Vercel: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → Opens at http://localhost:5173

# Production build
npm run build
npm run preview
```

## Features

### Nurse / Receptionist Portal
| Page | What it does |
|------|-------------|
| **Patient Intake** | Register new patients — personal info, emergency contact, blood group, allergies, chronic conditions, medications. Full validation + save draft. |
| **Book Appointment** | Search existing patients, select doctor (with availability indicator), pick a date + time slot, choose appointment type, add notes. Confirmation modal before committing. |
| **Appointments List** | Table of all appointments with filters by date, doctor, and status; search by patient name; quick actions to view, edit, or cancel. Cancel confirmation modal. |

### Doctor Portal
| Page | What it does |
|------|-------------|
| **Dashboard** | Stats for today/week, today's schedule, notifications, quick links, recent patients. |
| **Appointments** | Tabbed view of upcoming vs past appointments. Filter by status. Click-through to full patient details. |
| **Patient Details** | Tabbed — Overview (contact info, appointment history), Medical History (summary + allergy alert), Visit Notes (view all past notes + add new clinical notes). |

## Tech Stack

- **React 18** — functional components, hooks only
- **Vite 5** — instant dev server, fast builds
- **lucide-react** — icons
- **CSS-in-JS** — injected `<style>` tag with CSS variables for theming; no external CSS framework needed

## Design Decisions & Trade-offs

- **Single-file component**: All pages live in `src/App.jsx` for simplicity during this task. In production, each page would be a separate file under `src/pages/`.
- **Mock data**: Patient, doctor, and appointment data are hardcoded arrays. In production these would be fetched from a REST/GraphQL API.
- **No auth layer**: The portal switcher (Nurse ↔ Doctor) is a simple toggle. Production would use role-based auth (JWT + protected routes via React Router).
- **No backend**: Cancellations and new notes update local state only. A real implementation would PATCH/POST to an API and invalidate cached queries.
- **CSS approach**: All styles are written as a single CSS string injected via a `<style>` tag. This keeps the project zero-config (no PostCSS, no Tailwind build step) while still using CSS variables for consistent theming.

## Folder Structure

```
evodoc-portal/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx      # React DOM entry
    └── App.jsx       # Full portal (all pages + components)
```

## Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo
3. Framework preset: **Vite** — Vercel auto-detects it
4. Click Deploy — done

---

Built for the EvoDoc Frontend Development recruitment task, April 2026.
