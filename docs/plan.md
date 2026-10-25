# Portfolio Project: Full Plan (v2)

**Stack:** Next.js (frontend + backend) and Firebase (Auth, Firestore)
**Hosting:** Vercel | **File storage:** Cloudinary | **Language:** English only | **Design:** minimal and professional
**Routes:** `/` (public portfolio) and `/admin` (private dashboard and editor)
**Owner profile:** CP for a couple of years; 2 ICPC prelims, 2 ICPC Dhaka Regionals, 2 IUPC, 1 IAUPC, 2 hackathons; 5 projects (1 ongoing); industrial training at DSI; MIST Computer Club: mentor team (2nd year), executive panel (3rd year), presidential panel as Treasurer (4th year)

---

## Decisions Log (settled)

| # | Question | Decision | Consequence for the plan |
|---|---|---|---|
| 1 | File storage | **Cloudinary** | Images and the CV PDF are uploaded from admin to Cloudinary; Firebase Storage is not used, so the project stays on the free Spark plan |
| 2 | Hosting | **Vercel** (Hobby plan) | Free hosting, Git-based deploys; uses the default `*.vercel.app` URL until a domain is bought |
| 3 | Contact | **Contact info is stored in the database; the frontend fetches it** | A `site/contact` Firestore document, editable in admin, rendered on the public page. No contact form or inbox in v1 (see section 4) |
| 4 | Design | **Minimal and professional** | Restrained palette, strong typography, lots of whitespace, subtle motion only (see section 3.2) |
| 5 | Domain | **None for now** | Launch on `<project-name>.vercel.app`; the site URL is a single env variable so a custom domain is a small change later (see section 13) |
| 6 | Language | **English only** | No i18n setup; Bangla support removed from the backlog |
| 7 | Teammates' privacy | **Do not show teammates' info** | No teammate names, avatars, or profile links anywhere (see sections 5 and 10) |
| 8 | Project name | **Tentatively `portfolio`** (not a priority right now) | Used as the working repo and Vercel project name; the name can be changed later (see section 13) |
| 9 | Initial contact items | **Phone number, email, LinkedIn, Facebook** | Seeded as the first four items in `site/contact` (see section 3.4) |
| 10 | Accent color | **Any fitting color for now: indigo** | Indigo `#4f46e5` (light theme) and `#818cf8` (dark theme), set as CSS variables so it can be swapped in one place (see section 3.2) |
| 11 | Profile photo | **Temporary photo for now** | A placeholder is used at launch; the photo field in admin lets you swap it later with no code change (see section 3.5) |

---

## 0. TL;DR: Key Technical Choices

| Topic | Recommendation | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | 16.x is the current Active LTS line |
| Styling | Tailwind CSS + shadcn/ui (admin) + Motion (light animations) | Fast to build, consistent design tokens |
| Auth | Firebase Auth (Google sign-in) with an **allowlist** + server session cookie | Only you can log in; no passwords to manage |
| Database | Firestore, accessed **only from the server** (Firebase Admin SDK) | Simplest and safest; rules can deny all client access |
| Hosting | **Vercel Hobby** + Firebase Spark | Entire project can be free |
| Files | **Cloudinary** (free tier) via signed server-side uploads | Admin can upload without Firebase Storage's billing requirement |
| Public page data | Server-rendered and cached, revalidated when you save in admin | Fast, SEO-friendly, very few Firestore reads |
| CV tracking | `/cv` route handler that logs the hit, then redirects to the Cloudinary file | Counts real downloads, not just clicks |
| Analytics | Own lightweight, privacy-friendly tracking in Firestore with daily counters | Dashboard stays cheap to load |
| External data | GitHub API (repos, optional contribution graph) and Codeforces API (rating, solved) | Live, no manual updating |

> **Why not Firebase Storage?** Since February 3, 2026, Cloud Storage for Firebase requires the Blaze plan (a linked billing account) even within the free allowance. Auth and Firestore still work on Spark, so using Cloudinary for files keeps the whole project card-free.

---

## 1. Goals and Non-Goals

### Goals
1. A polished, fast, professional public portfolio that shows competitive programming, projects, experience, and leadership clearly.
2. An admin panel where **all content is editable without touching code** (contests, projects, roles, skills, contact info, CV).
3. Basic analytics, especially **CV views/downloads**, plus visits, referrers, and countries.
4. A foundation that is easy to extend (blog, certificates, auto-generated CV, and so on).

### Non-goals (for v1)
- Multi-user admin or roles (single owner only)
- Public contact form, comments, user accounts, or any public login
- Multi-language support
- Heavy third-party analytics

---

