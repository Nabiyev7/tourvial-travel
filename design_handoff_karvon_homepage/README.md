# Handoff: Karvon — Bosh sahifa (homepage)

## Overview
Premium Uzbek-language homepage for **Karvon**, a luxury travel agency. The user picks one of six destination cities, and the whole page re-themes to it: hero image, accent color, quick facts, tour packages, experiences, testimonial and CTA text.

Cities, in order: **Rim, Dubay, Istanbul, Parij, Tokio, Nyu-York**.

## About the Design Files
The files in this bundle are **design references built in HTML**. They are prototypes that show the intended look and behavior, not production code to ship as-is.

- `Karvon Bosh sahifa.dc.html` is the prototype. Open it in a browser; it needs `support.js` in the same folder.
- `support.js` is the prototype runtime only. Do **not** port it.

The task is to rebuild this design in the target stack. If none exists yet, use **Next.js (App Router) + React + Tailwind CSS** (or CSS Modules), deployed to Vercel or Netlify.

- All markup lives between `<x-dc>` and `</x-dc>` and uses inline styles.
- `{{ name }}` holes are values computed in the `Component` class at the bottom of the file (`renderVals()`).
- `<sc-for>` is a loop and `<sc-if>` is a conditional.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy and interactions are final. Recreate them pixel-accurately.

Several items are **placeholders** and must be replaced before launch:
- All package prices.
- Testimonial quotes and names.
- Phone number `+998 71 200 00 00`.
- The address.
- The Telegram link `https://t.me/`.
- "15 yildan beri" (15 years in business).

## Data model
Each city has two parts.

**Display data** (the `CITIES` array):
- `key`, `name`, `country`
- `hue`: OKLCH hue used for the accent color
- `from`: flight time shown in the city list
- `img`: the hero image
- `img2`: optional secondary image for the Packages section; falls back to `img`
- `pos`: object-position for the image
- `tagline`

**Content** (the `D[key]` object):
- `season`, `visa`, `tz`, `flight`
- `pk`: 3 packages, each `[title, days, price, desc]`
- `ex`: 4 experiences, each `[title, desc]`
- `q`: the testimonial, `[quote, author]`

Copy all the Uzbek text verbatim from the file into a `cities.ts` data file. This content should ideally come from a CMS later.

## Screens / Sections (top to bottom)

### 1. Header
Position absolute, overlaid on the hero.
- **Padding:** `clamp(18px,4vw,28px) clamp(20px,5vw,72px)`.
- **Logo:** "KARVON" in Cormorant Garamond 600, 30px, letter-spacing 0.02em.
- **Desktop nav:** Yo'nalishlar, Paketlar, Tajribalar, Biz haqimizda, Aloqa.
  - Manrope 13px, uppercase, letter-spacing 0.08em, color `rgba(243,239,231,0.82)`.
  - Gap `clamp(16px,2.4vw,32px)`.
- **CTA "Buyurtma berish":** pill with a 1px border `rgba(243,239,231,0.4)`, padding 12px 22px, 13px uppercase.
- **Mobile (<760px):** the nav and CTA are replaced by a **"Menyu"** pill button (min-height 44px). The label becomes "Yopish" when the menu is open.
  - The menu is a fullscreen overlay on `#0e0d0c`, padding 120px 24px 40px.
  - Links are Cormorant 38px, with a 1px divider `rgba(243,239,231,0.12)` between them.
  - A full-width accent pill "Buyurtma berish" sits at the bottom.

### 2. Hero (`#yonalish`)
- **Layout:** min-height 100vh, flex column, content aligned to the bottom. Padding `clamp(120px,18vw,180px) clamp(20px,5vw,72px) clamp(32px,5vw,48px)`.
- **Background:** all city images are stacked with `object-fit: cover`. Only the active one has opacity 1, crossfading over 1.2s. The active image scales from 1.06 to 1.0 over 7s ease-out (slow Ken Burns zoom).
- **Scrim**, two layered gradients:
  - `linear-gradient(90deg, rgba(14,13,12,.72) 0%, rgba(14,13,12,.35) 45%, transparent 75%)`
  - `linear-gradient(180deg, rgba(14,13,12,.7) 0%, rgba(14,13,12,.15) 30%, rgba(14,13,12,.55) 60%, rgba(14,13,12,.97) 100%)`
- **Left column:**
  - Eyebrow: 40px accent line plus the country name, 12px uppercase, letter-spacing 0.22em, accent color.
  - H1: city name in Cormorant 500, `clamp(60px,10vw,180px)`, line-height 0.85, letter-spacing -0.02em.
  - Tagline: Cormorant italic `clamp(20px,2vw,28px)`, color `#f3efe7`, text-shadow `0 1px 18px rgba(0,0,0,.6)`, max-width 520px.
