# HAEMA Blood Bank

HAEMA is a blood donation and blood request platform that connects donors, patients, hospitals, blood banks, and donation camps. It brings donor registration, eligibility screening, donation appointments, blood requests, inventory visibility, camp discovery, and blood-related education into one application.

The project is currently focused on the Phase 1 product scope: a reliable core blood-bank workflow before advanced features such as maps, administration dashboards, notifications, ratings, or gamification are added.

## Features

- Home dashboard with blood-group stock, emergency requests, key statistics, quick actions, and article previews.
- Donor profile and blood/body information management.
- Donation eligibility questionnaire with eligibility feedback before booking.
- Donation appointment booking for available camps or centers.
- Donation history and downloadable donation certificates.
- Blood requests with blood group, location, quantity, reason, urgency, and status tracking.
- Donor/blood-bank availability responses with contact information protected until a request is accepted.
- Blood inventory by blood group and camp, including update history and restock requests.
- Upcoming blood camps with search, details, booking, and calendar-event download.
- Blood articles with categories, search, article pages, and saved articles.
- User profile, account information, request history, donation history, and saved content.
- Informational pages for About, FAQs, Contact, Privacy Policy, and Terms of Service.
- Optional Windows desktop packaging through Electron.

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4 with the existing UI primitives in `components/ui`
- Clerk for authentication and user synchronization
- Neon serverless PostgreSQL for application data
- Electron for the optional Windows desktop build

## Requirements

- Node.js 20 or newer
- npm
- A Clerk application
- A Neon PostgreSQL database

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root with the following variables:

   ```env
   NEXT_PUBLIC_NEON_CONNECTION_STRING=postgresql://...
   CLERK_SECRET_KEY=sk_...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   ```

   Keep secret keys out of source control. The existing `.gitignore` excludes `.env.local`.

3. Apply the SQL migrations in `db/migrations` to the Neon database in filename order. The migrations create and extend the tables used by profiles, camps, inventory, blood requests, donation appointments, saved articles, and donor documents.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production Next.js build. |
| `npm run start` | Run the production build. |
| `npm run lint` | Run ESLint. |
| `npm run desktop:dev` | Start the Electron desktop shell in development. |
| `npm run desktop:prepare` | Build Next.js and create the standalone Electron payload. |
| `npm run desktop:build` | Build the Windows installer with Electron Builder. |

## Application routes

| Route | Description |
| --- | --- |
| `/` | Home dashboard. |
| `/donate` | Eligibility, donation history, and appointment booking. |
| `/request` | Create and track blood requests. |
| `/inventory` | View blood inventory and stock history. |
| `/camps` | Browse nearby blood camps. |
| `/camps/[camp]/book` | Register for a specific camp. |
| `/news` | Browse blood-related articles. |
| `/news/[category]/[id]` | Read an individual article. |
| `/profile` | Manage profile and account-related information. |
| `/sign-in` | Clerk sign-in flow. |

The backend endpoints are under `app/api`, grouped by domain: camps, donations, emergency requests, home data, inventory, profiles, blood requests, saved articles, and user synchronization.

## Database

Database changes are kept as ordered SQL files in `db/migrations`:

1. Link blood profiles to Clerk users.
2. Link camp bookings to Clerk users.
3. Add blood inventory.
4. Add hospital blood requests.
5. Add donor request responses and request indexes.
6. Add donation appointments, inventory history, restock requests, and saved articles.
7. Add donor documents.

Run migrations against a development database first and verify the application before applying them to production. The application reads the database connection from `NEXT_PUBLIC_NEON_CONNECTION_STRING`.

## Project structure

```text
app/          Pages, layouts, route handlers, and API endpoints
components/   Shared UI and feature components
constants/    Shared application constants
db/           Ordered PostgreSQL migrations
docs/         Feature and operational documentation
functions/    Client-side helpers and domain utilities
lib/          Shared data, content, and server helpers
public/       Images, icons, and other static assets
types/        Shared TypeScript types
electron/     Windows desktop entry point and packaging helpers
```

## Privacy and safety

HAEMA supports coordination between people who need blood and people who can help. It does not replace medical advice, blood-bank screening, or hospital transfusion procedures. Donation eligibility shown in the application is guidance; final eligibility must be determined by qualified staff at the donation center.

Blood-request contact details must remain hidden until the relevant request response is accepted. Authorization, eligibility, privacy, and status transitions must be enforced on the server as the application evolves.

## Development guidelines

- Keep new work within the Phase 1 scope until the existing core workflows are complete and stable.
- Reuse the established components, tokens, validation patterns, and status semantics.
- Keep shared domain types in `types` rather than redeclaring unions inside pages.
- Add or update tests when behavior changes and run lint and a production build before submitting changes.
- Never commit `.env.local` or other credentials.

## Project status

The repository contains the Phase 1 foundation and active feature work. The implementation should be treated as an evolving project rather than a finished production blood-bank service. Review the route handlers, database migrations, and UI flows before deploying or connecting real patient and donor data.
