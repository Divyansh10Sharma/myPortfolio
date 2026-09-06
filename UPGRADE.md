# UPGRADE.md — closing the gap to Active Theory

Working branch: **`pizza`**, cut from `react-port` (React + TypeScript + R3F).

The site shipped and is presentable. This file is the plan for taking it from
"good personal site" to something that stands next to studio work. One item at a
time, each one finished and reviewable before the next starts.

## Ground rules

- **Claude does not commit, push, or deploy.** Divyansh runs every git write
  operation. Claude edits, builds, verifies, and stops.
- **One item at a time.** Each lands in a working state. No half-finished
  effects left in the tree.
- **Every item keeps the mobile fallback and `prefers-reduced-motion` intact.**
  Effects are added on top of a page that still works without them, never
  bolted through the middle of it.
- **Measure, don't assert.** Each item that touches the frame loop gets a
  rough cost noted, and Lighthouse gets re-run at the end.

---

## Where the gap actually is

Honest assessment rather than a wishlist. Active Theory's advantage is not one
missing feature, it is six.

| | This site | Active Theory |
|---|---|---|
| **Compositing** | Canvas behind, DOM text above — two layers that overlap | One composited image; every pixel goes through the same final pass |
| **Depth** | Flat planes, orthographic camera, no perspective | Real depth, camera movement, parallax layers |
| **Choreography** | Elements fade up independently on scroll | Sequenced motion where elements respond to each other |
| **Type** | DOM text; one headline distorted | Type as a first-class WebGL citizen throughout |
| **Transitions** | Anchor scrolling | No reload — the WebGL context survives navigation |
| **Sound** | None | Designed, toggleable, tied to interaction |

---

## The queue

### 1. Post-processing pass — ✅ DONE

One render target, one final shader over the whole scene: chromatic aberration
that scales with distance from centre and with scroll speed, a vignette, and
the film grain moved here from the background.

**Why it mattered most:** previously only the gradient had grain, so the
photograph and headline sat on top of it looking too clean. Now one layer of
film covers everything the canvas draws.

**Cost:** a second full-screen draw per frame. Disabled on weak and small
devices, and under reduced motion.

**Files:** `shaders/post.frag`, `webgl-r3f/PostProcessing.tsx`, `Scene.tsx`,
`Background.tsx`.

**Also fixed here:** the headline's canvas texture was allocated at the canvas
default 300×150 and then resized, so Three attempted a partial upload into too
small an allocation (`GL_INVALID_VALUE`). Present on `main` too.

---

### 2. DOM grain overlay — ✅ DONE

The post pass only touches the canvas. All body text is DOM sitting above it, so
it currently receives no grain and no aberration — which is the single most
visible remaining seam between "a page with a canvas behind it" and "a surface".

A fixed, `pointer-events: none` layer above everything, carrying the same noise,
jittered on a cheap interval so it does not crawl.

**Done:** `components/Grain.tsx`, `.grain` in `style.css`. Browser-generated
SVG turbulence, 128px tile, jittered ~8 times a second by transform only.

**Sized 110%, not 200%.** The layer is composited, so its area is real memory
and the filter is rasterised across all of it. Opacity 0.038 — worth checking
against the small mono type on a real screen.

---

### 3. Scroll-velocity response on DOM content — ✅ DONE

Sections lag and skew very slightly as the page moves, settling when it stops —
the same velocity number the headline shader already uses, applied to DOM
transforms.

**Done:** `hooks/useVelocitySkew.ts`, applied by `Section`. Max 1.1 degrees of
skew and 14px of lag, eased, snapping to exactly zero when it stops so the
element does not stay promoted or crooked.

**Overview opts out** (`skew={false}`): it contains the portrait, and the WebGL
plane is positioned from the image's measured rectangle. Transforming the
section would move that rectangle every frame and the plane would drift off the
photograph. The reason is written into the component.

It reads the same velocity number the headline shader uses, so DOM and WebGL
respond to one shared input rather than two systems that happen to agree.

---

### 4. Depth in the background — ✅ DONE

Replace the flat gradient with something that has real perspective: layered
planes or a lightly displaced mesh, drifting with the pointer and with scroll,
under a perspective camera rather than the current orthographic one.

**Done:** `webgl-r3f/DepthField.tsx`, `shaders/depth.vert`, `shaders/depth.frag`,
`state/layers.ts`. 260 square marks scattered through a volume, under a real
perspective camera that leans toward the pointer.

**The constraint that shaped it:** the canvas camera is orthographic and has to
stay that way, because `useDomPlane` relies on one world unit being one CSS
pixel to align the photograph and headline with their DOM elements. Perspective
would break that mapping. So the depth field brings its own scene and camera and
registers through `state/layers.ts` to be drawn first; PostProcessing, which
already owns the render loop, calls it before rendering the main scene with
`autoClear` off.

**Why the camera moves and not the marks:** moving the camera gives real
parallax for free — near marks slide further than far ones because that is what
perspective does. Moving the marks would slide them all equally and the depth
would collapse.

**Fallback:** with post off (weak, small, reduced motion) the flat gradient
comes back. Atmosphere without depth, rather than a hole.

Square marks, not dots, and no colour — the motif is carried over from the old
site's hero field.

