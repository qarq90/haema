# AGENTS.md

This file provides guidance to AI agents and developers working on this codebase. **Before making any changes, read this entire document carefully.**

---

## 0. Project Context

A **Blood Bank Management System** — a web app connecting donors, recipients, blood banks, and camps.

Features are organized in **3 phases**:

- **Phase 1 (MUST-HAVE)** — current focus. Build all of this first to have a working app.
- **Phase 2 (Advanced)** — add after Phase 1 is complete and stable.
- **Phase 3 (Show-off)** — optional, only pick 2–3 features if time permits.

**Do NOT start Phase 2 or Phase 3 features until all of Phase 1 is fully working, tested, and reviewable.** If a request implies a Phase 2/3 feature, confirm with the user before implementing.

### Phase 1 Scope (Build This First)

1. **Home Page** — live stock counter (all 8 groups), emergency request ticker, quick actions (Find Blood / Become Donor / Find Camps), key stats (donors / requests fulfilled / camps), latest articles preview.
2. **Register as Donor** — personal info form, medical history questionnaire, eligibility checker (auto-block if ineligible), photo + ID upload, T&C acceptance.
3. **Donate Blood** — eligibility check before proceeding, schedule appointment (date/time/center), donation history, PDF certificate download, nearest centers.
4. **Request Blood** — search filters (group/city/quantity), available donors/blood banks list, **privacy: hide contact until request accepted**, place request with reason, track status (Pending / Approved / Fulfilled / Rejected).
5. **Blood Inventory** — stock levels by group, filter by city, critical stock alerts (red if < 5 units), stock update history (who + when), request restock.
6. **Blood Camps Nearby** — upcoming camps list (date/venue/organizer), search by city/pincode, camp details, register for camp, add to calendar/reminder.
7. **Blood Articles** — listing with categories (Health Tips / Myths / Donor Stories), search + filter, full article with images, save/bookmark, share.
8. **User Profile** — view/edit details, change password, donation history, request history, saved articles, account deactivation.

> Anything not listed above is out of scope for Phase 1. Do not silently add Phase 2/3 behavior (e.g., SOS, maps, admin panel, ratings, gamification) to Phase 1 features — design Phase 1 features so they can _extend_ later, but don't build them now.

---

## 1. Understand the Context First

Before writing a single line of code, take time to understand:

- **What this app does** — read the README, explore the main entry points, and trace the core user flows for the Phase 1 feature you're touching.
- **Domain model** — understand the core entities and their relationships: `User` (Donor / Hospital / Blood Bank / Admin), `DonorProfile`, `BloodGroup`, `BloodStock`, `DonationAppointment`, `BloodRequest`, `BloodCamp`, `Article`, `SavedArticle`. Know how they relate before changing schema or APIs.
- **Architecture & structure** — identify the tech stack, folder layout, routing, state management, API layer, and build tooling.
- **Existing patterns** — find a similar Phase 1 feature already implemented and follow its structure (e.g., model a new page on an existing one). **Do not invent new patterns** when an established one exists.
- **Scope of change** — understand which files/modules are relevant. Avoid touching unrelated code.
- **Dependencies & constraints** — check `package.json` (or equivalent) before adding libraries. Prefer existing dependencies over new ones.

> **Rule:** If you don't understand _why_ something works the way it does, investigate before modifying it. Ask questions if context is unclear rather than guessing.

---

## 2. Understand the UI Style

Match the existing design language exactly. Consistency is more important than personal preference.

