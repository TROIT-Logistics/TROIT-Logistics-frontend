# Issue 7 — Marketplace UX & Seller Anonymity

- **Priority**: High (P1)
- **Suggested Labels**: `buyer`, `marketplace`, `privacy`, `ux`
- **Suggested Intern Skill Level**: Intermediate Intern
- **Dependencies**: Issue 10
- **Estimated Difficulty**: Medium

## Description
Enhance the buyer marketplace (`BuyerPage.tsx`) with category filtering, price range sorting, and loading skeletons, while strictly enforcing **Rule 2: Seller/Store Identity Anonymity**.

## Why This Matters
Enforces TROIT business rules that all buyer transactions are handled exclusively through TROIT payment protection, preventing off-platform seller contact.

## Scope
- Remove store name, seller name, and contact details from product cards.
- Add category filter pills (Smartphones, Laptops, Accessories, Electronics) and sorting options (Price Low-High, Price High-Low, Latest).

## Technical Requirements
- Product cards must focus on Product Name, Price, Condition, Verification Badge, Stock Count, and TROIT Escrow Protection.
- Do NOT add fake star ratings or fabricated buyer reviews.

## Existing Files/Components to Inspect
- `src/pages/buyer/BuyerPage.tsx`
- `src/lib/api/products.ts`

## Backend Endpoints to Reuse
- `GET /api/v1/products`

## Backend Endpoints Missing
- N/A

## Acceptance Criteria
- Zero seller names, store names, or contact links visible on marketplace cards.
- Category filtering and price sorting filter product list in real-time.
- Loading skeleton displayed during API fetches.

## Testing Requirements
- Audit rendered HTML DOM to confirm no seller identity attributes are exposed.

## Definition of Done
`npm run build` succeeds cleanly.