---

### 5. Magnetic links and cursor states — ✅ DONE

Links pull the cursor ring toward them within a radius; the ring changes shape
over different kinds of target rather than only scaling.

**Done:** `hooks/useMagnetic.ts`, applied to `.email` and `.nav__resume` only.
Both are large enough that a few pixels of travel cannot affect aim; body links
and nav items are deliberately excluded, because a small target that moves as
you aim at it is a usability bug wearing polish.

Uses `gsap.quickTo` — one reusable tween per property per element. Calling
`gsap.to()` on every pointer move, which is the obvious version, leaves dozens
of overlapping tweens fighting over the same property.

Cursor now has three states rather than one: clickable, leaves-the-site
(filled, accent), and expandable (wider, squarer).

---

### 6. Text choreography — ✅ DONE

Section headings arrive per word or per line with real stagger rather than a
single fade. Possibly variable-weight animation on the hero.

**Done:** `components/SplitReveal.tsx`, applied to every section `h2`.
SplitText splits the heading into lines, each masked, rising from behind its own
baseline with 0.08s of stagger.

Headings only. Staggering body copy makes it slower to read for no gain.

Splits after `document.fonts.ready`, because SplitText measures where lines
break and the fallback face breaks them in the wrong places. Splits while the
element is still transparent so there is no flash of un-split text, and carries
a 2.5s failsafe in case fonts never resolve. `split.revert()` on unmount, or the
injected wrappers outlive the component and React reconciles against DOM it did
not create.

---

### 7. Preloader-to-hero handoff — ✅ DONE

Currently the loader wipes away and the hero reveals independently. Make it one
continuous move: the counter becomes part of the hero's arrival.

**Done:** the loader now fires `onReveal` the instant the panel *starts*
lifting, not when it finishes. App splits this into two flags — `ready` (start
moving) and `loading` (safe to unmount) — and threads `ready` into both the hero
`Reveal`s and the headline shader.

**The bug this fixes:** hero reveals used ScrollTrigger, the hero is at the top
of the page, so they fired on mount — behind the loading screen — and were
finished before anyone saw them. The opening was a loading screen followed by a
static page.

Now the hero starts moving while the panel is still travelling, so the panel
appears to pull the page up behind it. One movement instead of two.

---

### 8. Page transitions — BIGGEST

Add routing, keep the WebGL context alive across route changes, and transition
between pages without a reload. Needs a second page to exist to be worth
anything — a project detail page, most likely.

**Why:** persistent context across navigation is a defining Active Theory trait.
**Effort:** a day or more, plus writing whatever the second page contains.
**Risk:** the naive version leaks GPU memory on every navigation. Content does
not exist yet and must not be invented.

---

### 9. Sound

A toggle, off by default, with quiet interaction sounds.

**Why:** high perceived polish for the effort.
**Effort:** ~2h plus sourcing audio. **Risk:** must be off by default and
obviously toggleable.

---

### 10. Performance re-pass — ⚠️ PARTIAL

After the above: Lighthouse again, profile on a real mid-range Android, and
revisit the payload. The React port ships ~358KB gzipped against 188KB for the
vanilla build, and every item here adds to that.

**Why:** the stated audience is mid-range Android on patchy 4G. Everything above
is desktop-facing and the phone experience must not quietly rot while we work.

**Measured (2026-09-06):**

| | |
|---|---|
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| JS shipped, gzipped | 354 KB (three 179, app 116, react 59) |
| Everything in `dist`, gzipped | 560 KB |

**Performance score not measured, deliberately.** Headless Chrome here runs
WebGL through SwiftShader — software rendering — and the post-processing pass
makes a full page load take six minutes. Any number produced under that measures
the software renderer, not the site. It has to be run on real hardware.

**Fixed in this pass:** the grain overlay no longer jitters on touch devices and
drops its `will-change` promotion there. Keeping a full-screen composited layer
repainting on a phone, for a texture nobody is inspecting, was the clearest
unnecessary cost added by items 1–7.

**Still outstanding, and the honest headline:** the React port ships **354 KB**
of JavaScript gzipped against **188 KB** for the vanilla `main`. Three is 179 KB
of that and is not negotiable while the site is WebGL. React plus R3F is the
rest. On patchy 4G this is the single biggest real-world regression in the whole
upgrade, and no amount of shader work offsets it.

Options, none free:
- Accept it, and treat desktop as the audience the effects are for.
- Lazy-load the whole WebGL layer after first paint, so the text arrives fast
  and the canvas follows. Roughly a day, and the largest available win.
- Keep vanilla `main` live and treat `pizza` as the showcase build.

**Not yet done:** profiling on a real mid-range Android. Nothing in this file
substitutes for that.

---

## Out of scope

- Inventing copy. Anything new goes in `CONTENT.md` first, written by Divyansh.
- The TelemetryStrip rebuild — still an open question in `CONTENT.md`, and it
  needs a decision before it needs code.
- Rebuilding the vanilla `main` branch to match. It stays as it is: shipped,
  live, and the lighter of the two.

## Open decisions

- **Which signature effect stays** — the bowing headline or the warping photo.
  Both are still live. `CLAUDE.md` said pick one.
- **Whether `main` or `pizza` eventually becomes the live site.**