- **Right column, desktop:** city list card, flex `0 1 340px`.
  - Background `rgba(14,13,12,0.72)` with backdrop-blur 14px, radius 4px.
  - Each row is a 3-column grid (36px / 1fr / auto): number, name, flight time. Manrope 14px uppercase, letter-spacing 0.12em.
  - Active row: text opacity 1, bottom border 0.9 alpha, number in the accent color.
  - Inactive rows: text 0.6, border 0.18.
- **Mobile:** a horizontally scrolling row of pills (min-height 44px).
  - Active pill: accent background, `#0e0d0c` text.
  - Inactive pills: `rgba(14,13,12,.45)` background, cream text.

### 3. Search bar + facts
- **Search form:** grid `repeat(auto-fit, minmax(min(100%,180px),1fr))` with a 1px gap. The gap color `rgba(243,239,231,.12)` acts as the dividers. Cells are `#141311`, padding 20px 24px.
  - **Manzil:** the current city and country (read-only).
  - **Sana:** opens a calendar popover.
    - Width `max(100%, min(320px, 100vw - 40px))`, background `#1a1816`, shadow `0 24px 60px rgba(0,0,0,.5)`.
    - Month navigation with ‹ › buttons; the range is 13 months from Oct 2026.
    - Weekdays: Du Se Ch Pa Ju Sh Ya, Monday first.
    - Past days are disabled at 0.22 alpha. The selected day is an accent-filled circle.
    - The selected date shows as "14 Noyabr 2026".
  - **Mehmonlar:** dropdown with 1 kishi, 2 kishi, 3–4 kishi, 5–6 kishi. The default is "2 kishi".
  - **Submit "Sayohatni rejalashtirish":** accent background, 13px, weight 700, uppercase. It opens the booking modal.
  - Clicking outside closes any open popover.
- **Facts row:** grid `minmax(min(100%,150px),1fr)`, padding-top `clamp(40px,6vw,56px)`.
  - Items: Parvoz, Eng yaxshi mavsum, Viza, Vaqt farqi.
  - Label: 11px uppercase at 0.55 alpha. Value: Cormorant 26px. Each item has a 1px top border.

### 4. Packages (`#paketlar`)
- **Layout:** 2-column grid `minmax(min(100%,440px),1fr)`.
- **Left column:** sticky on desktop (top 40px), static on mobile.
  - Eyebrow "{City} paketlari" in the accent color.
  - H2 "Har bir kun oldindan o'ylangan" in Cormorant `clamp(44px,5vw,72px)`.
  - Image with aspect 4/5 on desktop and 4/3 on mobile. All city images are stacked and crossfade.
- **Right column:** 3 articles, each with a 1px top border and padding 40px 0.
  - Meta row: "01 · 4 kun" on the left, "$2 300 dan" on the right.
  - Title in Cormorant `clamp(32px,3.2vw,44px)`.
  - Description at 16px / 1.65, 0.75 alpha.
  - Link "Batafsil va buyurtma →" in the accent color. It opens the booking modal with the package name prefilled.

### 5. Experiences (`#tajriba`)
- **Section background:** the accent color at 14% alpha (`oklch(0.80 0.11 hue / 0.14)`), transitioning over 1s.
- **Heading row:**
  - H2 "{City}da faqat siz uchun ochiladigan eshiklar".
  - Side note: "Har bir tajriba istalgan paketga qo'shiladi yoki alohida band qilinadi."
- **Cards:** grid of 4, `minmax(min(100%,240px),1fr)`, gap 16px.
  - Background `#0e0d0c`, 1px border at 0.14 alpha, padding 36px 28px 44px.
  - An 8px accent dot, a Cormorant 28px title and a 15px description.

### 6. About (`#biz`)
- **Left:** eyebrow "Nima uchun Karvon" and H2 "15 yildan beri sayohatni tafsilotlardan quramiz".
- **Right:** a 2×2 grid. Each item has a 16px/700 title and a 15px text.
  - Shaxsiy menejer
  - Viza va hujjatlar
  - Tekshirilgan joylar
  - Shaffof narx

### 7. Testimonial
- Centered. A large accent “ glyph (Cormorant `clamp(72px,10vw,96px)`).
- Blockquote in Cormorant italic `clamp(28px,3.4vw,48px)`, max-width 900px.
- Author in 13px uppercase.

