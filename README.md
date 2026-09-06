# Divyansh Sharma — portfolio

A personal site built as a WebGL surface with a real HTML document underneath it.
Near-black, type-led, deliberately slow. Vanilla JavaScript, raw Three.js, hand-written
GLSL — no framework, no 3D abstraction layer.

**Live:** https://my-portfolio-lyart-rho-28.vercel.app

---

## What it is

One page. A shader background that drifts with scroll, a photograph that warps toward the
pointer, and a headline that bows as the page moves. Everything eases over 0.8–1.6 seconds
rather than snapping, which is most of why it reads as calm rather than busy.

The design brief was Active Theory's craft level, translated to one person and a
weekend: deep black, one accent colour, grain over everything, a lot of empty space.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Build | Vite 8 | Fast, and its native `?raw` import is how the `.glsl` files get in |
| 3D | Three.js | Used directly — no React Three Fiber |
| Shaders | Raw GLSL in `.glsl` files | Separate files, not template strings jammed into JS |
| Animation | GSAP + ScrollTrigger | Free since April 2025, all plugins |
| Smooth scroll | Lenis | Drives the shaders as well as the page |
| Fonts | Archivo + IBM Plex Mono | Self-hosted via `@fontsource`, latin subsets only |
| Hosting | Vercel | Push to deploy |

No React and no TypeScript on this build. That is a deliberate scope decision, not a
preference: a framework port costs a day, and vanilla Three.js is the part actually worth
showing.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview  # serves the real production build
```

`LEARNING.html` is not part of the site. Open it directly in a browser — it is a
self-contained, paginated write-up of every technique here, one concept per page.

## Structure

```
index.html              All content, as real markup
src/
  main.js               Entry point and motion layer, in execution order
  style.css             Palette, type, layout
  cursor.js             Pointer ring that lags behind the real cursor
  preloader.js          Loading state with honest progress
  webgl/
    Stage.js            Renderer, scene, camera, the frame loop
    DomPlane.js         Maps DOM rects into WebGL space
    PhotoPlane.js       The photograph, as a shader surface
    TextPlane.js        The headline, painted to a canvas then distorted
  shaders/
    background.vert/frag  Gradient + film grain
    plane.vert            Shared by both DOM-synced planes
    photo.frag            Pointer warp + chromatic aberration
    text.frag             Scroll-driven bow
```

Every shader file opens with a plain-language comment block explaining what it does before
any code.

---

## Things that were actually hard

**Getting WebGL to line up with the DOM.** The browser lays out the page in coordinates
that start at the top-left and grow downward. WebGL's start at the centre and grow upward.
Drawing a shader exactly over a real element means translating between them on every
frame — and doing it without calling `getBoundingClientRect()` sixty times a second, which
forces a layout recalculation and is the usual reason a WebGL site stutters when you
scroll. The fix is to measure rarely and store positions relative to the document rather
than the viewport, so scrolling becomes arithmetic instead of measurement. That is
`DomPlane.js`, and it is the load-bearing file.

**WebGL cannot render text.** It has no concept of a letter. The headline is drawn onto an
ordinary 2D canvas — reading the real `<h1>`'s computed font, weight and letter-spacing so
the painted copy cannot drift from the CSS — and that canvas is handed to the GPU as a
texture. The shader is bending an image and has no idea it is words.

**Distortion is a lie about where to look.** No pixel ever moves. Both effects work by
having each pixel sample the texture from slightly the wrong place: toward the pointer for
the photograph, further off in the middle than at the edges for the headline. Chromatic
aberration is the same trick three times, once per colour channel.

**Banding.** A gradient this dark and this gradual does not have enough of the 256
available levels per channel to be smooth, so it shows visible rings. The film grain is
not only a texture decision — it is dithering, and it is what makes the background look
continuous.

**Deciding what to switch off.** There is no reliable way to ask a browser how fast its GPU
is, and the available proxies are misleading. `navigator.deviceMemory` is Chrome-only, so
treating "absent" as "low" silently downgrades every Firefox and Safari visitor. "Is this
machine weak" and "is this a touch screen" are genuinely different questions and
conflating them serves a capable desktop the phone experience.

## Performance and fallbacks

The audience is largely on mid-range Android over patchy 4G, so this is treated as a
correctness requirement rather than a polish pass.

- **The site works with no WebGL at all.** Every word is real DOM. The photograph is a real
  `<img>` and the headline is a real `<h1>`; the shaders draw on top and the elements are
  only hidden once a shader is genuinely painting. If the context fails, the canvas is
  removed and the page is simply a fast, plain, correct document.
- **It works with no JavaScript.** The CSS that hides elements before they animate is gated
  behind a class that JavaScript adds, so a bundle that never loads cannot leave a blank
  page.
- **Touch and narrow viewports skip both signature effects.** A touch screen has no pointer
  to warp toward. The shader background stays, because it is cheap and carries the mood.
- **Weak devices** get `devicePixelRatio` clamped to 1, a 30fps cap, and lighter grain. A
  3x phone screen is nine times the pixels for the same physical area, and this shader runs
  per pixel — the pixel ratio is the single biggest lever available.
- **`prefers-reduced-motion` gets a genuinely static version**, not a faster one: no smooth
  scroll, no loop, no distortion, no loading screen, all content visible immediately.
- **Failsafes.** Anything visible but still transparent 2.5 seconds after load is shown
  regardless, and if either shader never reveals itself the DOM element it was hiding is
  handed back. Animation is decoration; the words are not.
- Initial payload is roughly 260KB gzipped, most of it Three.js.

## Accessibility

Real semantic markup, one `<h1>`, a working skip link, visible focus rings, and a
decorative canvas marked `aria-hidden`. The custom cursor is an addition — the real system
cursor stays visible, because hiding it makes people lose track of where they are pointing.

Secondary text and the accent colour were both lightened from the old site's values, which
were designed for ink on paper and did not clear WCAG AA when inverted onto near-black.

## Content

All copy lives in `CONTENT.md` and the previous site's data file. Nothing on this page was
invented; anything missing is tracked as an explicit `TODO` in `CONTENT.md`.

> **Outstanding:** the photograph's alt text is currently a placeholder written by Claude
> and must be replaced before launch. See `CONTENT.md`.

## Deploying

Push to `main`. Vercel is connected to this repo and builds every push.

```bash
git add .
git commit -m "your message"
git push
```

The previous version of this site (a light, spec-sheet layout in React and
Tailwind) is preserved on the `v1-spec-sheet` branch.