- **Design system** — use existing components, tokens, and primitives (buttons, inputs, cards, modals, tables) instead of building new ones.
- **Styling approach** — follow the established method (e.g., Tailwind utility classes, CSS Modules, styled-components, SCSS). Do not mix approaches.
- **Design tokens** — use existing color, spacing, typography, radius, and shadow tokens. **Never hardcode colors, font sizes, or spacing values** that already exist as tokens. Blood-group badges and **critical-stock alerts (red, <5 units)** must use existing semantic tokens — don't introduce ad-hoc reds.
- **Typography** — follow the established font family, weights, and size scale.
- **Spacing & layout** — respect the existing grid, spacing scale, and responsive breakpoints.
- **Component composition** — follow existing composition patterns (how forms, lists, empty states, and status badges are built). Reuse the existing status-badge pattern for `Pending / Approved / Fulfilled / Rejected`.
- **Status & alert semantics** — use consistent colors/tones for states across the app (success, warning, danger, info). Stock alerts, request statuses, and eligibility warnings must follow the same visual language.
- **Accessibility** — preserve semantic HTML, ARIA attributes, keyboard navigation, and focus states. New UI must be accessible.
- **Responsive design** — ensure changes work across supported screen sizes.
- **Interaction & motion** — match existing hover, focus, loading, and transition behaviors.
- **Dark mode / theming** — if supported, all new UI must work in every theme.
- **Privacy in UI** — for the Request Blood flow, **contact details must be masked/hidden in the UI** until a request is accepted. Never render contact info in the DOM before that point.

> **Rule:** When building new UI, find the closest existing example and mirror it. If you must deviate, document why.

---

## 3. Understand the Code Style

Write code that looks like it was written by the same team. Readability and consistency come first.

- **Language & conventions** — follow the language's idioms and the project's ESLint/Prettier/tsconfig rules. Run linters and formatters before finishing.
- **Type safety** — use TypeScript strictly. Avoid `any`; prefer explicit types, proper generics, and narrowing. Model domain types (`BloodGroup`, `RequestStatus`, `DonationStatus`) as shared types/unions — do not redeclare them inline.
- **Naming** — follow existing conventions for files, folders, components, hooks, variables, and constants. Use the same names as the domain (e.g., `BloodRequest`, not `Req`).
- **File & folder structure** — place new files where similar files already live. Keep the existing organizational pattern (feature-based or layer-based). Each Phase 1 feature should map to its own feature folder/page.
- **Components** — prefer small, focused, reusable components. Keep presentational and container logic separated as the codebase does. Reusable pieces (BloodGroupBadge, StatusBadge, StockAlert, EligibilityCheck) should be shared, not duplicated per page.
- **State management** — use the project's existing state solution (e.g., React Query, Redux, Zustand, Context). Do not introduce a new one.
- **Data fetching** — follow existing patterns for API calls, error handling, loading states, and caching.
- **Forms & validation** — use the existing form/validation approach. Donor registration, medical questionnaire, and request forms must validate consistently (shared schema, not ad-hoc checks).
- **File uploads** — follow the existing upload pattern for photo + ID proof; validate type/size on client and enforce on server.
- **Auth & authorization** — enforce role checks server-side. **Never trust the client** for eligibility, privacy masking, or status transitions.
- **Eligibility logic** — implement the eligibility checker once, in a shared utility/service, and reuse it across registration, donation scheduling, and profile. Do not duplicate the rules.
- **PDF & exports** — donation certificates should follow an existing PDF/export pattern; keep the implementation isolated behind a service function.
- **Error handling** — handle errors consistently with the rest of the app. No silent failures.
- **Comments** — write comments only when the _why_ isn't obvious. Match existing comment style.
- **Imports** — follow existing import ordering and use path aliases if configured.
- **No dead code** — remove unused imports, variables, and files you introduce. Do not leave commented-out code.
- **Tests** — add or update tests following existing test patterns and file locations. Ensure the test suite passes.
- **Small, focused changes** — keep diffs minimal and reviewable. Avoid unrelated refactors in the same change. One Phase 1 feature per PR/change where possible.

> **Rule:** Before finishing, verify your change is indistinguishable in style from the surrounding code.

---

## Checklist Before Submitting

- [ ] The change is within **Phase 1 scope** (or explicitly confirmed to be Phase 2/3).
- [ ] I understand the feature's context and followed existing patterns.
- [ ] UI matches the design system, status/alert semantics, and is accessible + responsive.
- [ ] Contact details stay hidden until a blood request is accepted.
- [ ] Eligibility rules are reused, not reimplemented.
- [ ] Code passes lint, type checks, and formatting.
- [ ] Tests pass; new behavior is covered.
- [ ] No hardcoded values, unused code, or unrelated changes.
- [ ] Diff is small, focused, and easy to review.

**When in doubt, mirror the existing codebase. Build Phase 1 completely before touching Phase 2. Consistency beats cleverness.**
