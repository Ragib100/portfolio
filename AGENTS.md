# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex CLI, Gemini CLI, Cursor, etc.) working in this repository.
Read this file fully before making changes. The detailed product plan is in `portfolio-project-plan.md`; if the two ever disagree, ask the owner before proceeding.

---

## 1. Project Summary

A personal portfolio website for a CSE undergraduate and competitive programmer.

- **Public route `/`:** a single-page portfolio (hero, stats, about, skills, projects, competitive programming, experience, GitHub, contact).
- **Private route `/admin`:** login-protected dashboard where the owner edits all content and views analytics (including CV views and downloads).
- **One owner only.** There are no public accounts, comments, or public login.

## 2. Tech Stack

| Area | Choice |
|---|---|
| Framework | Next.js (App Router, current stable 16.x) with TypeScript (strict) |
| Styling | Tailwind CSS; shadcn/ui for admin components; Motion for light animation |
| Auth | Firebase Auth (Google sign-in) + server-side session cookie + email allowlist |
| Database | Firestore, accessed **only on the server** via the Firebase Admin SDK |
| Files | Cloudinary (signed uploads from an admin-only route) |
| Hosting | Vercel (Hobby). The Vercel project is created at the end; develop locally first |
| Validation | Zod (shared between forms and server) |
| Forms | React Hook Form |
| Charts | Recharts |
| Tests | Vitest (unit), Firebase Emulator Suite (integration), Playwright (E2E) |

Frontend and backend are the same Next.js app: route handlers and server actions are the backend. There is no separate server.

## 3. Verify, Don't Assume

Framework APIs change between versions. Before using an API from memory (especially Next.js caching, `revalidateTag`, `middleware`/`proxy`, `next/image`, Firebase Admin, Cloudinary SDK), check the installed version's official docs or type definitions. In Next.js 16 the `middleware` convention was renamed to `proxy`; confirm the current file name and runtime in the docs before using it.

## 4. Commands

The repository may not be scaffolded yet. Use the package manager indicated by the lockfile (if starting fresh, use `pnpm`). Once scaffolded, these scripts should exist; if one is missing, add it to `package.json` and update this section.

```bash
pnpm dev            # start dev server on http://localhost:3000
pnpm build          # production build
pnpm start          # run the production build
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
pnpm test           # Vitest unit tests
pnpm test:e2e       # Playwright tests
pnpm emulators      # Firebase Emulator Suite (Auth + Firestore)
```

Before declaring any task done, run `pnpm lint`, `pnpm typecheck`, and the relevant tests. Fix failures rather than disabling checks.

## 5. Repository Layout

```
src/
  app/
    (public)/
      page.tsx                  # "/"
      projects/[slug]/page.tsx  # optional project detail pages
    admin/
      login/page.tsx
      (protected)/              # layout.tsx verifies the session server-side
        page.tsx                # dashboard
        contests/ projects/ experience/ skills/ profile/ contact/ cv/ integrations/ media/
    api/
      auth/session/route.ts     # create/destroy session cookie
      track/route.ts            # analytics beacon
      upload/sign/route.ts      # Cloudinary signed-upload params (admin only)
    cv/route.ts                 # logs CV hit, then redirects to the active CV
    sitemap.ts  robots.ts  opengraph-image.tsx
  components/
    public/  admin/  ui/
  lib/
    firebase/ (admin.ts, client.ts)
    cloudinary/ (server.ts, loader.ts)
    auth/ (session.ts, guard.ts)
    data/ (queries.ts, mutations.ts)   # ALL Firestore access lives here
    integrations/ (github.ts, codeforces.ts)
    analytics/ (track.ts, aggregate.ts)
    validation/ (schemas.ts)           # Zod schemas
    site.ts                            # SITE_URL and shared constants
  types/
```

Keep this structure. If you need to deviate, say why in the PR/commit description.

## 6. Architecture Rules

