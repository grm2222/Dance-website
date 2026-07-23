# CLAUDE.md — Mongolian Dancesport Federation Website

## Project Overview

Rebuild of a dancesport federation website (reference: https://www.dancesport.mn/).
Phase 1 scope ONLY — do not build beyond this without being asked:

1. **Landing page** — hero, about sections, competition schedule preview, latest news, photo gallery, footer
2. **News section** — list page + single article page, categories (Дотоод мэдээ / Гадаад мэдээ)
3. **Registration forms** — /register hub with two request forms: club/organization (`/register/club`) and dancer (`/register/dancer`) (no auth, no login — submissions are reviewed manually by admins)
4. **Calendar** — /calendar page listing competition schedule (upcoming) and results
5. **Admin** — handled entirely by Sanity Studio (no custom admin UI to build)

Out of scope for now: user accounts/login, competition registration system,
rankings, e-commerce, payments. These come in phase 2 — do not scaffold them.

## Tech Stack

- **Framework:** Astro (latest stable), static output where possible, server endpoints only for form submission
- **Styling:** Tailwind CSS
- **CMS:** Sanity (hosted) — embedded Studio at `/admin` route or separate `studio/` workspace
- **Forms:** Astro server endpoint → writes submission as a Sanity document (type `registrationRequest`)
- **Hosting:** Vercel
- **Language:** TypeScript everywhere
- **Package manager:** npm

## Key Constraints (do not violate)

- **Admins are non-technical.** All editable content (news, events, gallery images, page text, contact info) MUST live in Sanity — never hardcode text an admin might want to change.
- **Zero-maintenance bias.** No databases to manage, no servers, no cron jobs. Prefer build-time data fetching + Sanity webhooks triggering Vercel redeploys over runtime complexity.
- **Free tiers only.** Stay within Sanity free tier and Vercel hobby limits. No paid plugins or services without asking.
- **Bilingual-ready.** Primary language is Mongolian (mn). Structure content fields so English (en) can be added later (use Sanity field-level localization pattern: `{ mn: string, en?: string }`), but only render Mongolian for now.

## Content Schema (Sanity)

Define these document types:

- `newsArticle` — title, slug, mainImage, category (reference), publishedAt, body (portable text), viewCount (optional)
- `newsCategory` — title, slug
- `event` — title, date, location, description, type ("schedule" | "result"), resultDetails (optional)
- `galleryImage` — image, caption, order
- `siteSettings` (singleton) — logo, phone, emails, address, facebook URL, footer text, hero content
- `registrationRequest` — orgName, about, address, phone, email, submittedAt, status ("new" | "reviewed") — created via API, hidden from creation in Studio UI but listable
- `dancerRegistrationRequest` — lastName, firstName, birthDate, gender ("male" | "female"), club (optional), phone, email, submittedAt, status ("new" | "reviewed") — created via API, hidden from creation in Studio UI but listable

## Project Structure

```
/
├── src/
│   ├── pages/          # index.astro, news/index.astro, news/[slug].astro, register.astro, api/register.ts
│   ├── components/     # Hero, NewsCard, EventList, Gallery, Footer, Header, RegistrationForm
│   ├── layouts/        # BaseLayout.astro (SEO, fonts, header/footer)
│   └── lib/            # sanity client, queries (GROQ), types
├── studio/             # Sanity Studio (schemas in studio/schemas/)
├── public/
└── CLAUDE.md
```

## Commands

- `npm run dev` — Astro dev server (localhost:4321)
- `npm run build` — production build (must pass with zero errors before any commit)
- `npm run preview` — preview production build
- `cd studio && npm run dev` — Sanity Studio dev (localhost:3333)
- `npx astro check` — type-check .astro files

## Coding Conventions

- TypeScript strict mode; no `any` unless unavoidable, with a comment explaining why
- All Sanity queries live in `src/lib/queries.ts` as named GROQ strings — never inline GROQ in components
- Components receive plain typed props; data fetching happens in pages, not components
- Mobile-first responsive design; the federation's audience is mostly on phones
- Images: always use Sanity's image pipeline (`@sanity/image-url`) with width params; never serve originals
- Accessible by default: semantic HTML, alt text from Sanity captions, visible focus states
- Mongolian Cyrillic text: ensure fonts support Cyrillic (e.g., Inter, Noto Sans); test rendering

## Form Handling Rules

- Validate server-side in `api/register.ts` (required fields, basic email/phone format)
- Add a honeypot field for spam; no CAPTCHA service for now
- On success: create `registrationRequest` doc in Sanity via write token (env: `SANITY_WRITE_TOKEN`)
- Never expose the write token client-side; the form posts to our own endpoint only

## Environment Variables

```
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=        # server-only, for registration submissions
```

Keep a `.env.example` updated whenever a variable is added.

## Workflow Notes for Claude Code

- Before adding any dependency, check if Astro/Sanity already covers it natively
- After schema changes, update both the Studio schema AND the TypeScript types in `src/lib/types.ts`
- Run `npm run build` and `npx astro check` before declaring a task done
- When unsure whether something belongs in code or in Sanity: it belongs in Sanity
- Do not add features from the reference site (rankings, shop, member lists) unless explicitly requested
