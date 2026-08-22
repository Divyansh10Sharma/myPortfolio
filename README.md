# Divyansh Sharma — Portfolio

Backend & AI engineer portfolio, built as an **engineering spec sheet**: light,
precise, hairline-ruled, dense with real information. No dark-neon theme, no
glow, no decorative gradients.

## Stack

React 18 · Vite · Tailwind · React Router · deployed on Vercel.

Single page. React Router is kept only so unknown paths redirect to `/`
rather than 404 — including `/rexpert`, which an earlier draft used.

No animation library, no charting library. Motion is CSS transitions plus the
IntersectionObserver API; every chart and diagram is hand-built inline SVG.

## Design system

Defined once as CSS custom properties in [`src/index.css`](src/index.css) and
mapped into Tailwind's theme in [`tailwind.config.js`](tailwind.config.js).
Tailwind's default palette is **replaced**, not extended, so `slate-800` or
`blue-500` cannot be used by accident.

| Token       | Value     | Use                                          |
| ----------- | --------- | -------------------------------------------- |
| `--paper`   | `#E9EBED` | Page background                              |
| `--ink`     | `#14171C` | Primary text                                 |
| `--graphite`| `#5A626D` | Secondary text, labels, annotations           |
| `--rule`    | `#C6CBD1` | Hairlines, gridlines, borders                 |
| `--signal`  | `#1B36E8` | The single accent: links, active states       |
| `--warn`    | `#B4741A` | Data marks in figures only — never UI chrome  |

Type: **Archivo** (headings, 600/700) and **IBM Plex Mono** (the workhorse —
labels, data, nav, captions), with **IBM Plex Sans** for long prose. All three
are self-hosted via `@fontsource`, latin subsets only.

Contrast on `--paper`: graphite 5.16:1, signal 6.41:1, ink 15.03:1 — all clear
WCAG AA.

## Structure

```
src/
  components/         Nav, Footer, Spine, Reveal, Icons
    TelemetryStrip    Hero figure — step-sensor drift (fig. 01)
  sections/           Homepage sections, one file each
  pages/Home.jsx      The single page
  data/index.js       All copy and content — edit here, not in components
```

Content lives in [`src/data/index.js`](src/data/index.js). The section spine,
its numbering and its tick marks come from
[`src/components/Spine.jsx`](src/components/Spine.jsx).

## Confidentiality

The Rexpert entry is deliberately described at capability level only — its
design is under NDA, and the entry carries a visible "Details withheld under
NDA" marker. **Do not add implementation detail to it.** There is a comment to
that effect in `src/data/index.js`.

The other Train Rex entries still describe their internals in some depth. If
your employer would consider any of that sensitive, dial those back the same
way.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run preview
```

## Deploy notes

`SITE_URL` controls the absolute URLs used by `rel=canonical` and Open Graph.
On Vercel it is derived automatically from `VERCEL_PROJECT_PRODUCTION_URL`; set
`SITE_URL` explicitly to pin a custom domain. When neither is set (local
builds), the canonical tag is omitted rather than emitted as a relative URL.

The social card at `public/og.png` was rendered from the site's own type and
palette at 1200×630.

## Quality floor

Verified on the production build with Lighthouse:
performance 98, accessibility 100, best practices 100, SEO 100.

Also verified: no horizontal overflow at 375px, wide figures scroll rather than
squash, visible `--signal` focus rings on every interactive element, a working
skip link, one `h1` per page, and `prefers-reduced-motion` fully respected —
transforms and SVG draw animations disabled, opacity preserved.
