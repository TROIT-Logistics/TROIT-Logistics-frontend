# Issue 12 — Accessibility & UI Consistency Audit

- **Priority**: Low (P3)
- **Suggested Labels**: `a11y`, `accessibility`, `audit`, `ui`
- **Suggested Intern Skill Level**: Intermediate Intern
- **Dependencies**: Issue 10
- **Estimated Difficulty**: Medium

## Description
Perform an accessibility (a11y) audit covering keyboard focus rings (`:focus-visible`), form aria-labels, button accessible names, image alt attributes, and color contrast compliance.

## Why This Matters
Ensures the application meets modern web accessibility standards and provides keyboard navigation support.

## Scope
- Add visible focus states for all interactive elements.
- Ensure all form controls have associated `<label>` or `aria-label`.
- Ensure modal components trap keyboard focus and respond to `Escape` key.

## Technical Requirements
- Follow WAI-ARIA modal dialog patterns.
- Maintain contrast ratio of at least 4.5:1 for text elements against background colors.

## Existing Files/Components to Inspect
- `src/index.css`
- `src/components/forms/`

## Backend Endpoints to Reuse
- N/A

## Backend Endpoints Missing
- N/A

## Acceptance Criteria
- Full keyboard tab navigation possible through form fields, buttons, and modals.
- Esc key closes open modal dialogs.

## Testing Requirements
- Keyboard navigation testing.

## Definition of Done
Zero lint/typecheck errors.
