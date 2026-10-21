# Karvon

Premium Uzbek-language homepage for **Karvon**, a luxury travel agency. The
visitor picks one of six destination cities and the whole page re-themes to it:
hero photograph, accent colour, quick facts, tour packages, experiences,
testimonial and call-to-action copy all follow the selection.

Cities, in order: Rim, Dubay, Istanbul, Parij, Tokio, Nyu-York.

Built from the design handoff in `design_handoff_karvon_homepage/`.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS v4, configured CSS-first in `src/app/globals.css`
- TypeScript
- Cormorant Garamond + Manrope via `next/font/google` (self-hosted at build)

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm start            # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
```

## Deployment

The site is live on GitHub Pages at
**https://nabiyev7.github.io/tourvial-travel/**, published by
`.github/workflows/deploy.yml` on every push to `main`. The workflow runs
`typecheck` and `lint` first, so a broken build never reaches the live site.

Pages serves the repository from the **`gh-pages`** branch, which holds build
output only and is replaced on each deploy — never edit it by hand. The
tidier "GitHub Actions" source is not used because switching to it needs the
Create Pages site API, and that refuses the workflow token
(`Resource not accessible by integration`). Pushing a branch needs only
`contents: write`, which the workflow does have. To move to the Actions
source later, set Settings → Pages → Source → GitHub Actions by hand first,
then the workflow can go back to `upload-pages-artifact` / `deploy-pages`.

`next.config.ts` has two build modes:

| Mode | How | What you get |
| --- | --- | --- |
| Default | `npm run build` | A normal Next.js app for a Node host (Vercel, Netlify, a container). `next/image` optimises the photography at request time. |
| Static export | `NEXT_OUTPUT=export npm run build` | A fully static `out/` for a file host. Set `NEXT_BASE_PATH=/<repo>` when it is served from a sub-path, as GitHub Pages project sites are. |

GitHub Pages has no image optimiser, so the export serves the photography
as-is — one more reason to self-host and size the images (see below) rather
than hotlinking 2000px originals.

To deploy to Vercel or Netlify instead, import the repository and accept the
detected Next.js defaults; the default build mode is what those hosts want.

## Project layout

```
src/
  app/
    globals.css        design tokens (@theme) + the accent machinery
    layout.tsx         fonts, metadata
    page.tsx           section order; resolves "today" on the server
  components/          one file per section, plus the booking modal
  data/
    cities.ts          all per-city content — the single source of truth
    site.ts            phone, address, nav labels, month/weekday names
  lib/
    store.tsx          selected city, date picker, popovers, booking state
scripts/
  fetch-images.sh      download the hero photographs for self-hosting
```

### Adding or editing a destination

Everything lives in `src/data/cities.ts`. A city needs a `hue` (the OKLCH hue
that drives the accent), an image, four quick facts, exactly three packages and
exactly four experiences — the types enforce the counts. Nothing in the
components needs to change.

This file is shaped so it can be replaced by a CMS query later without touching
the components.

## How the accent colour works

Each city carries an OKLCH `hue`. `KarvonProvider` sets two custom properties
on the page wrapper:

```css
--color-accent:     oklch(0.80 0.11 <hue>);
--color-accent-dim: oklch(0.80 0.11 <hue> / 0.14);
```

Both are registered with `@property` in `globals.css`, which is what lets the
browser *interpolate* them — a city change crossfades the accent over 0.8s
instead of snapping. Tailwind's `bg-accent` / `text-accent` / `border-accent`
read these directly.

One gotcha worth knowing if you touch this: a `@theme` token must hold a
literal colour, not `var(--something-else)`. A token holding a `var()` is
substituted once on `:root`, so every descendant would be stuck with the
`:root` value and the per-city override would never take effect.

## Responsive behaviour

A single breakpoint at **760px** (`--breakpoint-dk`, giving the `dk:` and
`max-dk:` variants). Below it: the nav collapses to a fullscreen "Menyu"
overlay, the hero city list becomes a horizontally scrolling rail of pills, the
packages image switches from 4/5 to 4/3 and stops being sticky. Everything else
is fluid via `clamp()` and `auto-fit` grids. Touch targets are at least 44px.

Layout switching is done in CSS, not JavaScript, so the server-rendered markup
is correct at any width and there is no flash on load.

## Before launch

These are carried over from the prototype and **must be replaced**:

| What | Where |
| --- | --- |
| All package prices | `src/data/cities.ts` — every `price` |
| Testimonial quotes and names | `src/data/cities.ts` — every `testimonial` |
| Phone number `+998 71 200 00 00` | `src/data/site.ts` — `phone`, `phoneHref` |
| Address | `src/data/site.ts` — `address` |
| Telegram link `https://t.me/` | `src/data/site.ts` — `telegram` |
| "15 yildan beri" | `src/data/site.ts` — `yearsInBusiness` |

Two more things:

**The booking form does not submit anywhere yet.** `submitBooking` in
`src/lib/store.tsx` validates the phone (9+ digits) and then shows the success
state without sending anything. Wire it to a backend — a Telegram bot or a form
service — at the `TODO(launch)` marker.

**The hero photographs are hotlinked** from Unsplash and Pexels, which
`next.config.ts` allows via `images.remotePatterns`. Run
`./scripts/fetch-images.sh` to download them, switch the `image` values in
`src/data/cities.ts` to the local paths, and drop `remotePatterns`. Unsplash
and Pexels both permit commercial use; crediting the photographers is good
practice.

## Notes

- The city the visitor last chose is persisted in `localStorage` under
  `karvon_city` and read back through `useSyncExternalStore`, so it survives a
  reload without causing a hydration mismatch.
- `KarvonProvider` accepts an `autoplay` prop that cycles cities every 8s,
  pausing while the modal, a popover or the mobile menu is open. It is off by
  default, as in the prototype.
- Every city image is in the DOM at once so switching city crossfades rather
  than flashing an empty box while the next photograph loads. That is what the
  handoff specifies, but it does mean the hero loads six photographs up front —
  worth measuring once the images are self-hosted and properly sized.
- The date picker spans 13 months from the current month. "Today" is resolved
  on the server (`page.tsx`) only as the first snapshot, so the opening client
  render matches the markup; the store then re-reads the real date through
  `useSyncExternalStore` and again when the day rolls over. That is what lets
  the page be statically exported without the picker freezing on the build
  date. A selected day that falls out of range as the date moves on reverts to
  the default rather than being corrected in an effect.
