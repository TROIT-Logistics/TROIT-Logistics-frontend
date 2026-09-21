# Issue 3 — Admin Seller Verification

- **Priority**: High (P1)
- **Suggested Labels**: `admin`, `verification`, `seller`
- **Suggested Intern Skill Level**: Intermediate Intern
- **Dependencies**: Issue 1
- **Estimated Difficulty**: Medium

## Description
Create the admin seller verification management view (`/admin/sellers/verification`) listing seller verification requests (PENDING, UNDER_REVIEW, VERIFIED, REJECTED) with seller document inspection modals.

## Why This Matters
Enables manual verification review of business documentation by TROIT administrators.

## Scope
- Build verification review table and filter tabs.
- Integrate seller verification summary views.

## Technical Requirements
- Display seller business name, NIN/RC number, document status, submitted date.
- Connect to approval backend endpoint if available; otherwise display explicit action notices.

## Existing Files/Components to Inspect
- `src/pages/seller/SellerVerificationPage.tsx`
- `src/lib/api/seller.ts`

## Backend Endpoints to Reuse
- `GET /api/v1/seller/verification`

## Backend Endpoints Missing
- `GET /api/v1/admin/sellers/verification` — **Backend support required — do not mock this.**
- `POST /api/v1/admin/sellers/:id/verify` — **Backend support required — do not mock this.**

## Acceptance Criteria
- Verification table correctly renders status badges.
- Document modal displays submitted business verification details.

## Testing Requirements
- Test status filter tab switching.

## Definition of Done
Zero lint/typecheck errors.
