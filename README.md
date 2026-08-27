# TROIT Logistics — Frontend Engineering Onboarding & Developer Guide

Welcome to the **TROIT Logistics** frontend codebase! This repository houses the web application for TROIT Logistics, an e-commerce trust and logistics platform starting with a controlled pilot in Port Harcourt, Nigeria.

This document serves as the **authoritative onboarding guide and architectural manual** for all frontend engineers and interns. Read this document thoroughly before creating branches or writing code.

---

## 1. Product Overview & Context

Nigerian online commerce suffers from severe trust, verification, and logistics gaps: financial scams on social commerce (Visa 2026 report), product mismatch, counterfeit goods, and last-mile delivery failure.

**TROIT Logistics** closes this trust gap by embedding physical verification and accountability into every stage of a transaction:
1. **Seller KYC**: Verification of seller identity prior to platform access.
2. **Physical Seller Inspection**: Field agents inspect physical stores and operations in person.
3. **Product Verification & Verified Inventory**: Goods are inspected for authenticity, condition, and graded (**Grade A, B, C**).
4. **Buyer KYC**: Buyer identification for transaction safety and dispute resolution.
5. **Controlled Logistics**: In-house dispatch fleet for end-to-end delivery tracking.
6. **Pickup Inspection**: Riders verify item condition and capture photo evidence before an item leaves the seller.
7. **Protected Transactions (Escrow)**: Funds remain held until delivery confirmation or dispute resolution.
8. **Seller Probation & Trust Progression**: New sellers undergo close monitoring for their **first 5 transactions**. Trust is earned through performance, never purchased via VIP status.

### Supported User Roles
The platform architecture supports 5 core user roles:
*  **Buyer**: Product discovery, verified inventory browsing, protected payment, delivery tracking, disputes.
*  **Seller**: Registration, KYC onboarding, listing verified inventory, order tracking, trust progression.
*  **Rider**: Assigned pickups, on-site condition checklist & photo evidence logging, delivery confirmation.
*  **Field Agent**: Physical store verification, inventory quality grading, inspection reporting.
*  **Admin**: Operational monitoring, KYC approvals, trust score management, dispute resolution, pilot KPIs.

---

## 2. Environment Foundation vs. Intern Scope

To ensure architectural clarity, understand what is already provided in this setup and what you are expected to build:

### Provided Foundation (Set up by Mentors/Team)
* ✅ Vite + React + TypeScript strict mode build configuration.
* ✅ React Router & TanStack Query top-level provider setup (`src/app/providers/`).
* ✅ Centralized Axios API HTTP client (`src/lib/api/client.ts`).
* ✅ Type-safe environment reader (`src/app/config/env.ts`).
* ✅ Feature-based folder structure and directory layout.
* ✅ ESLint, Prettier, and TypeScript quality checking commands.
* ✅ Git branching, commit standard, and PR process guidelines.

### Scope to be Built by Interns (Your Assignments)
*  Feature components, forms, and pages for assigned user stories.
*  Zod validation schemas for feature forms.
*  Feature-specific TanStack Query hooks and API integration calls.
*  Responsive mobile-first UI views aligned with approved Figma designs.

---

## 3. Technology Stack

* **Core Framework**: React 18+ with TypeScript
* **Build & Dev Tool**: Vite
* **Routing**: React Router (`react-router-dom` v6+)
* **Server State Management**: TanStack Query (`@tanstack/react-query` v5+)
* **HTTP Client**: Axios
* **Runtime Validation**: Zod
* **Code Quality**: ESLint, Prettier, TypeScript Strict Compiler

> ⚠️ **Rule**: Do NOT install additional global state management libraries (e.g. Redux, Zustand), UI component libraries, or animation packages unless explicitly requested and approved by your mentor.

---

## 4. Getting Started & Installation

### Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TROIT-Logistics/TROIT-Logistics-frontend.git
   cd TROIT-Logistics-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the `.env.example` file to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```

   Ensure `.env` contains valid local development settings:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=TROIT Logistics
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 5. Available Development Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server (defaults to port 3000) |
| `npm run build` | Compiles TypeScript (`tsc -b`) and bundles production asset build |
| `npm run lint` | Runs ESLint across all `.ts` and `.tsx` files |
| `npm run typecheck` | Executes TypeScript strict compiler check without emitting files |
| `npm run preview` | Previews local production build build output |

---

## 6. Directory & Feature Architecture

This repository strictly enforces a **feature-based architecture**. Code is grouped by business domain rather than generic file type.

```text
src/
├── app/
│   ├── config/          # Type-safe env reader and app constants
│   ├── providers/       # Top-level React Query & Router providers
│   └── router/          # Application route definitions
│
├── assets/              # Static assets (images, icons, logos)
│
├── components/          # Shared generic UI components only
│   ├── ui/              # Buttons, inputs, cards, badges
│   ├── layout/          # Header, footer, sidebar, wrappers
│   ├── forms/           # FormField wrappers
│   └── feedback/        # LoadingState, EmptyState, ErrorState
│
├── features/            # Business feature modules (Self-contained)
│   ├── auth/
│   ├── buyer/
│   ├── seller/
│   ├── rider/
│   ├── field-agent/
│   ├── inventory/
│   ├── orders/
│   ├── logistics/
│   ├── verification/
│   ├── disputes/
│   ├── trust/
│   ├── payments/
│   └── admin/
│
├── hooks/               # Shared global React hooks
├── lib/
│   ├── api/             # Centralized Axios client & generic API types
│   ├── utils/           # Shared helper functions (formatters, dates)
│   └── validation/      # Shared common Zod validation rules
│
├── pages/               # Top-level page wrappers
├── routes/              # Additional route helper definitions
├── types/               # Shared application domain types
├── App.tsx
├── main.tsx
└── index.css            # Mobile-first CSS tokens & reset
```

### Feature Module Structure Standard

Each feature under `src/features/<feature-name>/` MUST follow this internal structure:

```text
src/features/seller/
├── api/          # Feature API request functions using centralized apiClient
├── components/   # Feature-specific UI components (e.g., SellerKycForm.tsx)
├── hooks/        # Feature custom hooks and TanStack Query hooks
├── types/        # Feature-specific interfaces & type definitions
├── validation/   # Feature Zod validation schemas
└── index.ts      # Public API export for the feature module
```

### Feature Placement Rules
* 🛑 **Incorrect**: `src/components/SellerKycForm.tsx` (Do NOT place feature components in global `src/components/`)
* 🛑 **Incorrect**: `src/components/RiderInspection.tsx`
* ✅ **Correct**: `src/features/seller/components/SellerKycForm.tsx`
* ✅ **Correct**: `src/features/rider/components/RiderInspection.tsx`
* ✅ **Correct**: `src/components/ui/Button.tsx` (Shared generic component with no business domain logic)

---

## 7. API & State Management Guidelines

### Server State vs. Local UI State
* **Server State**: Product lists, order details, seller KYC status, inventory, disputes, trust levels. **MUST** be fetched and cached using **TanStack Query**. Do NOT duplicate server state into global React state.
* **Local UI State**: Modal open/close toggles, active tab selections, temporary form inputs. Use React `useState` or `useReducer`.

### Centralized API Client Rule
* All feature API calls MUST use the pre-configured Axios instance from `@/lib/api/client`.
* Do NOT hardcode API URLs or backend IP addresses inside components.
* Always read configuration through `VITE_API_BASE_URL`.

---

## 8. TypeScript Coding Rules

1. **Strict Mode Enabled**: The project enforces strict compiler settings (`strict: true`, `noImplicitAny: true`, `noUnusedLocals: true`).
2. **No `any` Types**: Do NOT use `any` under any circumstances. Use explicit interfaces, types, `unknown`, or generics.
3. **Path Aliases**: Use `@/` path alias for clean imports (e.g. `import { apiClient } from '@/lib/api/client';`).
4. **Type Exports**: Keep feature-specific types inside `src/features/<feature>/types/` and shared domain types inside `src/types/`.

---

## 9. Mobile-First Requirement

TROIT Logistics targets social-commerce buyers and field personnel operating on mobile devices in Port Harcourt. All UI components must be designed **mobile-first**:

```text
Mobile View (<640px) ──> Tablet View (640px - 1024px) ──> Desktop View (>1024px)
```

Always test UI layouts in Chrome DevTools responsive preview mode before requesting code review.

---

## 10. Git Workflow & Branching Standard

Interns MUST NEVER work or push directly to the `main` branch.

### Branch Naming Scheme
```text
main
  └── develop
        ├── feature/<description>
        ├── fix/<description>
        ├── refactor/<description>
        ├── docs/<description>
        └── chore/<description>
