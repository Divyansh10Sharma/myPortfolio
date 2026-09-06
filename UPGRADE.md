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

### 2. DOM grain overlay — NEXT

The post pass only touches the canvas. All body text is DOM sitting above it, so
it currently receives no grain and no aberration — which is the single most
visible remaining seam between "a page with a canvas behind it" and "a surface".

A fixed, `pointer-events: none` layer above everything, carrying the same noise,
jittered on a cheap interval so it does not crawl.

**Why:** unifies text and canvas without moving text into WebGL.
**Effort:** ~1h. **Cost:** one composited layer; negligible if animated by
transform only.
**Risk:** get it wrong and text legibility suffers. Keep it under ~4% opacity.

---

### 3. Scroll-velocity response on DOM content

Sections lag and skew very slightly as the page moves, settling when it stops —
the same velocity number the headline shader already uses, applied to DOM
transforms.

**Why:** the page currently scrolls smoothly but rigidly. Everything moving as
one flat sheet is the clearest tell that content and motion are separate systems.
**Effort:** ~2h. **Cost:** transforms only, compositor-friendly.
**Risk:** overdone this reads as broken. Ceiling of a few degrees and a few
pixels.

---

### 4. Depth in the background

Replace the flat gradient with something that has real perspective: layered
planes or a lightly displaced mesh, drifting with the pointer and with scroll,
under a perspective camera rather than the current orthographic one.

**Why:** the background is currently 2D pretending to be atmospheric. Depth is
most of what makes Active Theory's backgrounds feel like spaces.
**Effort:** ~3–4h. **Cost:** real, and it stacks with the post pass. Desktop
only.
**Risk:** the largest visual change in this list. Easy to make it noisy. It has
to stay calm.

---

### 5. Magnetic links and cursor states

Links pull the cursor ring toward them within a radius; the ring changes shape
over different kinds of target rather than only scaling.

**Why:** the cheapest remaining "everything responds to me" win.
**Effort:** ~1.5h. **Cost:** nil.
**Risk:** magnetism on small text hurts usability. Apply to large targets only.

---

### 6. Text choreography

Section headings arrive per word or per line with real stagger rather than a
single fade. Possibly variable-weight animation on the hero.

**Why:** entrances are currently uniform. Studio work varies rhythm to direct
attention.
**Effort:** ~2h. **Cost:** nil.
**Risk:** must not delay reading. Anything gating content on animation is wrong.

---

### 7. Preloader-to-hero handoff

Currently the loader wipes away and the hero reveals independently. Make it one
continuous move: the counter becomes part of the hero's arrival.

**Why:** the first three seconds set the whole impression, and right now they
are two separate animations that happen to be adjacent.
**Effort:** ~2h. **Cost:** nil.

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

### 10. Performance re-pass

After the above: Lighthouse again, profile on a real mid-range Android, and
revisit the payload. The React port ships ~358KB gzipped against 188KB for the
vanilla build, and every item here adds to that.

**Why:** the stated audience is mid-range Android on patchy 4G. Everything above
is desktop-facing and the phone experience must not quietly rot while we work.

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