1. **Firestore is server-only.** Never import the Admin SDK in client components. The Firebase client SDK is used only for Google sign-in on the login page. Firestore security rules deny all client reads and writes.
2. **All Firestore access goes through `src/lib/data/`.** Components and route handlers call these functions; they do not call Firestore directly.
3. **Public page is cached and tag-revalidated.** Queries for the public page are cached with tags (`profile`, `contact`, `contests`, `projects`, `skills`, `experience`, ...). Every admin mutation must call `revalidateTag` (or the current equivalent) for the tags it affects.
4. **External API data is cached.** GitHub and Codeforces responses are fetched server-side, cached (about 1 hour for GitHub, a few hours for Codeforces), and fall back to the last saved copy in the `cache` collection on failure. The UI must handle API failure gracefully.
5. **Validate everything.** Every server action and route handler parses its input with Zod. Never trust client data.
6. **Server Components by default.** Use `"use client"` only where interactivity requires it.
7. **Admin pages are dynamic and `noindex`.** Never cache `/admin/*`.

## 7. Security Rules (non-negotiable)

- **Never commit secrets.** `.env*`, service-account JSON files, and API keys stay out of Git. Check `.gitignore` before adding files. If you see a secret in the repo, stop and tell the owner.
- **Admin auth flow:** client signs in with Google, sends the ID token to `/api/auth/session`, the server verifies it with the Admin SDK, checks the email against `ADMIN_EMAILS` (and optionally an `admin` custom claim), then sets an `httpOnly`, `secure`, `sameSite=lax` session cookie with limited lifetime.
- **Verify the session in three places:** the routing guard (if used), the `/admin/(protected)/layout.tsx`, and **inside every server action and admin route handler**. A routing guard alone is not enough.
- **Cloudinary:** the API secret stays server-side. Uploads use signatures generated by `/api/upload/sign`, which requires a valid admin session.
- **Rate-limit** `/api/track` and auth endpoints.
- **Sanitize** any markdown/HTML from admin content before rendering.
- **Security headers:** CSP (allowing Cloudinary images), `X-Content-Type-Options`, `Referrer-Policy`.
- **Analytics privacy:** never store raw IP addresses. Use `hash(IP + userAgent + dailySalt)` for visitor identity. Skip tracking when the admin session cookie is present. Ignore known bots.
- **Never expose** `FIREBASE_PRIVATE_KEY`, `CLOUDINARY_API_SECRET`, or `GITHUB_TOKEN` to the browser. Only `NEXT_PUBLIC_*` variables are browser-safe.

## 8. Privacy Rules for Content (owner decision)

- **Do not add any teammate information** anywhere: no teammate names, avatars, profile links, or fields in schemas, forms, or UI. Contests may store an optional `teamName` only. Projects show the owner's own `role` and a boolean `isTeamProject`.
- Prefer links that the owner controls (own certificates or posts) over external standings pages that may list teammates.
- Contact details (email, phone, LinkedIn, Facebook) each have a per-item **visibility toggle**. Respect it everywhere they are rendered.

## 9. Data Model (Firestore)

Add `createdAt`, `updatedAt`, `published`, and `order` where relevant.

| Collection / doc | Purpose |
|---|---|
| `site/profile` | Name, tagline, bio, photo URL, location, availability, SEO fields, accent color |
| `site/contact` | `email`, `phone?`, `location?`, `links[]` (`platform`, `label`, `url`, `iconKey`, `visible`, `order`), `showEmail`, `showPhone`. Initial items: email, phone, LinkedIn, Facebook |
| `skills/{id}` | `category`, `name`, `iconKey`, `order` |
| `projects/{id}` | `title`, `slug`, `summary`, `description` (markdown), `images[]`, `stack[]`, `links{live,code}`, `role`, `isTeamProject`, `status`, `startDate`, `endDate`, `featured`, `published`, `order` |
| `contests/{id}` | See type below |
| `experience/{id}` | `type` (work / club / education), `organization`, `title`, `start`, `end`, `description`, `highlights[]`, `link`, `order` |
| `cvFiles/{id}` | `label`, `cloudinaryPublicId`, `url`, `isActive`, `uploadedAt`, `downloadCount` |
| `events/{id}` | Raw analytics events |
| `stats/daily/days/{yyyy-mm-dd}` | Daily aggregates: `views`, `uniques`, `cvViews`, `cvDownloads` |
| `cache/{key}` | Cached external API responses with `fetchedAt` |

