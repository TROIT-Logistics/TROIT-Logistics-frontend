# Issue 1 — Admin Dashboard Foundation

- **Priority**: High (P1)
- **Suggested Labels**: `admin`, `routing`, `foundation`, `good-first-issue`
- **Suggested Intern Skill Level**: Intermediate Intern
- **Dependencies**: None
- **Estimated Difficulty**: Medium

## Description
Create the top-level `/admin` layout shell with an `ADMIN`-only route guard, responsive sidebar navigation, mobile drawer toggle, and placeholder sub-route containers for Overview, Sellers, Products, Inspections, Orders, Trust, Users, Disputes, and Settings.

## Why This Matters
Lays the structural foundation for administrative management without modifying public or buyer/seller routes.

## Scope
- Create `AdminLayout` with sidebar navigation.
- Register `/admin/*` routes in `src/app/router/index.tsx`.
- Restrict route access strictly to users with `role === 'admin'`.

## Technical Requirements
- Sidebar must highlight active route (`useLocation`).
- Non-admin access must redirect to `/buyer` or `/seller`.
- Mobile view (<768px) must feature a collapsible hamburger drawer.

## Existing Files/Components to Inspect
- `src/app/router/index.tsx`
- `src/context/AuthContext.tsx`
- `src/components/layout/Navbar.tsx`

## Backend Endpoints to Reuse
- `GET /api/v1/auth/me`

## Backend Endpoints Missing
- N/A for layout shell.

## Acceptance Criteria
- Navigating to `/admin` as an admin renders the sidebar shell.
- Navigating to `/admin` as a non-admin redirects safely without error.
- Sidebar collapses on mobile screen viewports.

## Testing Requirements
- Verify role redirection logic.
- Test sidebar link routing.

## Definition of Done
Code passes `npm run typecheck` and `npm run lint` with zero errors.