## 2. What to Learn from the Reference Portfolio

Taken from the senior's portfolio (inspiration, not a template to copy):

| Idea in the reference | Keep / Improve |
|---|---|
| Hero with name, short tagline, social icons, "View My CV" button | Keep. Add a clearer one-line value statement and a small status chip (e.g., "Final-year CSE student") |
| Skills as an icon grid | Keep, but **group** by category (Languages, Web, Databases, Tools) |
| Project cards: image, duration, stack icons, Live / Code / Details | Keep. Add detail pages and "featured" flags. **Drop teammate avatars** (privacy decision) and instead show your role and a simple "Team project" label |
| Achievements: stat counters, key highlights, full contest table with standings links | Keep, with **real numbers rendered on the server** (the reference's counters showed 0 until JavaScript ran, which hurts SEO and no-JS readers). **Omit team member names** |
| Experience timeline (education, work, volunteer) | Keep. Your club journey (mentor, executive, Treasurer) fits naturally as a **progression timeline** |
| GitHub analytics and Codeforces stats sections | Keep, but cache results and degrade gracefully if an API is down |
| Rank shown as "#N out of M" with a "top X%" badge | Keep. Compute the percentile automatically in code |

Where to look for more inspiration (to browse yourself; no specific pages were pulled for this plan): "awesome portfolio" lists on GitHub, developer-portfolio collections on Awwwards or Dribbble, and the shadcn/ui and Tailwind UI example galleries. For a minimal and professional look, focus on: clean typography, a restrained palette, consistent spacing, and subtle hover and scroll effects.

---

## 3. Public Portfolio (`/`) Design

### 3.1 Sections (in order)

1. **Hero:** name, role line (e.g., "CSE undergraduate · Competitive programmer · Full-stack developer"), 1-2 sentence intro, CTA buttons (View CV, Contact), social icons, photo.
2. **Quick stats strip:** Codeforces rating/rank, problems solved, contests participated, ICPC appearances, projects shipped. All values come from the database or the Codeforces API.
3. **About:** short story (CP journey, interests), plus 3-4 highlight cards (e.g., "Treasurer, MIST Computer Club").
4. **Skills:** grouped chips or icons (Languages, Frontend, Backend, Databases, Tools).
5. **Projects:** featured grid (5 projects, one marked "In progress"), filter by tech, link to detail pages.
6. **Competitive Programming:**
   - Codeforces card (handle, current and max rating, rating graph, solved count)
   - **Contest achievements by category** (tabs or segmented control): ICPC Preliminary, ICPC Regional, IUPC, IAUPC, Hackathons, Other
   - "Top highlights" strip with the best results
7. **Experience:** timeline with three tracks: Work/Training (DSI industrial training), Club leadership (Mentor, Executive, Treasurer), Education.
8. **GitHub:** featured repos (stars, language, description) and optionally the contribution graph.
9. **Contact:** email, social links, and any other details you choose to show. **All fetched from the `site/contact` document in Firestore** (see 3.4).
10. **Footer:** links, copyright, "last updated" date.

### 3.2 Visual Direction: Minimal and Professional
- **Palette:** neutral base (near-white / near-black) with **one accent color**. Avoid gradients and neon effects. Define everything as CSS variables (design tokens) so the palette can change in one place.
- **Accent (temporary choice):** indigo, `#4f46e5` on the light theme and the lighter `#818cf8` on the dark theme. Indigo reads as calm and professional, and both shades should meet AA contrast against their backgrounds (verify with a contrast checker once real surfaces are in place). Because the accent is a token (and editable in admin settings), changing it later is a one-line edit.
- **Theme:** light and dark, following `prefers-color-scheme`, with a manual toggle. Both themes must feel equally polished.
- **Typography:** one clean sans-serif family (for example Inter or Geist) for headings and body, with a mono font reserved for small accents such as ranks, dates, and tags. Clear type scale and generous line height.
- **Layout:** a single centered column with max-width, plenty of whitespace, thin borders, and soft card surfaces. A simple top bar with scroll-spy highlighting the active section.
- **Motion:** subtle fade/slide on scroll and gentle hover states only; honor `prefers-reduced-motion`.
- **Imagery:** one good professional photo, crisp project screenshots in consistent frames, and no decorative stock art.
- **Responsiveness:** mobile-first; recruiters often open links on phones.
- **Accessibility:** semantic headings, visible focus states, AA color contrast, alt text, keyboard-navigable tabs.

### 3.3 Performance and SEO targets
- Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO (mobile)
- Next.js `Metadata` API, dynamic Open Graph image, `sitemap.xml`, `robots.txt`, and **JSON-LD `Person` schema**
- Optimized images (`next/image` with Cloudinary configured as an allowed remote host), fonts via `next/font`
- Public page is **statically cached** and revalidated on admin save (tag-based revalidation)

### 3.4 Contact data flow
1. In admin, you edit contact details (email, optional phone, location, links to LinkedIn, GitHub, Codeforces, etc.). Each item has a **"visible on public page"** toggle, so you decide exactly what is shown.
2. Saved to the Firestore document `site/contact`.
3. The public page's server code fetches this document through a cached query tagged `"contact"`. Saving in admin revalidates that tag, so changes go live in seconds.
4. The hero social icons and the Contact section both read from this single source, so they never disagree.

**Initial contact items (v1):**

| Item | Type | Shown publicly | Notes |
|---|---|---|---|
| Email | `mailto:` link | Yes | Primary contact method |
| Phone number | `tel:` link | Yes (your choice) | Publishing a phone number invites spam calls and scraping; the per-field visibility toggle lets you hide it any time without a deploy. Consider showing it only in the Contact section, not the hero |
| LinkedIn | Profile URL | Yes | Shown as an icon in the hero and in the Contact section |
| Facebook | Profile URL | Yes | Check that the profile's privacy settings are what you want recruiters to see |

GitHub and Codeforces already have their own sections on the page (repos and ratings), so they are not duplicated in the contact list for now. You can add them (or any other platform) later from the admin Contact module with no code change.

### 3.5 Temporary profile photo
- Launch with a temporary image: any decent casual photo, or a neutral placeholder.
- Build the hero photo component so that if no photo is set, it falls back to a **circular avatar with your initials** on the accent color. The site then looks intentional even with no photo at all.
- Upload the photo from admin (Cloudinary) when ready; the public page updates on the next revalidation. No code change or redeploy needed.
- When you get a proper photo later: a well-lit, plain-background, head-and-shoulders shot, cropped square (Cloudinary can auto-crop around the face), is enough.
- Use a photo you are comfortable having public, and avoid images that show other people (consistent with the privacy decision for teammates).

Optional hardening: render the email address on the server and avoid placing it in plain text in client-side bundles, to reduce trivial scraping. A contact form can be added later (see backlog).

---

## 4. Admin Panel (`/admin`)

### 4.1 Access and Security
- Login page at `/admin/login` with **Google sign-in** (Firebase Auth).
- After sign-in, the client sends the Firebase ID token to a server route, which:
  1. Verifies it with the Admin SDK,
  2. Checks the email/UID against an **allowlist** (`ADMIN_EMAILS` env var, optionally a custom claim `admin: true`),
  3. Creates an `httpOnly`, `secure`, `sameSite=lax` **session cookie**.
- Every `/admin/*` page and every admin API route or Server Action verifies the session server-side. Do not rely only on a routing guard (Next.js 16 renames `middleware` to `proxy`; check the current docs for the exact file name). Re-check inside each server action as well (defense in depth).
- Firestore security rules: **deny all client reads and writes**; all data access goes through the server with the Admin SDK.
- Non-allowlisted Google accounts are rejected at the session step, even if they can sign in to Firebase.
- Rate-limit `/api/track` and auth endpoints.
- "Sign out everywhere" option (revoke refresh tokens).

### 4.2 Admin Modules

| Module | Features |
|---|---|
| **Dashboard** | Views (today / 7d / 30d / all time), unique visitors, **CV views and downloads**, top referrers, countries, devices, time-series chart, most-clicked links |
| **Profile and settings** | Name, tagline, bio, photo, location, availability status, SEO title/description, accent color |
| **Contact and links** | Email, optional phone, location, social/profile links with per-item visibility toggle and ordering (feeds the hero icons and the Contact section) |
| **CV manager** | Upload or replace the CV (to Cloudinary), version label, "active CV" switch, download count per version |
| **Contests** | CRUD for all categories (ICPC prelim/regional, IUPC, IAUPC, hackathon, other), filters, sort by date, "feature on homepage" toggle, duplicate entry, draft/published. **No teammate fields** |
| **Projects** | CRUD, images (Cloudinary), tech stack tags, links (live/code), role, team-project flag, status (completed / in progress), featured, markdown description. **No teammate fields** |
| **Experience and roles** | Work/training (DSI), club roles (mentor, executive, Treasurer) with date ranges, education |
| **Skills** | Categories and items with optional icon key and ordering |
| **Integrations** | GitHub username and featured repos, Codeforces handle, manual overrides (e.g., total problems solved across judges) |
| **Media library** (small) | List and delete uploaded Cloudinary assets used by the site |
| **Maintenance** | Export all data as JSON (backup), import, "revalidate site now" button |

### 4.3 Editing UX guidelines
- Forms with validation (React Hook Form + Zod, shared with the server).
- Draft and Published status; **Preview** the public page with unpublished content.
- Clear success/error toasts and an unsaved-changes warning.
- On save: write to Firestore, then call `revalidateTag(...)` so the public page updates immediately.

---

## 5. Data Model (Firestore)

Use a few top-level collections. Add `createdAt`, `updatedAt`, `published`, and `order` where relevant.

### 5.1 Collections

| Collection / doc | Purpose |
|---|---|
| `site/profile` (single doc) | Name, tagline, bio, photo URL, location, availability, SEO fields |
| `site/contact` (single doc) | `email`, `phone?`, `location?`, `links[]` (`platform`, `label`, `url`, `iconKey`, `visible`, `order`), `showEmail`, `showPhone` |
| `skills/{id}` | `category`, `name`, `iconKey`, `order` |
| `projects/{id}` | `title`, `slug`, `summary`, `description` (markdown), `images[]`, `stack[]`, `links{live,code}`, `role`, `isTeamProject`, `status`, `startDate`, `endDate`, `featured`, `published`, `order` |
| `contests/{id}` | See 5.2 |
| `experience/{id}` | `type` (work / club / education), `organization`, `title`, `start`, `end`, `description`, `highlights[]`, `link`, `order` |
| `cvFiles/{id}` | `label`, `cloudinaryPublicId`, `url`, `isActive`, `uploadedAt`, `downloadCount` |
| `events/{id}` | Raw analytics events (see section 8) |
| `stats/daily/days/{yyyy-mm-dd}` | Daily aggregates: views, uniques, cvViews, cvDownloads |
| `cache/{key}` | Cached external API responses (GitHub, Codeforces) with `fetchedAt` |

### 5.2 Contest document (one collection, many categories)

One `contests` collection with a `category` field lets you add new contest types later without a schema migration. **Teammate information is intentionally not part of the model.**

```ts
type ContestCategory =
  | "icpc-preliminary"
  | "icpc-regional"
  | "iupc"
  | "iaupc"
  | "hackathon"
  | "other";

interface Contest {
  id: string;
  category: ContestCategory;
  name: string;               // "ICPC Asia Dhaka Regional 2025"
  organizer?: string;         // host university / organization
  date: string;               // ISO date, used for sorting
  year: number;
  mode?: "onsite" | "online";
  teamName?: string;          // optional; team name only, no member details
  rank?: number;
  totalParticipants?: number; // percentile is computed in code
  solved?: number;
  totalProblems?: number;
  prize?: string;             // "Champion", "Runner-up", "Promising Team"
  links?: { label: string; url: string }[]; // standings, posts, certificate
  notes?: string;
  featured: boolean;
  published: boolean;
}
```

Computed on read, not stored: `percentile = rank / totalParticipants`, and category totals (e.g., "2 ICPC Regionals").

Privacy note: standings and announcement links may themselves show teammates' names on the external site. If you want to avoid that entirely, link only to your own certificate or a post that you control, and leave `links` empty otherwise.

### 5.3 Indexing
Create composite indexes only when Firestore asks for them (for example `category + date desc`, `published + order`).

---

## 6. Architecture

### 6.1 Rendering strategy
- `/` is **server-rendered from cached data**. Content is loaded through cached server functions tagged `"profile"`, `"contact"`, `"contests"`, `"projects"`, and so on.
- Admin saves call `revalidateTag` for the affected tag, so edits go live in seconds.
- GitHub and Codeforces calls happen on the server with a cache time (for example 1 hour) and fall back to the last saved copy in `cache/*` if the API fails.
- `/admin/*` is dynamic (never cached, `noindex`).

### 6.2 Suggested folder structure

```
src/
  app/
    (public)/
      page.tsx                  # "/"
      projects/[slug]/page.tsx  # optional detail pages
    admin/
      login/page.tsx
      (protected)/
        layout.tsx              # verifies session
        page.tsx                # dashboard
        contests/ projects/ experience/ skills/ profile/ contact/ cv/ integrations/ media/
    api/
      auth/session/route.ts     # create/destroy session cookie
      track/route.ts            # analytics beacon
      upload/sign/route.ts      # Cloudinary signed-upload params (admin only)
    cv/route.ts                 # logs CV hit, redirects to Cloudinary file
    sitemap.ts  robots.ts  opengraph-image.tsx
  components/
    public/   admin/   ui/
  lib/
    firebase/ (admin.ts, client.ts)
    cloudinary/ (server.ts, loader.ts)
    auth/ (session.ts, guard.ts)
    data/ (queries.ts, mutations.ts)      # all Firestore access
    integrations/ (github.ts, codeforces.ts)
    analytics/ (track.ts, aggregate.ts)
    validation/ (schemas.ts)              # Zod
    site.ts                               # SITE_URL and shared constants
  types/
```

### 6.3 Environment variables
```
# Firebase (server)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=              # on Vercel, make sure newlines are preserved/escaped correctly

# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin and session
ADMIN_EMAILS=you@example.com
SESSION_COOKIE_NAME=__session_admin
ANALYTICS_SALT=

# Cloudinary (server only, except the cloud name)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Integrations
GITHUB_TOKEN=                      # server-only, read-only public scope

# Site
NEXT_PUBLIC_SITE_URL=https://<your-assigned-url>.vercel.app   # whatever Vercel assigns for "portfolio"
```
Never expose the Admin SDK key, the Cloudinary API secret, or `GITHUB_TOKEN` to the browser.

---

## 7. File and Image Storage: Cloudinary

### 7.1 What goes there
Profile photo, project screenshots, Open Graph image source (optional), and the **CV PDF**.

### 7.2 Upload flow (admin only)
1. In admin, you pick a file.
2. The browser asks `/api/upload/sign` for signed upload parameters. This route first verifies the admin session, so only you can upload.
3. The browser uploads directly to Cloudinary with those parameters (keeps large files off your Vercel functions).
4. The returned `public_id` and `secure_url` are saved in Firestore (for example on the project or `cvFiles` document).
5. Use a dedicated folder (e.g., `portfolio/projects`, `portfolio/cv`) and tag assets so the media library can list and clean them.

### 7.3 Delivery
- Images: use `next/image` with a small Cloudinary loader (or allow `res.cloudinary.com` in `images.remotePatterns`) so Cloudinary handles resizing and format conversion.
- CV: always link visitors to **your own `/cv` route**, which logs the download and then redirects to the active CV's Cloudinary URL. The public never needs the raw Cloudinary link, and replacing the CV does not change the URL you share.

### 7.4 Things to check when setting up
- Cloudinary accounts may restrict delivery of PDF files by default. In the Cloudinary console, look for the security setting that allows PDF and ZIP delivery and enable it if needed.
- Confirm current free-tier limits (storage, bandwidth, transformations) on Cloudinary's pricing page. A portfolio's needs are small, but compress screenshots before uploading.
- Keep original images reasonably sized (for example under 2 MB) and let Cloudinary generate responsive variants.

---

## 8. Analytics and CV Tracking

### 8.1 What to track
- Page views (public page and project detail pages)
- Unique visitors (daily)
- **CV views/downloads** (the main requirement)
- Clicks on key outbound links (GitHub, LinkedIn, Codeforces, live project links)
- Referrer domain, country, device type, browser
- Bots (exclude or flag)

### 8.2 How it works
1. **Page views:** a tiny client component sends `navigator.sendBeacon("/api/track", ...)` once per page load.
2. **CV downloads:** the CV button links to `/cv`. The route handler logs the event, then redirects to the Cloudinary file. This counts real downloads, even from shared links.
3. **Visitor identity (privacy-friendly):** do **not** store raw IPs. Compute `hash(IP + userAgent + dailySalt)` on the server. This allows "unique per day" counts without storing personal data.
4. **Country:** read from hosting request headers (Vercel provides the visitor's country code) rather than calling a geo-IP service.
5. **Bots:** ignore known crawler user agents; optionally keep them in a separate counter.
6. **Ignore yourself:** do not track when the admin session cookie is present.

### 8.3 Keeping the dashboard cheap
Write each event once to `events` (for detail) **and** increment daily counters in `stats/daily/days/{date}` using `FieldValue.increment(1)`. The dashboard then reads only a few dozen small daily docs, not thousands of events. For uniques, create a `visitors/{hash}` doc under that day only if it doesn't exist, and increment `uniques` when it is newly created.

### 8.4 Dashboard widgets
- KPI cards: Total views, Unique visitors, CV views, CV downloads (with 7d/30d change)
- Line chart: views per day
- Table or bar chart: top referrers and countries
- List: most clicked links
- Optional retention setting, such as deleting raw `events` older than 90 days (daily aggregates are kept)

### 8.5 Free-tier budget check (verify on the current Firebase pricing page)
Firestore's free allowance is roughly 1 GiB storage, 50K reads/day, 20K writes/day. A personal portfolio with a few hundred visits a day is comfortably within that, especially because the public page is cached and the dashboard reads aggregates. Each tracked visit costs a handful of writes, so add per-visitor dedupe and rate limiting.

---

## 9. External Integrations

### 9.1 GitHub
- Use the GitHub REST API (server-side with a token) to list repos, stars, forks, language, and description.
- To show **pinned** repos or the **contribution graph**, use the GitHub GraphQL API.
- Simpler and more controllable: in admin, mark **featured repos** by name, then fetch and cache their details.
- Cache for around 1 hour, and show the last cached copy if the API errors.

### 9.2 Codeforces
- The public Codeforces API provides user info (rating, max rating, rank), rating history, and submissions. No API key is needed for public data.
- Show current and max rating, rank title, rating-change graph, and a solved-problem count computed from submissions (unique accepted problems).
- Cache for a few hours; keep request frequency low.

### 9.3 Other judges (optional)
AtCoder, CodeChef, LeetCode, and Toph can be shown as links with a manually entered "problems solved" number in admin. Official APIs vary, so avoid unofficial scrapers in v1.

---

## 10. Content Inventory (what you need to prepare)

| Item | Details |
|---|---|
| Profile | Professional photo, short bio, tagline |
| Contact info | Email, phone number, LinkedIn URL, Facebook URL (all four to be shown publicly for now) |
| CV | Latest PDF |
| Contests | For each: name, organizer, date, mode, team name (optional), rank, total teams, problems solved, a link you control (certificate or post). **Do not include teammates** |
| Contest counts | 2 ICPC prelims, 2 ICPC Dhaka Regionals, 2 IUPC, 1 IAUPC, 2 hackathons |
| Projects (5) | Title, one-line summary, longer description, screenshots, stack, live and repo links, **your own role and contribution**, whether it was a team project (yes/no), duration, status (mark the ongoing one) |
| Experience | DSI industrial training (dates, what you built, tech), MIST Computer Club roles with dates: mentor (2nd year), executive panel (3rd year), Treasurer (4th year), plus 2-3 bullet achievements per role (events organized, budgets managed, and so on) |
| Education | University, CGPA, dates, notable awards |
| Skills | Grouped lists |

Tips:
- For the Treasurer role, quantify when possible (events funded, budget handled, sponsors coordinated), as long as the numbers are accurate and appropriate to share publicly.
- Write project descriptions in terms of **what you personally built**, which works well without naming teammates. If a repo or live site credits collaborators, remember that visitors can see that on those pages; this plan only controls what your own site shows.

---

## 11. Security and Privacy Checklist

- [ ] Admin Google account has 2-step verification enabled
- [ ] Allowlist enforced on the server; non-allowlisted logins rejected
- [ ] Session cookie is `httpOnly`, `secure`, `sameSite`, and has a limited lifetime
- [ ] All Firestore access through the Admin SDK; client rules deny everything
- [ ] Cloudinary uploads are signed by an admin-only route; API secret never reaches the browser
- [ ] Zod validation on every server action and API route
- [ ] Rate limiting on `/api/track` and auth endpoints
- [ ] Sanitize markdown/HTML from admin content before rendering
- [ ] Security headers (CSP, X-Content-Type-Options, Referrer-Policy), with CSP allowing Cloudinary images
- [ ] No raw IPs stored; salted hashes only; short retention for raw events
- [ ] No teammate names, photos, or profile links in the database schema or UI
- [ ] Per-field visibility toggles for contact details (especially phone)
- [ ] Secrets only in Vercel environment variables, never committed
- [ ] `/admin` and `/api/*` set to `noindex`
- [ ] Small privacy note in the footer explaining the analytics

---

## 12. Testing and Quality

- **Types and lint:** TypeScript strict mode, ESLint, Prettier
- **Unit tests:** percentile calculation, data mappers, analytics hashing (Vitest)
- **Integration tests:** server actions against the Firebase Emulator Suite (Auth and Firestore emulators run locally for free)
- **E2E (a few key flows):** admin login blocked for non-allowlisted accounts; add a contest and see it on `/`; edit contact info and see it update on `/`; CV click increments the counter (Playwright)
- **CI:** GitHub Actions running lint, type-check, and tests on each PR

---

## 13. Deployment and Operations (Vercel, no custom domain yet)

1. Create the Firebase project (Spark plan); enable Authentication (Google provider) and Firestore.
2. Create a service account and store its credentials in Vercel environment variables (watch the private key's line breaks).
3. Create a Cloudinary account, a dedicated folder structure, and API credentials; add them to Vercel.
4. Connect the GitHub repo to Vercel with the working name **`portfolio`**. Vercel project names (and the default `*.vercel.app` URL) must be unique, so a plain `portfolio` is very likely taken and Vercel will assign a variation. Check what URL you actually get. The name is not permanent: you can rename the project or add a custom domain later, and you will update `NEXT_PUBLIC_SITE_URL` and Firebase Authorized domains when the URL changes.
5. Add the production hostname (`<project-name>.vercel.app`) to **Firebase Auth → Authorized domains**.
6. Set `NEXT_PUBLIC_SITE_URL` to that URL. Use it for canonical links, Open Graph, `sitemap.xml`, and JSON-LD.
7. Local development uses the real Firebase project and Cloudinary account (the Firebase Emulator Suite is optional, mainly for automated tests and risky experiments). Firebase's authorized-domains list does not accept wildcards, so Google sign-in will not work on randomly named preview deployment URLs; do admin testing locally or on production. Before launch, remove any test data created during development.
8. Back up regularly with the admin "Export JSON" button.

### When you get a domain later
- Buy or register it (check whether student offers such as the GitHub Student Developer Pack include a free domain you are eligible for).
- Add it in Vercel, update `NEXT_PUBLIC_SITE_URL`, and add it to Firebase Authorized domains.
- Set up a redirect from the `vercel.app` URL to the new domain, and update links on your CV, LinkedIn, and GitHub profile.
- Because the URL lives in one environment variable, this is a small change.

---

## 14. Roadmap and Milestones

Estimated for part-time work (about 10-15 hours a week). Adjust freely.

### Phase 0: Setup and decisions (1-2 days)
- [x] Decisions settled (see Decisions Log)
- [x] Working project name: `portfolio` (revisit when a domain is chosen)
- [x] Accent color: indigo (temporary); profile photo: temporary placeholder
- [x] Choose fonts: Geist Sans for headings and body, with Geist Mono for small accents
- [x] GitHub repo, Firebase project, and Cloudinary account created
- [ ] Vercel project: **deferred to the end** (develop locally first; see the note in Phase 1)
- [ ] Collect content (section 10); draft bio and tagline

### Phase 1: Foundation (3-4 days)
- [ ] Scaffold Next.js 16 + TypeScript + Tailwind + shadcn/ui
- [ ] Firebase Admin and client setup; local emulators
- [ ] Auth flow: Google sign-in, allowlist, session cookie, protected admin layout
- [ ] Base layouts, design tokens, light/dark theme

**Done when:** you can sign in at `/admin` and non-allowlisted accounts cannot.

#### Console setup to finish before coding (accounts already exist)
Firebase:
- [ ] Authentication: enable the **Google** sign-in provider and set the support email
- [ ] Authorized domains: `localhost` is included by default, which is all you need while developing locally
- [ ] Firestore: create the database in **production mode** (locked rules; the app accesses data only through the server). **The database location cannot be changed later**, so pick a region close to you and your visitors (for example a South Asia or Southeast Asia region if offered) and double-check before confirming
- [ ] Project settings: register a **Web app** to get the `NEXT_PUBLIC_FIREBASE_*` values
- [ ] Project settings → Service accounts: generate a **private key** for the Admin SDK (download the JSON once, keep it out of Git)

Cloudinary:
- [ ] Copy the **cloud name**, **API key**, and **API secret** from the dashboard
- [ ] Check the security setting for **PDF and ZIP delivery** and enable it so the CV can be served
- [ ] Create folders such as `portfolio/projects`, `portfolio/cv`, `portfolio/profile`

GitHub repo:
- [ ] Add a `.gitignore` that covers `.env*` and any downloaded service-account JSON
- [ ] Optionally protect `main` and work on feature branches

Local environment:
- [ ] Create `.env.local` from section 6.3, using `NEXT_PUBLIC_SITE_URL=http://localhost:3000` for now
- [ ] Install Node.js (current LTS) and the Firebase CLI (for the Emulator Suite)

**Vercel comes last:** because you will create the Vercel project at the end, everything in Phases 1-5 runs locally. At launch (Phase 6), follow section 13: connect the repo, add the environment variables, then add the assigned `vercel.app` hostname to Firebase **Authorized domains** and update `NEXT_PUBLIC_SITE_URL`. Until then, Google sign-in works only on `localhost`.

### Phase 2: Data layer and admin CRUD (about 1 week)
- [ ] Zod schemas and Firestore queries and mutations
- [ ] Cloudinary signed-upload route and reusable upload component
- [ ] Admin forms: profile, **contact and links**, skills, experience/roles
- [ ] Admin forms: **contests** (all categories) and **projects**
- [ ] Draft/published, ordering, tag-based revalidation

**Done when:** you can add and edit every content type, including contact info and images, from the admin panel.

### Phase 3: Public portfolio (about 1 week)
- [ ] Hero, stats strip, about, skills
- [ ] Projects grid and detail pages
- [ ] Contests section with category tabs and highlights
- [ ] Experience timeline (work, club roles, education)
- [ ] Contact section driven by `site/contact` from Firestore, footer
- [ ] Responsive and accessibility pass

**Done when:** `/` renders entirely from Firestore data and updates after an admin save.

### Phase 4: Integrations and tracking (4-5 days)
- [ ] GitHub featured repos (and optional contribution graph)
- [ ] Codeforces card and rating chart
- [ ] CV manager in admin, plus the `/cv` route handler with download logging
- [ ] `/api/track` beacon, daily counters, bot filtering

### Phase 5: Dashboard and polish (4-5 days)
- [ ] Dashboard KPIs and charts (Recharts)
- [ ] SEO: metadata, Open Graph image, sitemap, JSON-LD
- [ ] Performance pass (images, fonts, bundle size), Lighthouse targets
- [ ] Security checklist, rate limiting, CSP
- [ ] Tests for critical flows; CI

### Phase 6: Launch (1-2 days)
- [ ] Enter real content; proofread; get a friend's feedback
- [ ] Deploy on Vercel; verify admin login, analytics, and CV tracking in production
- [ ] Share the `vercel.app` link on your CV, LinkedIn, GitHub, Codeforces, and the club site
- [ ] Later: attach a custom domain (section 13)

---

## 15. Future Ideas (Backlog)

- **Contact form** that stores messages in Firestore with an admin inbox (spam protection needed)
- **Auto-generated CV** (PDF built from your Firestore data, so the CV and the site never drift apart)
- Blog or notes section (CP editorials, contest write-ups) using Markdown/MDX
- Certificates and awards gallery
- Command palette (Ctrl/Cmd+K) to jump to sections
- Contest timeline visualization
- Testimonials and recommendations
- Newsletter or RSS
- Weekly email summary of analytics
- Case-study pages for major projects (problem, approach, result)

---

## 16. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Cloudinary free-tier limits or default PDF restrictions | Check limits and the PDF delivery setting at setup; compress images; keep only needed assets |
| External APIs (GitHub, Codeforces) rate-limit or fail | Cache results; keep last good copy in Firestore; handle errors in the UI |
| `vercel.app` URL changes the day you add a domain | Single `NEXT_PUBLIC_SITE_URL` variable plus a redirect from the old URL |
| Firebase Auth does not work on random preview URLs | Develop admin with emulators; test sign-in on production |
| Over-engineering delays launch | Ship Phases 1-3 first (a working site plus editable content), then add tracking and polish |
| Analytics privacy concerns | Hash visitor IDs, store no raw IPs, short retention, add a footer note |
| Teammate names leaking via linked external pages | Link only to pages you control (certificates, your own posts), as noted in section 5.2 |
| Content drift (CV vs site) | Single source of truth in Firestore; later, generate the CV from it |
| Admin account compromise | Google 2FA, allowlist, session expiry, ability to revoke sessions |

---

## 17. Remaining Small Decisions

None blocking. Everything needed to start Phase 0 is decided.

Placeholders to revisit later (all editable without code changes):
- Project name and URL (working name `portfolio`; revisit when a domain is chosen)
- Accent color (indigo for now)
- Profile photo (temporary for now)
- Whether to keep the phone number public

---

## Changelog

- **v2.3 (Oct 20, 2026):** GitHub repo, Firebase project, and Cloudinary account marked as created; Vercel project deferred to launch; added a console setup checklist to Phase 1 (including the permanent Firestore location choice).
- **v2.2 (Oct 20, 2026):** Accent color set to indigo (temporary); temporary profile photo with an initials-avatar fallback added (section 3.5); no blocking decisions remain.
- **v2.1 (Oct 20, 2026):** Working project name set to `portfolio` (with a note that the plain name is likely taken on Vercel); initial contact items set to phone, email, LinkedIn, and Facebook; remaining decisions trimmed to accent color and photo.
- **v2 (Oct 20, 2026):** Applied decisions: Cloudinary for files, Vercel hosting, contact info stored in Firestore and fetched by the frontend, minimal and professional design, no domain yet (launch on `vercel.app`), English only, no teammate information. Removed the contact form and messages inbox from v1; removed teammate fields from the data model; rewrote storage, deployment, and roadmap sections accordingly.
- **v1 (Oct 20, 2026):** Initial full plan.

*Version and pricing notes (Next.js 16.x LTS, Firebase Storage requiring Blaze from Feb 3, 2026) were checked against recent sources; re-verify quotas, Cloudinary limits, and file names against the official docs when you start building.*
