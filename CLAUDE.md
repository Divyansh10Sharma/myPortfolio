# CLAUDE.md

## Hard constraints — read these first

**Deadline: 48 hours, 72 at absolute most.** This site is going on a resume and
into interviews this week. A shipped, slightly simpler site beats an unfinished
ambitious one. Every decision gets made in favour of shipping.

**Token budget: I'm on Claude Pro.** Limits reset every 5 hours. I need a session
to last at least 4 hours of real work. If you burn my quota in one hour by
re-reading files and writing essays in chat, the project dies. Token discipline
is a hard requirement, not a preference. See the token rules below.

**I still want to learn all of it.** But not in the chat. All teaching goes into
`LEARNING.html`, which I read separately while you keep building. See the
teaching section.

## My level

Comfortable with JavaScript, React, normal web development. **Zero** experience
with WebGL, Three.js, shaders, GLSL. Assume I know nothing about graphics and
everything about regular programming.

---

## Token rules — non-negotiable

1. **Chat replies stay under ~150 words.** State what you did, what's next, any
   blocker. Nothing else. No summaries of code you just wrote, no recaps of the
   plan, no "great question."
2. **Never paste file contents into chat.** Not code you wrote, not code you
   read. I'll open the file myself.
3. **Read a file once.** Don't re-read what's already in context. Don't re-read
   CLAUDE.md or CONTENT.md mid-session.
4. **Never read `node_modules/`, `package-lock.json`, or `_old-reference/node_modules/`.**
5. **Batch edits.** Write a whole file in one pass rather than five small edits.
   Plan the file before writing it.
6. **Don't ask permission for small things.** Naming, folder structure, easing
   values, hex codes — just decide. Ask only when it's irreversible or a real
   design fork.
7. **No verification loops.** Don't re-read a file to confirm your own edit
   landed. Don't run the dev server and screenshot repeatedly.
8. **When I say `/clear` is coming, write a 10-line handoff to `STATE.md` first:**
   what's done, what's next, current file structure. That's how we survive
   context resets cheaply.

If a task would be expensive, say so in one line and give me a cheaper option
before doing it.

---

## What we're building

