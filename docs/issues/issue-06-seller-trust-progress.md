# Issue 6 — Seller Trust Progress

- **Priority**: Medium (P2)
- **Suggested Labels**: `seller`, `trust`, `gamification`
- **Suggested Intern Skill Level**: Junior Intern
- **Dependencies**: None
- **Estimated Difficulty**: Easy

## Description
Create a dedicated Trust & Grade progress section in `SellerDashboardPage.tsx` displaying the seller's Trust Tier (Tier 1 to 4), Trust Grade (Grade A to D), completed transaction history, and fulfillment percentage.

## Why This Matters
Helps suppliers understand how reliable fulfillment builds platform trust and unlocks higher tier privileges.

## Scope
- Render visual trust level progress bar and grade badge.
- Display mandatory distinction notice: "*Grade does not represent product quality. It represents the level of trust the supplier has built with TROIT.*"

## Technical Requirements
- Read metrics directly from `GET /api/v1/seller/trust/history` and `GET /api/v1/seller/profile`.
- Do NOT fabricate trust scores or progress numbers.

## Existing Files/Components to Inspect
- `src/pages/seller/SellerDashboardPage.tsx`
- `src/pages/GradeExplanationPage.tsx`
- `src/lib/api/seller.ts`

## Backend Endpoints to Reuse
- `GET /api/v1/seller/profile`
- `GET /api/v1/seller/trust/history`

## Backend Endpoints Missing
- N/A

## Acceptance Criteria
- Displays seller trust tier and grade retrieved from backend.
- Grade explanation text prominently displayed.

## Testing Requirements
- Test rendering with different trust tiers.

## Definition of Done
Passes typecheck and linting.
