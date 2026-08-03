# Design spec — WDC-style redesign

Reference audited: **https://www.wdcdance.com/** (live, 2026-08-03). All values below marked
"measured" were read from the live DOM's computed styles, not guessed.

WDC runs the **tagDiv "Newspaper"** WordPress theme. That matters: its look is a
news-portal system (utility bar → logo band → uppercase mega-menu → block-titled content
grids → black footer), not a bespoke design. That system is a good fit for a federation
site, which is mostly news + calendar + reference pages. This spec ports that system and
fixes the places where it fails accessibility.

---

## 1. What WDC actually looks like (audit)

| Aspect | Measured value |
|---|---|
| Content container | `1068px` inside a `1280px` viewport (~83%) |
| Body text | Verdana 14px / 21px line-height, `#000` on `#fff` |
| H1 | Roboto 30px / 38px, weight **400**, `#111` |
| Menu links | Open Sans **700**, 14px, UPPERCASE, `#000` |
| Utility bar bg | `#222` |
| Logo band bg | `#000` |
| Menu bar bg | `#fff` |
| Footer bg | `#000` |
| Accent (primary) | `#4db2ec` — sky blue (Newspaper default) |
| Accent (secondary) | `#f4524d` — coral red, used sparingly |
| Greys | `#fcfcfc`, `#f9f9f9`, `#e5e5e5`, `#ccc`, `#c3c3c3`, `#444` |

**Header is three stacked bars:**

1. **Utility bar** (`#222`, ~36px) — current date on the left ("Monday, August 3, 2026"),
   then secondary links (Amateur League, Education Department, Contact, Membership
   Administration); social icons (Facebook, Instagram, YouTube) pinned right.
2. **Logo band** (`#000`, ~130px) — logo left-aligned, large, lots of black space.
3. **Menu bar** (`#fff`) — uppercase bold items with `⌄` caret dropdowns, search icon right.

**Homepage flow:** breadcrumb → H1 → `LATEST NEWS` (3-column image cards) → `CALENDAR`
→ `RESULTS` → `ABOUT US` → `FOLLOW US` → black footer.

Section headings are **block titles**: small uppercase label sitting on a horizontal rule,
with an accent-colored bar under the active word. This is the single most recognizable
element of the design — reuse it everywhere.

---

## 2. Menu structure

### 2a. WDC's actual menu (as measured)

```
GENERAL COUNCIL ⌄     WDC NEWS   CALENDAR   COMPETITIVE DANCE ⌄   SOCIAL DANCE ⌄   EDUCATION ⌄   VIDEOS & PR ⌄   🔍
├ Register of members                       ├ Committee Register              ├ Committee Register
├ Types of Membership                       ├ Competitive Dance Exec Board    ├ Social Dance Newsletter
├ Council Structure                         ├ Office Contact                  ├ Social Dance Exec Board
├ WDC EDF                                   ├ Scrutineering Department        ├ Examination Department ▸
├ WDC Board of Directors                    ├ Event Applications              │   ├ Ballroom & Latin
├ Company Head Office                       ├ Competition Rules & Forms       │   ├ Argentine Tango
├ Honorary Members                          ├ Organisers Pack                 │   └ Belly Dance
├ Memorandum and Articles                   ├ Competitors Commission          ├ Office Contact
├ Child Protection Policy                   ├ Directory of Adjudicators       ├ Danceteachers Directory
└ Privacy Policy                            ├ Championship Entry Forms ▸      ├ World Social Dance Day
                                            ├ Pro-Am                          ├ Social Dance Calendar
                                            ├ WDC World Ranking ▸             └ Online Congress
                                            │   ├ Ranking Rules and Points
                                            │   ├ Ranking Professional Latin
                                            │   └ Ranking Professional Ballroom
                                            ├ Championships Calendar
                                            ├ Granted Titles Calendar
                                            ├ World Ranking Events
                                            ├ Workshop & Congresses Calendar
                                            └ Former WDC World Champions
```

Pattern worth copying: **7 top-level items, each a governance/activity domain**, with
everything else demoted into dropdowns. Nothing beyond depth 3. News and Calendar are flat
top-level links with no dropdown — they're the two things people actually come for.

Pattern worth **not** copying: dropdowns of 17 items with no grouping, and menu labels that
repeat the org name ("WDC ..." on every child).

### 2b. Proposed menu for the Federation