```ts
type ContestCategory =
  | "icpc-preliminary" | "icpc-regional" | "iupc" | "iaupc" | "hackathon" | "other";

interface Contest {
  id: string;
  category: ContestCategory;
  name: string;
  organizer?: string;
  date: string;               // ISO date, used for sorting
  year: number;
  mode?: "onsite" | "online";
  teamName?: string;          // team name only; no member details
  rank?: number;
  totalParticipants?: number; // percentile computed in code, not stored
  solved?: number;
  totalProblems?: number;
  prize?: string;
  links?: { label: string; url: string }[];
  notes?: string;
  featured: boolean;
  published: boolean;
}
```

Compute on read, not stored: `percentile = rank / totalParticipants`, category totals.

## 10. Analytics and CV Tracking

- Page views: a small client component sends `navigator.sendBeacon("/api/track", ...)` once per page load.
- CV downloads: the CV button links to `/cv`. The route handler logs the event, then redirects to the active CV's Cloudinary URL. Never link visitors directly to the Cloudinary URL.
- Each tracked event is written once to `events` and also increments the daily counters in `stats/daily/days/{date}` with `FieldValue.increment`. The dashboard reads the daily docs, not raw events.
- Uniques: create `visitors/{hash}` under that day only if it does not exist, then increment `uniques`.
- Country comes from Vercel request headers; do not call a geo-IP service.
- Keep write volume low (Firestore free tier is roughly 20K writes/day); dedupe and rate-limit.

## 11. Cloudinary Rules

- Upload flow: browser requests signed params from `/api/upload/sign` (admin session required), uploads directly to Cloudinary, then the returned `public_id` and `secure_url` are stored in Firestore.
- Use folders `portfolio/projects`, `portfolio/cv`, `portfolio/profile`.
- Serve images through `next/image` with a Cloudinary loader or `images.remotePatterns` for `res.cloudinary.com`.
- Cloudinary may block PDF delivery by default; if the CV does not load, check that setting in the Cloudinary console before changing code.

## 12. Design Guidelines (minimal and professional)

- Neutral base (near-white / near-black) with **one accent color**: indigo, `#4f46e5` (light) and `#818cf8` (dark). Define all colors as CSS variables (design tokens); never hard-code hex values in components.
- Light and dark themes following `prefers-color-scheme`, with a manual toggle. Both must be polished.
- One clean sans-serif family (e.g., Inter or Geist) for headings and body; a mono font only for small accents (ranks, dates, tags).
- Generous whitespace, thin borders, soft card surfaces, a single centered column with a max width. No gradients, neon, or decorative stock art.
- Subtle motion only (fade/slide on scroll, gentle hover). Respect `prefers-reduced-motion`.
- Mobile-first, responsive, accessible: semantic headings, visible focus states, AA contrast, alt text, keyboard-navigable tabs.
- **Stats and counters must render real values on the server** (not animate from 0 on the client), so they work without JavaScript and for crawlers.
- If no profile photo is set, show a circular avatar with the owner's initials on the accent color. A temporary photo is acceptable for now.

## 13. Coding Conventions

