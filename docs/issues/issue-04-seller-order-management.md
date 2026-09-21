# Issue 4 — Seller Order Management

- **Priority**: High (P1)
- **Suggested Labels**: `seller`, `orders`, `fulfillment`
- **Suggested Intern Skill Level**: Advanced Intern
- **Dependencies**: Issue 10
- **Estimated Difficulty**: Medium

## Description
Refine the seller order management dashboard in `SellerDashboardPage.tsx` so sellers can view, filter, and track fulfillment for orders belonging to products in their store inventory.

## Why This Matters
Sellers require clear visibility into pending pickups, out-for-delivery orders, and protected payment status to fulfill orders on time.

## Scope
- Display Order ID, Product Name, Quantity, Order Date, Status, Payment Status, Delivery Status.
- Add status filter tabs (All, Pending Pickup, In Transit, Delivered, Completed).

## Technical Requirements
- Results must be strictly scoped to the authenticated seller via backend responses.
- Do NOT expose buyer private contact information or direct seller-to-buyer messaging links.

## Existing Files/Components to Inspect
- `src/pages/seller/SellerDashboardPage.tsx`
- `src/lib/api/orders.ts`

## Backend Endpoints to Reuse
- `GET /api/v1/orders`
- `PATCH /api/v1/orders/:id/status`
- `POST /api/v1/orders/:id/pickup-inspection`

## Backend Endpoints Missing
- N/A (Existing endpoints cover seller order queries).

## Acceptance Criteria
- Seller order list displays accurate status badges (`CONFIRMED`, `READY_FOR_PICKUP`, `OUT_FOR_DELIVERY`, `DELIVERED`, `COMPLETED`).
- Status filter updates list view accurately.

## Testing Requirements
- Verify status patch calls and error handling.

## Definition of Done
`npm run typecheck` passes cleanly.
