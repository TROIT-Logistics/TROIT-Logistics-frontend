# Issue 8 — Product Trust & Verification UX

- **Priority**: High (P1)
- **Suggested Labels**: `buyer`, `product`, `trust`, `privacy`
- **Suggested Intern Skill Level**: Intermediate Intern
- **Dependencies**: Issue 7, Issue 10
- **Estimated Difficulty**: Medium

## Description
Refine `ProductDetailsPage.tsx` to emphasize physical inspection reports, physical condition grade, warranty terms, authenticity badges, and TROIT payment protection, while removing all direct seller contact information.

## Why This Matters
Centers buyer confidence around TROIT's physical inspection verification system rather than unverified seller claims.

## Scope
- Expand inspection report modal and verification timeline.
- Remove seller store name, seller email, seller phone, and direct messaging buttons.
- Retain mandatory trust distinction callout.

## Technical Requirements
- Use `GET /api/v1/products/:id/inspection` and `GET /api/v1/products/:id/verification`.
- Guarantee that "Grade does not represent product quality. It represents the level of trust the supplier has built with TROIT" is displayed near supplier trust badges.

## Existing Files/Components to Inspect
- `src/pages/buyer/ProductDetailsPage.tsx`
- `src/lib/api/inspections.ts`

## Backend Endpoints to Reuse
- `GET /api/v1/products/:id`
- `GET /api/v1/products/:id/inspection`
- `GET /api/v1/products/:id/verification`

## Backend Endpoints Missing
- N/A

## Acceptance Criteria
- Product details page focuses entirely on product quality, inspection notes, warranty, and TROIT protection.
- Zero seller/store identity or direct contact options exposed.

## Testing Requirements
- Verify inspection modal opens and populates report details correctly.

## Definition of Done
Zero lint and type errors.