### 8. Contact CTA (`#aloqa`)
- Full-bleed city image under a `rgba(14,13,12,.72)` overlay.
- H2 "{City}ga sayohatni bugun rejalashtiring" in `clamp(48px,6vw,88px)`.
- Two pills:
  - "Qo'ng'iroq buyurtma qilish": accent background. It opens the booking modal.
  - "Telegramda yozish": outlined. It opens Telegram in a new tab.

### 9. Footer
- "Karvon" logo (Cormorant 24px).
- Address and phone.
- "Yuqoriga ↑" link back to the top.

### Booking modal
- **Overlay:** fixed, `rgba(8,7,6,.78)` with blur 8px. Clicking the backdrop closes it.
- **Card:** max-width 520px, background `#141311`, padding `clamp(24px,6vw,40px)`.
- **Header:**
  - Eyebrow "{City} · {date} · {guests}" in the accent color.
  - Title: the package name, or "{City}ga sayohat" if none was chosen.
- **Fields:** Ismingiz and Telefon (`type=tel`).
- **Validation:** the phone needs ≥ 9 digits. Otherwise show "Telefon raqamini to'liq kiriting" in `oklch(0.75 0.14 25)`.
- **Success state:** "Rahmat, {name}!" plus a confirmation text and a "Yopish" button.
- **Production:** POST the request to a backend, for example a Telegram bot API or a form service. The prototype only simulates success.

## Interactions & Behavior
- **City selection:** clicking a city updates every section.
  - The selection persists in localStorage (`tourvia_city`; rename it to `karvon_city`).
  - The `startCity` prop sets the initial city.
- **Autoplay** (optional, prop `autoplay`): cycles to the next city every 8s. It pauses while the modal, a popover or the mobile menu is open.
- **Nav links:** smooth-scroll to the section ids and close the mobile menu.
- **Transitions:**
  - Image crossfade: 1.2s ease.
  - Accent color changes: 0.8–1s.
  - City list rows: 0.4s.
- **Responsive breakpoint:** 760px (mobile menu, city pills, non-sticky packages image). Everything else is fluid via `clamp()` and `auto-fit` grids.
- **Touch targets:** minimum 44px.

## Design Tokens
**Background**
- `#0e0d0c`: page
- `#141311`: cells / modal
- `#1a1816`: popovers

**Text**
- Cream `#f3efe7`
- Muted alphas: 0.82, 0.75, 0.7, 0.6, 0.55, 0.45

**Lines**
- `rgba(243,239,231,0.12–0.18)`

**Accent**
- `oklch(0.80 0.11 {hue})`
- Hues: Rim 225, Dubay 70, Istanbul 35, Parij 300, Tokio 350, Nyu-York 95

**Fonts**
- Cormorant Garamond (400/500/600, italic 400/500): headings
- Manrope (400–700): UI and body
- Both from Google Fonts.

**Radius**
- 2px: cards / images
- 4px: form / modal
- 999px: pills

**Gutter**
- `clamp(20px,5vw,72px)`

**Section padding**
- `clamp(80px,12vw,140px)` or `clamp(72px,10vw,120px)`

## Assets (hotlinked, free licenses)
Download these, then self-host and optimize them (e.g. `next/image`, WebP, about 2000px wide).

- **Rim (Colosseum aerial):** https://images.unsplash.com/photo-1555992828-ca4dbe41d294
- **Dubay (Burj Khalifa aerial):** https://images.unsplash.com/photo-1566972638537-8c04edd6aa4d
- **Istanbul (Hagia Sophia drone):** https://images.pexels.com/photos/19161622/pexels-photo-19161622.jpeg
- **Parij:** https://images.unsplash.com/photo-1502602898657-3e91760cbb34
- **Tokio (Shibuya aerial):** https://images.unsplash.com/photo-1770752609290-264c53dc54a3
- **Nyu-York (Central Park aerial):** https://images.pexels.com/photos/14426200/pexels-photo-14426200.jpeg

Unsplash and Pexels licenses allow commercial use. Crediting the photographers is good practice.

## Files
- `Karvon Bosh sahifa.dc.html`: the full prototype (markup, plus all data and logic in the `Component` class).
- `support.js`: the prototype runtime (reference only).

## Suggested Claude Code prompt
> Read `design_handoff_karvon_homepage/README.md` and the HTML prototype. Build this homepage as a Next.js + Tailwind app, with city data in `src/data/cities.ts` and components per section. Match the design pixel-accurately, including the mobile layout at <760px. Then initialize git and prepare the project for pushing to GitHub.
