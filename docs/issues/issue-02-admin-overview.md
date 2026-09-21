# Issue 2 — Admin Overview

- **Priority**: Medium (P2)
- **Suggested Labels**: `admin`, `dashboard`, `ui`
- **Suggested Intern Skill Level**: Intermediate Intern
- **Dependencies**: Issue 1
- **Estimated Difficulty**: Medium

## Description
Build the `/admin` overview summary page displaying key system metric cards (Total Users, Sellers, Verified Products, Active Orders, Escrow Volume) and clear fallback/coming-soon states for metrics awaiting dedicated backend endpoints.

## Why This Matters
Gives administrators a high-level operational pulse of platform activity.

## Scope
- Implement metric overview grid in `src/features/admin/pages/AdminOverviewPage.tsx`.
- Use real endpoints where available (`GET /api/v1/products`, `GET /api/v1/orders`).

## Technical Requirements
- Do NOT hardcode fake statistics.
- Display explicit "Backend API Pending" tags for non-existent admin metric endpoints.

## Existing Files/Components to Inspect
- `src/lib/api/products.ts`
- `src/lib/api/orders.ts`

## Backend Endpoints to Reuse
- `GET /api/v1/products`
- `GET /api/v1/orders`

## Backend Endpoints Missing
- `GET /api/v1/admin/overview` — **Backend support required — do not mock this.**

## Acceptance Criteria
- Renders metric cards based on real query counts where endpoints exist.
- Displays clean empty/notice cards for missing backend stats without crashing.

## Testing Requirements
- Verify API response mapping.

## Definition of Done
Builds cleanly with `npm run build`.