- TypeScript strict; no `any` without a comment explaining why. Prefer inferred types from Zod schemas (`z.infer`).
- Small, focused components and functions. Name files and exports clearly; use `kebab-case` for files and `PascalCase` for components.
- Keep business logic (percentile calculation, aggregation, mapping) in plain functions under `src/lib/` so it can be unit-tested.
- Handle loading, empty, and error states in the UI. Show friendly messages; never leak internal error details to users.
- No new dependencies without a clear reason; prefer what is already in the stack. If you add one, mention it and why.
- Keep comments for the "why," not the "what."
- English only. No i18n setup.
- Commit in small, logical steps with clear messages (for example `feat(admin): add contests form`).

## 14. Environment Variables

Never print or commit real values. Keep `.env.example` updated with names only.

```
# Firebase (server)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=              # on Vercel, preserve/escape newlines correctly

# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin and session
ADMIN_EMAILS=
SESSION_COOKIE_NAME=__session_admin
ANALYTICS_SALT=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Integrations
GITHUB_TOKEN=                      # server-only, read-only public scope

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # becomes the vercel.app (or custom domain) URL at launch
```

Always read the site URL from `NEXT_PUBLIC_SITE_URL` (via `src/lib/site.ts`) for canonical links, Open Graph, sitemap, and JSON-LD. Never hard-code a domain.

## 15. Local Development Notes

- Use the Firebase Emulator Suite for Auth and Firestore during development and tests; do not write test data to the real project.
- Google sign-in works on `localhost` only until the production domain is added to Firebase **Authorized domains**. Firebase authorized domains do not accept wildcards, so random Vercel preview URLs will not support sign-in.
- The Vercel project does not exist yet; do not add Vercel-specific config that requires it. Keep the app deployable with standard `next build`.

## 16. Current Status and Roadmap

Already done by the owner: GitHub repo, Firebase project, Cloudinary account. Vercel project is created at launch.

| Phase | Scope |
|---|---|
| 1. Foundation | Scaffold Next.js + TS + Tailwind + shadcn/ui; Firebase Admin/client setup; emulators; Google sign-in, allowlist, session cookie; protected admin layout; design tokens and theme |
| 2. Data and admin CRUD | Zod schemas; Firestore queries/mutations; Cloudinary signed upload; admin forms for profile, contact, skills, experience, contests, projects; draft/published; ordering; tag revalidation |
| 3. Public portfolio | Hero, stats, about, skills, projects (+ detail pages), contests by category, experience timeline, contact (from `site/contact`), footer; responsive + accessibility pass |
| 4. Integrations and tracking | GitHub featured repos; Codeforces card and rating chart; CV manager and `/cv` route; `/api/track` and daily counters |
| 5. Dashboard and polish | Dashboard KPIs and charts; SEO (metadata, OG image, sitemap, JSON-LD); performance; security checklist; tests and CI |
| 6. Launch | Real content; deploy on Vercel; add the `vercel.app` hostname to Firebase Authorized domains; set `NEXT_PUBLIC_SITE_URL`; verify admin login, analytics, and CV tracking in production |

Work on one phase at a time and keep each change reviewable. Phase 1 is "done" when the owner can sign in at `/admin` and a non-allowlisted Google account cannot.

## 17. Definition of Done (for any task)

- [ ] Works locally against the emulators (or real project, if the task requires it) with no console errors
- [ ] `lint`, `typecheck`, and relevant tests pass
- [ ] Inputs validated with Zod; session verified in every admin action
- [ ] Public-page changes revalidate the correct cache tags
- [ ] Loading, empty, and error states handled; responsive and keyboard accessible
- [ ] No secrets, no teammate info, no raw IPs stored
- [ ] `.env.example` and this file updated if configuration or conventions changed

## 18. When to Stop and Ask the Owner

- Anything that would change a decision recorded in `portfolio-project-plan.md` (stack, hosting, storage, privacy rules, design direction)
- Any action that needs real credentials, billing, or a paid plan (for example Firebase Blaze)
- Deleting data, rewriting Git history, or force-pushing
- Adding a public-facing feature not in the plan (for example a contact form, blog, or auth for visitors)
- A security trade-off or anything that weakens the rules in section 7