A personal portfolio in the style of **https://activetheory.net/** — you can't
load it (it's fully JS-rendered), so work from this description:

Deep black background. High-contrast type, colour used once or twice as accent.
Grain over everything. Subtle distortion and chromatic aberration. Nothing
appears instantly — slow eases, 0.8–1.6s, not snappy 200ms UI transitions.
Scroll glides with momentum and drives the shaders. Custom cursor. Designed
loading state. Lots of empty space. It feels expensive because it's calm.

The *feeling*, not a pixel copy. I'm one person, not a studio.

---

## Content sources

Exactly two. Nothing else.

1. **`./CONTENT.md`** — new copy for this redesign. Hero, system one-liners,
   decisions already made. **Wins wherever it conflicts with the old site.**
2. **`./_old-reference/`** — old portfolio, read-only. Everything CONTENT.md
   doesn't cover: name, bio, job, projects, experience, links, dates, headings.
   The copy lives in `_old-reference/src/data/index.js` — read that file, not the
   whole repo.

- **Never invent copy.** No lorem ipsum, no placeholder bios, no made-up
  descriptions. Missing something? Leave `TODO: [what you need]` and tell me.
- Don't edit anything in `./_old-reference/`.
- You may append new copy I give you in chat to `./CONTENT.md` so it survives a
  context reset.

---

## Teaching — it all goes in LEARNING.html

Build `LEARNING.html` at the start of Sprint 1 and append to it as you go. It's a
single self-contained HTML file (inline CSS and JS, no dependencies, no build
step) that I open directly in a browser.

### Format

- **Paginated.** One concept per page. Prev/Next buttons, arrow-key support, a
  page counter, and a clickable contents list.
- Dark theme, generous line height, readable at 18px+. Code blocks in monospace
  with a subtle background.
- Self-contained. No CDN links, no fonts to download. It must work offline.
- Add pages by appending to a JS array of page objects. Don't restructure the
  file each time.

### Every page follows this order

1. **The idea, for a 10-year-old.** Plain language, real-world analogy, **zero
   jargon**. Torches, water, shadows, flipbooks, painters, bedsheets. If you
   write "vertex" or "buffer" here, you've failed the page.
2. **Why it's in my site.** Two sentences. What it does for this specific build.
3. **The translation.** Map the kid words to real terms explicitly: "the painters
   = fragments, the instruction card = the fragment shader, where each painter
   stands = UVs."
4. **The code**, with the reasoning in the comments — why the line exists, not
   what the syntax does.
5. **Go poke it.** 2–3 exact numbers to change, the file and line, and what I
   should see. This is the only work I do and it's what makes it stick.
6. **What usually breaks.** The 2–3 common mistakes and their symptoms. "Screen
   pure black? Almost always X."

Never skip step 1. It's the entire point of the file.

### In chat, meanwhile

One line: "Added LEARNING.html pages 4–6: shaders, UVs, uniforms." That's it. The
teaching is in the file, not the conversation.

---

## Stack

Vite + vanilla JS + Three.js + GSAP + Lenis. All free. Zero budget.

- GSAP is fully free since April 2025, all plugins included — ScrollTrigger,
  SplitText, ScrollSmoother. Use them.
- Shaders in `.glsl` files, imported with Vite's native `?raw`:
  `import frag from './shaders/x.glsl?raw'`. **No `vite-plugin-glsl`** — it
  doesn't support Vite 8.
- **No React, no TypeScript, no React Three Fiber on this build.** Not because
  they're bad, but because a framework port costs a day I don't have. Vanilla
  Three.js is what makes this resume-impressive anyway. R3F is a post-launch
  project.
- Don't add any dependency without telling me in one line what it does and why we
  can't skip it.

---

## Build order — 4 sprints, not 8 phases

**Deploy to Vercel at the end of every sprint.** I want a live link from hour
four onward, so if time runs out I still have something to send.

**Sprint 1 (~4h) — Skeleton, live.**
Vite cleanup, real content from CONTENT.md + `_old-reference/src/data/index.js` in
real DOM, dark theme, Archivo or similar, full layout, meta tags, OG, favicon.
Lenis smooth scroll. GSAP SplitText hero reveal. Deploy. **This alone is already
a better portfolio than the old one** — if everything after this fails, I still
ship.
LEARNING.html pages: render loop concept, lerp, easing, why rAF.

**Sprint 2 (~6h) — WebGL background.**
Full-screen canvas behind the DOM. One fragment shader: animated grain + a slow
gradient that reacts to scroll position. Deploy.
LEARNING.html: what a shader is, vertex vs fragment, UVs, uniforms, time,
noise.

**Sprint 3 (~6h) — The signature effect.**
Pick **one** and do it well: either the hero text distorting on scroll, or the
photo as a shader plane that warps on hover. Not both. Add the custom cursor and
a designed preloader. Deploy.
LEARNING.html: textures, DOM→WebGL coordinate mapping, render targets.

**Sprint 4 (~4h) — Ship.**
Mobile fallback, `prefers-reduced-motion`, Lighthouse pass, README, final deploy.
LEARNING.html: performance, dispose, why WebGL kills mid-range phones.

**Cut list, in this order, if time runs short:** page transitions, post-processing
stack, TelemetryStrip rebuild, sound. All post-launch.

Sprint 1 is not optional and not negotiable. Get the live link first.

---

## Performance — matters for real here

Most of my audience is on mid-range Android in India.

- Detect low-end devices and degrade: skip post-processing, cap
  `devicePixelRatio` at 2, simpler shaders. Build this in Sprint 2, not Sprint 4.
- Respect `prefers-reduced-motion` with a genuinely static version.
- **Real HTML text in the DOM, always.** The site must read and navigate fine if
  WebGL fails entirely. This is also why Sprint 1 comes first.
- Under 2MB initial payload. Compress the photo before using it as a texture.

---

## Design

- Near-black background, off-white text, one accent colour used sparingly.
- **Type is the design.** One typeface, large, generous line height, lots of air.
  Archivo, Satoshi, General Sans or Inter — all free.
- Slow, confident motion. 0.8–1.6s with heavy easing.
- Grain over everything. Cheap, unifies the page, hides gradient banding.
- Sections come from CONTENT.md and the old site. Don't invent new ones.

## Code style

- ES modules, one responsibility per file.
- Shaders in separate `.glsl` files with a plain-language comment block at the top.
- Descriptive uniform names: `uDistortionStrength`, not `u1`.
- Dispose geometries, materials, textures on removal.

## Shipping

Vercel free tier, GitHub connected, push to deploy. Meta tags, OG image,
favicon, robots.txt before Sprint 3. Real README — engineers will open the repo
too. Clean commit messages; the history is part of the portfolio.

## Don't

- Don't write long chat responses. The file is where the words go.
- Don't gold-plate. Shipped beats perfect.
- Don't skip the 10-year-old explanation in LEARNING.html.
- Don't silently fix my mistakes — note them in one line.
- Don't start a sprint before the previous one is deployed and live.