Same 7-slot shape, Mongolian labels, sized to what this site will actually hold.
**Bold = Phase 1 (exists or is in scope). The rest is structure to grow into — do not
build it now** (CLAUDE.md scopes Phase 1 to landing / news / register / calendar).

```
ХОЛБООНЫ ТУХАЙ ⌄   МЭДЭЭ   ХУАНЛИ   ТЭМЦЭЭН ⌄   СУРГАЛТ ⌄   ГАЛЕРЕЙ   БҮРТГЭЛ ⌄   🔍
├ Бидний тухай             ├ Тэмцээний хуваарь   ├ Багш нарын жагсаалт        ├ Клуб бүртгүүлэх
├ Удирдах зөвлөл           ├ Тэмцээний дүн       ├ Шүүгчийн сургалт           └ Тамирчин бүртгүүлэх
├ Гишүүн клубууд           ├ Дүрэм, журам        └ Зэрэг олгох журам
├ Дүрэм, журам             ├ Зохион байгуулагчид
└ Холбоо барих             └ Ангилал, зэрэглэл
```

| Slot | Route | Phase | Notes |
|---|---|---|---|
| ХОЛБООНЫ ТУХАЙ | `/about` + children | 2 | Static Sanity pages; parent is a landing page, not `#` |
| **МЭДЭЭ** | `/news` | **1** | Flat, no dropdown. Category filter lives on the page |
| **ХУАНЛИ** | `/calendar` | **1** | Flat. Upcoming + results tabs on-page |
| ТЭМЦЭЭН | `/competitions` | 2 | Where rankings/results detail eventually go |
| СУРГАЛТ | `/education` | 2 | |
| ГАЛЕРЕЙ | `/gallery` | 2 | Phase 1 gallery is a homepage section only |
| **БҮРТГЭЛ** | `/register` | **1** | Dropdown: `/register/club`, `/register/dancer` — both exist |

Until Phase 2 lands, ship the header with **МЭДЭЭ / ХУАНЛИ / БҮРТГЭЛ** plus a
ХОЛБООНЫ ТУХАЙ item only if there's real Sanity content behind it. An empty dropdown
reads as a broken site.

