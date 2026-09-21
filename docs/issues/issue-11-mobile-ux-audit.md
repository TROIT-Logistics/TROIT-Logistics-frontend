# Issue 11 — Mobile UX & Responsiveness Audit

- **Priority**: Medium (P2)
- **Suggested Labels**: `mobile`, `css`, `responsive`, `audit`
- **Suggested Intern Skill Level**: Junior Intern
- **Dependencies**: Issue 1, Issue 7, Issue 8
- **Estimated Difficulty**: Easy

## Description
Conduct a mobile responsiveness audit across 375px, 390px, 414px, 768px, 1024px, and 1440px+ viewports to fix layout shifts, button clipping, table overflows, and modal clipping.

## Why This Matters
Over 70% of e-commerce traffic in target pilot regions (Port Harcourt, Nigeria) operates via mobile smartphones.

## Scope
- Audit Navbar, Marketplace, Product Details, Buyer Dashboard, Seller Dashboard, Admin Dashboard, Order Tracking, and Verification pages.
- Add responsive table wrappers (`overflow-x: auto`) and touch-friendly button padding.

## Technical Requirements
- Zero horizontal scrollbar on root body element at 375px viewport width.
- Tap targets must be at least 44x44px.

## Existing Files/Components to Inspect
- `src/index.css`
- `src/components/layout/Navbar.tsx`

## Backend Endpoints to Reuse
- N/A

## Backend Endpoints Missing
- N/A

## Acceptance Criteria
- 0 horizontal page overflow at 375px width.
- All tables scroll horizontally within card wrappers rather than overflowing viewport.

## Testing Requirements
- Test with Chrome DevTools mobile emulator.

## Definition of Done
`npm run build` succeeds without CSS warnings.
