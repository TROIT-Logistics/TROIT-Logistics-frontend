# Issue 9 — Buyer Order Experience

- **Priority**: High (P1)
- **Suggested Labels**: `buyer`, `orders`, `escrow`, `tracking`
- **Suggested Intern Skill Level**: Advanced Intern
- **Dependencies**: Issue 4, Issue 10
- **Estimated Difficulty**: Hard

## Description
Upgrade `OrderDetailsPage.tsx` and `BuyerOrdersPage.tsx` to provide clear escrow payment state indicators (`PROTECTED`, `RELEASED`), delivery tracking step progress, and confirmation modals.

## Why This Matters
Ensures buyers have transparent visibility into order fulfillment and escrow payment release.

## Scope
- Display order status timeline (`CONFIRMED` -> `READY_FOR_PICKUP` -> `OUT_FOR_DELIVERY` -> `DELIVERED` -> `COMPLETED`).
- Provide "Confirm Delivery" action invoking `POST /api/v1/orders/:id/confirm-delivery`.
- Display Stellar Explorer link ONLY when a valid, non-null backend transaction hash exists.

## Technical Requirements
- Do NOT generate fake transaction hashes or fake payment confirmations.
- Explicitly state "TROIT Protected Escrow" on order summaries.

## Existing Files/Components to Inspect
- `src/pages/buyer/OrderDetailsPage.tsx`
- `src/pages/buyer/BuyerOrdersPage.tsx`
- `src/lib/api/orders.ts`

## Backend Endpoints to Reuse
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`
- `GET /api/v1/orders/:id/history`
- `POST /api/v1/orders/:id/fund`
- `POST /api/v1/orders/:id/confirm-delivery`

## Backend Endpoints Missing
- N/A

## Acceptance Criteria
- Delivery confirmation successfully triggers API endpoint and updates escrow status to `RELEASED`.
- Timeline clearly shows real order history timestamps.

## Testing Requirements
- Test order status progression and confirmation button trigger.

## Definition of Done
`npm run typecheck` passes 100%.
