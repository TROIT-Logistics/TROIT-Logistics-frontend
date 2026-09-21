# Issue 5 — Seller Inventory Management

- **Priority**: Medium (P2)
- **Suggested Labels**: `seller`, `inventory`, `products`
- **Suggested Intern Skill Level**: Intermediate Intern
- **Dependencies**: Issue 10
- **Estimated Difficulty**: Medium

## Description
Upgrade the seller inventory management interface to support inline stock quantity adjustments, verification status tracking, and physical condition updates.

## Why This Matters
Sellers need an efficient way to keep product stock levels accurate and check verification state.

## Scope
- Build inventory table with quick search, stock update buttons, and verification status indicators.
- Add stock edit modal or inline input.

## Technical Requirements
- Use existing `GET /api/v1/products` and `POST /api/v1/products` endpoints.
- Stock updates must reflect instantly in UI state upon successful API response.

## Existing Files/Components to Inspect
- `src/pages/seller/SellerDashboardPage.tsx`
- `src/pages/seller/SellerCreateProductPage.tsx`
- `src/lib/api/products.ts`

## Backend Endpoints to Reuse
- `GET /api/v1/products`
- `POST /api/v1/products`
- `PATCH /api/v1/products/:id/verify`

## Backend Endpoints Missing
- `PATCH /api/v1/products/:id/stock` — **Backend support required — do not mock this.**

## Acceptance Criteria
- Inventory table displays real product stock, condition, and verification status.
- Clean empty state rendered when seller has no listed products.

## Testing Requirements
- Test stock adjustment submission.

## Definition of Done
Passes static code checks.
