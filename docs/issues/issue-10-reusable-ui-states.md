# Issue 10 — Reusable UI States Component Library

- **Priority**: High (P1)
- **Suggested Labels**: `ui`, `components`, `refactoring`, `design-system`
- **Suggested Intern Skill Level**: Junior Intern
- **Dependencies**: None
- **Estimated Difficulty**: Easy

## Description
Create standardized, reusable UI state components in `src/components/ui/` for Loading Skeletons, Empty Data Cards, Error Banners, Action Success Toast Notifications, Unauthorized Access (401), Forbidden Role (403), and Not Found (404) states.

## Why This Matters
Eliminates duplicate ad-hoc loading/error spinners across pages, providing a cohesive design system.

## Scope
- Build `LoadingSpinner.tsx`, `SkeletonCard.tsx`, `EmptyState.tsx`, `ErrorMessage.tsx`, `ForbiddenState.tsx`, `NotFoundState.tsx` in `src/components/ui/`.
- Export from `src/components/ui/index.ts`.

## Technical Requirements
- Components must be fully accessible and accept custom action buttons/messages.
- Use design system CSS variables (`var(--color-surface)`, `var(--color-primary)`).

## Existing Files/Components to Inspect
- `src/index.css`
- `src/components/ui/.gitkeep`

## Backend Endpoints to Reuse
- N/A

## Backend Endpoints Missing
- N/A

## Acceptance Criteria
- All 6 reusable components created and exported.
- Demonstrated usage across at least two major page views.

## Testing Requirements
- Render tests for each component state.

## Definition of Done
Clean compilation and zero lint warnings.