**Utility bar** (WDC's row 1, adapted): today's date left · `Холбоо барих` · phone · email ·
social icons right. The current site already has phone/email/social there — keep it, add the
date and drop `Нэвтрэх` (there is no login in Phase 1; it currently points at the Studio,
which is confusing for public visitors).

Menu labels come from `siteSettings` in Sanity, not from a hardcoded array — an admin must
be able to rename "ХУАНЛИ" without a deploy. Today they're hardcoded in
`src/components/Header.astro:18`.

---

## 3. Typography

WDC's Verdana body at 14px is dated and renders heavy in Cyrillic. Keep WDC's *structure*
(small dense body, light large H1, heavy uppercase menu) with fonts that cover Mongolian
Cyrillic properly — **ү (U+04AF)** and **ө (U+04E9)** live in the `cyrillic-ext` subset, so
that subset is mandatory in every `@font-face` load.

**Seven steps, no more.** An earlier draft of this spec listed sizes role-by-role and drifted
to 12 distinct values, five of them inside a 4px band (13/14/15/16/17) doing no perceptual
work. Every size below must come from this scale:

```css
--fs-meta:11px;    /* dates, eyebrows, pills, utility bar */
--fs-sm:13px;      /* menu, dropdown, captions, buttons, footer */
--fs-body:15px;    /* body copy */
--fs-title:18px;   /* card + row headlines, logo wordmark */
--fs-lg:24px;      /* calendar date numeral, logo mark */
--fs-section:32px; /* section headings, hero H1 on mobile */
--fs-hero:44px;    /* hero H1 desktop — one use only */
```

| Role | Font | Size | Weight | Case |
|---|---|---|---|---|
| Menu (top level) | Open Sans | `--fs-sm` | 700 | UPPERCASE, `0.03em` |
| Dropdown item | Open Sans | `--fs-sm` | 400 | Sentence |
| Utility bar | Open Sans | `--fs-meta` | 400 | Sentence |
| H1 hero | Roboto | `--fs-section` → `--fs-hero` @md | 400 | Sentence |
| H2 / block title | Open Sans | `--fs-sm` | 700 | UPPERCASE, `0.06em` |
| H3 card / row headline | Roboto | `--fs-title` | 500 | Sentence |
| Body | Open Sans | `--fs-body` / 1.6 | 400 | Sentence |
| Meta / date / pill | Open Sans | `--fs-meta` | 400–700 | UPPERCASE |

Two families, four weights total (400/500/700 Open Sans, 400/500 Roboto). Load `latin` +
`cyrillic-ext` only, `font-display: swap`, self-hosted or via `@fontsource` — no runtime
call to Google.

> The repo currently uses **Golos Text** (`src/styles/global.css:5`), inherited from
> dancesport.mn. Golos has good Cyrillic and is a legitimate keep — but it's a single
> geometric family, so it can't produce WDC's heavy-menu/light-headline contrast. Swapping
> to the Open Sans + Roboto pair is what makes the design read as "WDC-like".

Note the H1 is **weight 400, not bold** — a large light headline against a heavy uppercase
menu is the core typographic move here. Don't bold it.

---

## 4. Color

WDC = near-black chrome + one sky-blue accent + white content. Its `#4db2ec` on white is
**2.36:1**, which fails WCAG AA for text, so the accent is split into a *text-safe* dark
tone and a *decorative* bright tone. This split is not optional — with blue as the brand,
`--accent-500` is unusable for anything that carries a glyph.

```css
@theme {
  /* Chrome — WDC's black stack */
  --color-ink-900:    #000000;  /* logo band, footer */
  --color-ink-800:    #111111;  /* headings */
  --color-ink-700:    #222222;  /* utility bar */
  --color-ink-600:    #5a5a5a;  /* secondary text — 6.9:1 on white */

  /* Accent — WDC sky blue */
  --color-accent-500: #4db2ec;  /* DECORATIVE ONLY: rules, underlines, glows */
  --color-accent-600: #1c8fd0;  /* hover on non-text surfaces */
  --color-accent-700: #0b6ea8;  /* TEXT-SAFE: links, active nav, FILLED BUTTONS — 5.5:1 */
  --color-accent-800: #08557f;  /* pressed / hover on filled surfaces */

  /* Neutrals */
  --color-paper:      #ffffff;
  --color-paper-alt:  #f4f4f5;  /* alternating section bg — must be visibly distinct */
  --color-line:       #e5e5e5;  /* hairlines, block-title rules */
  --color-line-strong:#cccccc;
  --color-body:       #333333;  /* body copy — 12.6:1, softer than WDC's pure black */
}
```

**Filled buttons take `--accent-700`, never `--accent-600`.** Button text is 13px, which is
not "large text" under WCAG, so it needs 4.5:1. `--accent-600` in the blue theme is 3.57:1
and fails; `--accent-700` is 5.51:1 and passes in both themes.

There is no separate "flag" colour. An earlier draft had a coral/amber for urgent states,
which put two unrelated warm hues next to each other and read as accidental. Status is
expressed by *weight within one hue* instead — see the three-level ladder in §6.

**Usage rules**

- Accent is for *state*, never decoration-at-large. Budget **≤5 accent elements per
  viewport**, and they should be: active nav item, block-title bars, primary button, and at
  most one status marker. Count them — an early build of the mockup hit 11 and the colour
  stopped meaning anything.
- `--color-accent-500` may never carry text. Rules, 3px underbars, and glows only.
- **Category eyebrows, "view all" links, and result labels are NOT accent.** They are
  `--color-ink-600` / `--color-ink-800`, and turn accent on hover. They repeat many times per
  page, so colouring them is what blows the budget.
- Body copy is `--color-body` (#333), not `#000`. WDC's pure black on pure white is
  fatiguing at 14px; #333 keeps 12.6:1 and reads calmer.

> **Brand decision — settled: WDC blue.** The existing site inherited red from dancesport.mn
> (`--color-theme-600: #eb0029`). The federation has chosen the WDC-faithful blue instead, so
> the tokens above are the brand and the red set is retained only as a comparison toggle in
> the mockup. Switching back is a four-line override (`:root[data-accent="red"]`) — no
> component changes.
>
> Two consequences of blue that red did not have, both already handled:
>
> - **Anything carrying text on an accent fill must use `--accent-700`.** Red's `#eb0029` was
>   4.9:1 against white and could safely hold a letter; blue's `#4db2ec` is only 2.36:1. The
>   circular logo marks were on `--accent-500` and now sit on `--accent-700` (5.5:1).
> - **Blue's `--accent-500` is a genuinely light tone**, so the 3px block-title bars and
>   dropdown top borders read lighter than they did in red. That is fine — they are
>   decorative and the label carries the meaning — but do not push `--accent-500` any lighter.

---

## 5. Layout & grid

- **Container:** `max-width: 1100px`, `padding-inline: 1rem` (WDC's 1068px + gutters).
  The repo currently uses `max-w-6xl` = 1152px — close; tighten to a `--container` token.
- **Grid:** 12 columns, 24px gutter desktop / 16px mobile.
- **News grid:** 3 across ≥1024px, 2 across ≥640px, 1 below. Card image **16:9**, fixed.
- **Sidebar:** WDC has none on the homepage. Don't add one — full-width blocks scale better
  to phones, and CLAUDE.md says the audience is mostly mobile.
- **Spacing: a 4px grid, enforced.** Saying "8px base" in prose is not enough — the first
  build of the mockup ended up with 118 off-grid values (3, 5, 7, 9, 10, 13, 14px). Use
  tokens only, never a raw number:

  ```css
  --s1:4px;  --s2:8px;  --s3:12px; --s4:16px;
  --s6:24px; --s8:32px; --s12:48px; --s18:72px;
  ```

  Section padding `--s12` mobile / `--s18` desktop. Everything else picks from the list.
- **Touch targets: 44×44px minimum**, verified at 375px width. Compact chrome controls
  (language selector, utility-bar social icons, inline "view all" links) keep their small
  visual box and expand the hit area with a transparent pseudo-element instead:

  ```css
  .tap{position:relative}
  .tap::after{content:"";position:absolute;left:50%;top:50%;
    transform:translate(-50%,-50%);width:max(100%,44px);height:max(100%,44px)}
  ```
- **Radius:** `2px` everywhere. WDC is essentially square; rounded cards would break the
  news-portal read. (The repo's `rounded-md`/`rounded-full` usage should drop to `rounded-sm`,
  except the avatar-style logo fallback.)
- **Shadow:** one only — `0 1px 3px rgb(0 0 0 / 0.08)` on the sticky header. No card shadows;
  separate cards with `--color-line` hairlines like WDC does.

---

## 6. Components

### Block title (the signature element)

```
ХАМГИЙН СҮҮЛИЙН МЭДЭЭ
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ ─────────────────────────────────
   3px accent bar        1px --color-line, fills the row
```
Open Sans 700 / `--fs-sm` / uppercase / `--color-ink-800`; 3px `--color-accent-500` bar under
the label only; 1px `--color-line` rule running to the container edge. Optional "БҮГДИЙГ
ҮЗЭХ →" link right-aligned on the rule, `--fs-sm`, `--color-ink-800`, accent on hover.

### Header

Three bars on desktop, **two on mobile**:

| Bar | Height | Bg | Contents |
|---|---|---|---|
| Utility | 40px | `--color-ink-700` | Date · contact links · language selector · social right |
| Logo | 96px, **hidden < 1024px** | `--color-ink-900` | Logo left, next-event strip right |
| Menu | 56px | `--color-paper` (dark < 1024px) | Uppercase nav, search right |

Below 1024px the logo band is dropped and the menu bar goes dark, carrying a compact brand
mark plus search and hamburger. That takes header chrome from 157px to **96px** — 19% of an
812px phone viewport down to 12% — and removes a duplicated logo.

On desktop the same compact mark lives in the sticky menu bar but stays at `opacity:0` until
an `IntersectionObserver` reports the logo band has left the viewport. Without that gate the
brand renders twice, 23px apart, in the same screenful.

**Next-event strip** fills the dead right side of the logo band (WDC leaves it empty because
it's an ad slot): label, event name + date, and a day count separated by a hairline. Hidden
below 1200px.

Sticky: the **menu bar only** sticks on scroll; utility and logo bands scroll away. Active
item = `--color-accent-700` text + 3px accent bar along the bottom of the menu bar cell.

**Dropdowns:** open on hover **and** on click/`Enter` (hover-only is a keyboard trap — WDC's
is one). White panel, 1px `--color-line`, 3px accent bar across the top, 220px min-width,
items 13px with 10px/16px padding, hover fills `--color-paper-alt`. `aria-expanded` on the
trigger, `Esc` closes and returns focus.

### News card

```
┌──────────────────────┐
│  image 16:9          │   ← Sanity image pipeline, width param, lazy
├──────────────────────┤
│ ДОТООД МЭДЭЭ         │   ← category, --fs-meta uppercase, --color-ink-600
│ Гарчиг гурван мөр    │   ← Roboto --fs-title/500, clamp 3 lines
│ 2026 оны 8-р сарын 3 │   ← --fs-meta, --color-ink-600, margin-top:auto
└──────────────────────┘
```
Whole card is one link. The card is a flex column and the date takes `margin-top:auto`, so
ragged title lengths still leave the dates aligned across the row. Hover: title and eyebrow →
`--color-accent-700`, border → `--color-line-strong`, image `scale(1.03)` over 250ms
(disabled under `prefers-reduced-motion`, already handled in `global.css:32`).

### Calendar row

Not cards — a dense table-like list, which is what WDC does and what a schedule needs:

```
┌──────┬────────────────────────────────────────┬──────────────┐
│ 8-Р  │ Улаанбаатар нээлттэй тэмцээн           │  ХУВААРЬ     │
│  15  │ Спортын төв ордон, Улаанбаатар          │              │
└──────┴────────────────────────────────────────┴──────────────┘
  date     title (Roboto 16/500) + venue (13px)    status pill
```
Date block 64px square, `--color-ink-900` bg, white text. Rows separated by 1px
`--color-line`, no shadows.

**Status is a three-level ladder in one hue**, so the levels read as a system:

| State | Treatment |
|---|---|
| `ХУВААРЬ` (scheduled) | outline `--color-line-strong`, `--color-ink-600` text |
| `ӨНӨӨДӨР` (today) | filled `--color-accent-700`, white text — the only filled one |
| Results available | **not a pill** — a `Дүн үзэх →` link in `--color-ink-800` |

Results are a destination, not a state, so they get link affordance rather than a badge. A
column of filled result pills also forms a solid accent stripe that out-competes the event
titles for attention — the thing the row exists to communicate.

### Buttons

| Variant | Style |
|---|---|
| Primary | `--color-accent-700` bg, white text, 2px radius, `--s3 --s6`, Open Sans 700 `--fs-sm` uppercase |
| Secondary | transparent, 1px `--color-line-strong` border, `--color-ink-800` text |
| On dark | white bg, `--color-ink-900` text |

Min height 44px. Hover darkens one step (`--accent-800` for primary); focus uses the global
2px accent ring (`global.css:26` — retarget it from `theme-600` to `accent-700`).

**Never pair a filled and an outlined button for two peer choices.** "Клуб бүртгүүлэх" and
"Тамирчин бүртгүүлэх" address different audiences, not a primary and a fallback — styling one
as secondary tells a dancer they picked the lesser option. Use two equal cards instead:
title, one line of description, and a `Хүсэлт илгээх →` affordance, with a 3px accent left
border to tie them to the block-title language.

### Hero

Full-bleed `<img>` at `object-fit:cover` behind a **left-to-right scrim**
(`rgb(0 0 0/.88)` → `.35`), with the text block capped at 660px on the left. Left-aligned,
not centred — the rest of the page is left-aligned and a centred hero breaks the axis. Use
`fetchpriority="high"` on the hero image and `loading="lazy"` on everything below.

Photography is not optional here. A dancesport federation page with no dancers on it is the
single biggest thing separating this from a finished design.

### Forms (registration)

WDC has nothing worth copying here, so: single column, max 560px, labels above inputs
(13px, 600, `--color-ink-800`), inputs 44px tall, 1px `--color-line-strong`, 2px radius,
focus = 2px accent ring. Required marked with `*` **and** `aria-required`. Errors inline
below the field in `--color-flag-600` with an icon — never color alone. Honeypot stays
visually hidden but not `display:none`.

### Footer

`--color-ink-900`, three columns collapsing to one on mobile:

1. **ХОЛБООНЫ ТУХАЙ** — logo, 3–4 lines from Sanity, contact email
2. **ХОЛБООС** — nav mirror
3. **БИДНИЙГ ДАГААРАЙ** — social icons, **44×44**, `rgb(255 255 255 / 0.08)` fill, accent on hover

Text `rgb(255 255 255 / 0.72)`, headings white uppercase `--fs-sm`/700 with the same 3px accent
bar. Nav links get `min-height:44px` — a 19px link row is the most common touch-target failure
in a footer. Bottom strip: `© 2026 …` at `--fs-sm`, `rgb(255 255 255 / 0.55)`, separated by a
`rgb(255 255 255 / 0.1)` hairline.

---

## 7. Mobile

WDC's mobile is a weak point — a plain hamburger drawer with the same 17-item lists. Do
better, since this audience is phone-first:

- Hamburger opens a **full-screen** panel, not a dropdown. Body scroll locked, focus trapped,
  `Esc` and a visible ✕ both close it.
- Top-level items are 56px rows; those with children get a `⌄` that expands **in place**
  (accordion), no second screen to navigate back from.
- Utility bar collapses to the language selector + social icons; the date and contact links
  drop below 768px.
- **Logo band is removed entirely below 1024px** and the menu bar goes dark, carrying the
  compact mark + search + hamburger. 96px of chrome instead of 157px.
- Every interactive element clears 44×44, verified at 375px — including the language
  selector, which is otherwise the smallest target on the page at 38×24.

Breakpoints: `640 / 768 / 1024 / 1200`. Design at 375px first.

---

## 8. Where this improves on WDC

These are deliberate deviations, not oversights:

| WDC problem | Fix here |
|---|---|
| `#4db2ec` links on white — 2.36:1, fails AA | Split accent; text uses `--color-accent-700` at 5.5:1 |
| Hover-only dropdowns, unreachable by keyboard | Click/`Enter` also opens; `Esc` closes; `aria-expanded` |
| 17-item flat dropdowns | Max 6 per dropdown; overflow goes to a section landing page |
| Verdana 14px body | Open Sans 15px/1.6 on a 7-step scale |
| Parent menu item `href="#"` (EDUCATION) | Every parent resolves to a real landing page |
| No visible focus states | Global 2px accent ring, already in `global.css:26` |
| Body text pure `#000` on `#fff` | `#333` on `#fff` — 12.6:1, less glare |
| Empty ad slot in the logo band | Next-event strip with a day count |

---

## 8b. Reference implementation

`docs/mockup/index.html` is a working single-file build of everything above — three-bar
header, MN/EN selector, hero, news grid, calendar, gallery, registration cards, footer, and
the mobile panel. It ships on the WDC blue brand, with a mockup-only toggle that flips to the
old dancesport.mn red for comparison.

Serve it over HTTP, not `file://`:

```bash
python3 -m http.server 4399 --directory docs/mockup
```

Measured against this spec at 1440px and 375px:

| Check | Value |
|---|---|
| Distinct font sizes | 6 in use, all from the §3 scale |
| Off-grid spacing values | 0 |
| Accent elements per viewport | 5 |
| Touch targets below 44px | 0 |
| Contrast failures (17 pairs, blue + red) | 0 |
| Mobile header chrome | 96px |

The images in `docs/mockup/img/` are generated abstract placeholders standing in for
photography. They are inlined as `data:` URIs in `index.html` so the file is portable; each
`<img>` is a real slot, so swapping in a `.jpg` is a one-attribute change.

---

## 9. Implementation delta

Against the current codebase, in order:

1. `src/styles/global.css` — replace the `@theme` block with §4 tokens; add `--container: 1100px`;
   retarget the `:focus-visible` outline to `--color-accent-700`.
2. Fonts — add `@fontsource/open-sans` + `@fontsource/roboto` (`latin` + `cyrillic-ext`),
   set `--font-sans` / `--font-display`. Verify ү and ө render in both.
3. `src/components/Header.astro` — split the current two-bar header into three (§6); move
   `navItems` (line 18) into `siteSettings`; drop the `Нэвтрэх` Studio link (line 59); add
   dropdown support for БҮРТГЭЛ; rebuild the mobile menu as a full-screen accordion panel.
4. New `BlockTitle.astro` — used by the homepage sections, `/news`, and `/calendar`.
5. `NewsCard.astro` — 16:9 image, category eyebrow, 2-line title clamp, hairline instead of shadow.
6. `EventList.astro` — convert to the dense row layout with the date block and status pills.
7. `Footer.astro` — three-column black footer per §6.
8. Sanity: add `navigation` (label + href + children) and `about` fields to `siteSettings`
   so the menu and footer text are admin-editable; mirror in `src/lib/types.ts`.

Steps 1–2 are prerequisites for everything else. Steps 3–7 are independent of each other.
Run `npm run build` and `npx astro check` after each.