```

### Examples
* `feature/seller-kyc-flow`
* `feature/buyer-product-search`
* `feature/rider-pickup-checklist`
* `fix/order-status-badge`
* `docs/update-api-instructions`

---

## 11. Conventional Commit Standards

All commit messages MUST follow the Conventional Commits specification.

### Allowed Prefix Types
* `feat:` A new user-facing feature
* `fix:` A bug fix
* `docs:` Documentation changes only
* `refactor:` Code change that neither fixes a bug nor adds a feature
* `chore:` Updating build tasks, packages, or config files

### Examples
```bash
git commit -m "feat: implement seller kyc form validation"
git commit -m "fix: resolve mobile layout padding on pickup checklist"
git commit -m "docs: add api integration steps to README"
```

❌ **Prohibited commit messages**: `update`, `changes`, `fixed`, `wip`, `final`, `stuff`, `testing`.

---

## 12. Pull Request (PR) Standard

When opening a Pull Request:
1. Ensure your branch is branched from `develop` and up-to-date.
2. Fill out the PR template completely:
   * **What was implemented**: Clear explanation of changes.
   * **Why**: Product/technical motivation.
   * **Screenshots/Recordings**: Mandatory for UI changes (mobile & desktop views).
   * **API Endpoints**: Mention any endpoints integrated.
   * **Testing Completed**: Summary of local tests.
   * **Known Limitations**: Any unfinished work or follow-ups.
3. Run required quality checks locally before opening the PR:
   ```bash
   npm run typecheck && npm run lint && npm run build
   ```

---

## 13. Definition of Done Checklist

A frontend task is considered **DONE** only when all applicable criteria are met:

```text
[ ] Feature matches approved Figma design
[ ] Mobile layout verified and responsive
[ ] TypeScript passes (`npm run typecheck`) with zero errors
[ ] ESLint passes (`npm run lint`) with zero warnings/errors
[ ] Production build succeeds (`npm run build`)
[ ] API integration works with proper loading, empty, and error states
[ ] Form validation implemented using Zod with helpful error feedback
[ ] No sensitive information (keys, passwords) committed or exposed
[ ] No prohibited `any` types used
[ ] PR description completed with screenshots attached
[ ] Mentor/Peer review feedback addressed and approved
```

---

## 14. 13-Step Intern Development Workflow

Follow this step-by-step workflow for every assigned task:

```text
 1. Read Assigned User Story / Task
        ↓
 2. Review Relevant PRD Section (troit logistic.pdf)
        ↓
 3. Inspect Approved Figma Design
        ↓
 4. Check Backend API Specification & Endpoint Contracts
        ↓
 5. Ask Mentor/Product Team if Requirements are Unclear
        ↓
 6. Create Local Feature Branch (e.g., feature/seller-kyc)
        ↓
 7. Implement Component, Hook & Validation Logic
        ↓
 8. Test Locally Across Mobile and Desktop Viewports
        ↓
 9. Run Local Verification (npm run typecheck && npm run lint && npm run build)
        ↓
10. Open Pull Request to develop Branch
        ↓
11. Participate in Code Review
        ↓
12. Address Reviewer Feedback & Push Fixes
        ↓
13. Merge to develop
```

>  **Important Rule**: If product requirements or API contracts are ambiguous or missing, **do NOT invent product behavior**. Immediately seek clarification from your mentor or product team.

---

## 15. Security & Environment Rules

1. 🔒 **Never Commit `.env`**: `.env` is listed in `.gitignore`. Never use `git add -f .env`.
2. 🔒 **Frontend Variables are Public**: Any variable starting with `VITE_` is bundled into client-side JavaScript.
3. 🔒 **No Secrets in Client Code**: NEVER place private API keys, database passwords, payment gateway secrets, escrow signing keys, or server credentials in the frontend repository.

---

## 16. Troubleshooting & FAQs

* **Path alias `@/` not resolving**: Ensure `tsconfig.json` contains `"baseUrl": "."` and `"paths": { "@/*": ["src/*"] }`, and `vite.config.ts` includes path resolution alias.
* **ESLint error on unused variables**: Prefix intentionally unused arguments with an underscore (e.g. `_event`).
* **TanStack Query refetching frequently during dev**: Default `staleTime` is set to 5 minutes in `QueryProvider.tsx`. Adjust `staleTime` if needed.
