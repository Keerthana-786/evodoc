# EvoDoc — Healthcare Staff Portal

EvoDoc is a comprehensive, production-quality clinical management system designed for healthcare startups. It provides a dual-portal experience for Nurse/Receptionist and Doctor workflows, enabling seamless patient intake, appointment scheduling, and clinical record management.

## 🚀 Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 
- **Components**: shadcn/ui inspired high-fidelity components
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router 7
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📁 Folder Structure

```
src/
├── components/
│   ├── shared/    # Layout, Sidebar, Navbar
│   └── ui/        # Atomic UI components
├── data/          # Realistic medical mock data
├── hooks/         # Custom React hooks (debounce, etc.)
├── pages/         # Portal-specific page components
│   ├── nurse/     # Intake, Appointments management
│   └── doctor/    # Dashboard, Patient Details, Clinical History
├── store/         # Zustand global state (portal roles, data sync)
├── types/         # Core TypeScript interfaces
└── utils/         # Helper functions (CNS, formatting)
```

## 🏗️ Design Decisions

- **Zustand**: Selected for its minimal boilerplate and excellent performance in handling global application state (like portal switching).
- **Zod + React Hook Form**: Ensures type-safe form validation for critical clinical data intake.
- **Glassmorphic UI**: Implementation of a clean, medical-grade aesthetic with subtle shadows and high contrast for dark mode support.
- **Shadow/UI Patterns**: Follows accessible and modular component patterns for a scalable design system.

## ⚖️ Trade-offs

- **Mock Data**: Currently uses a rich set of mock data instead of a live API for demonstration purposes.
- **Auth Layer**: Basic role-based navigation is implemented via the "Portal Switcher" instead of a full authentication flow.

## 📄 License

Clinical OS — EvoDoc System 2026.
