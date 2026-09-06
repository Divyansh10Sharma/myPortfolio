# CONTENT.md — new copy written for the V2 build

This file is **new copy I wrote for the redesign**. It did not exist in the old site.

Precedence: where this file and `./_old-reference/` disagree, **this file wins**.
Everything not covered here still comes from `./_old-reference/` and the same rule
applies — do not invent copy that isn't in one of these two places.

---

## Hero

**Headline** (this is the one, use it):

```
Backend & AI Engineer
```

Changed from "Five codebases. One engineer." on 2026-09-06, at my request. The
replacement is the role title, lifted verbatim from `profile.role` in the old
site's data file — it is not new copy.

**Sub-line** (sits under the headline, smaller):

```
Backend, AI, and native systems at Train Rex — from a multi-agent coaching
model to a step counter that reconciles against itself every fifty steps.
```

Notes for you:
- The headline is short on purpose. It needs to be very large — this is the
  single biggest type on the site, roughly 8vw, and it should hold the screen
  alone with a lot of empty space around it.
- The sub-line carries the specificity so the headline doesn't have to. Don't
  merge them into one paragraph.
- Do not add a third line, a tagline, or a "scroll" prompt under this. The
  restraint is the point.

## Role title

Lead with **Backend & AI Engineer**. That's what the old site says and it's the
accurate one. Do not use "Full Stack Engineer" anywhere.

---

## System one-liners

The six system write-ups in `_old-reference/src/data/index.js` are 60–90 words
each. Too dense to be the first thing read on a spacious dark layout.

So each system gets **two layers**: the short line below sits in the layout by
default, and the existing long body from the old data file reveals on
interaction (hover, click, or scroll — your call on the mechanic, propose it to
me first).

Keep the system IDs, names and stack lists exactly as they are in the old data
file. Only the short line is new.

| System | Short line |
|---|---|
| **Rexpert** | A closed-loop coaching system where the AI is never allowed to see the number that matters. |
| **Nutrition engine** | Macros computed in Python. The model only gets to write the meal. |
| **Real-time messaging** | A hand-rolled WebSocket protocol — eleven live event types, offline queue, disk cache. |
| **Step reconciliation** | A sensor that only counts since boot, corrected against the cloud every fifty steps. |
| **Payment reliability** | Three independent layers, because a webhook is not a promise. |
| **Firestore → PostgreSQL** | Reading from both databases in one request until the old one can be switched off. |

**Rexpert keeps its NDA marker.** Carry over the "Details withheld under NDA"
label and the restraint that goes with it. The short line above is deliberately
abstract for that reason — do not elaborate on it, and do not add implementation
detail to that entry from any source.

---

## Closing quote

Supplied by Divyansh in chat on 2026-09-06 and recorded here so it survives a
context reset. Sits above the footer, after Contact, as a sign-off.

```
“Whatever it is, we’re gonna figure it out. It’s gonna happen. How? I don’t
know. But it’s gonna happen.”

— Tom Cruise
```

Notes:
- **The attribution has not been verified.** Divyansh reported it as something
  Tom Cruise said recently; Claude has no way to confirm the wording, the date
  or the source. Check it before this is in front of recruiters — a misquoted
  public figure on a personal site is a small, avoidable own goal.
- Attribution kept deliberately. These are someone else’s exact words, and
  running them unattributed would read as passing them off. If the quote is
  wanted without a name, rewrite the sentiment in Divyansh’s own words instead
  of stripping the credit.

---

## Section headings

Keep the old ones. `Systems I own`, `Where I've worked`, `Side projects`, the
availability line, and the footer line all carry over from
`_old-reference/src/data/index.js` unchanged.

**One exception:** the footer currently reads "Built with React and Tailwind."
That becomes false during this build. Update it to match the real stack at the
end of Phase 3, once the port has actually happened. Leave it alone until then.

---

## Assets

### Photograph

Original: `assets-source/divyansh.jpeg` — 1022x1022, 154 KB, square. Kept in the
repo but outside `public/`, so it is not shipped.

Shipped: `public/divyansh.webp` (23 KB) with `public/divyansh-680.jpg` (47 KB) as
a fallback, both 680x680. That covers the 340px slot at 2x device pixel ratio,
which is where the renderer caps anyway. Showing the photograph any larger than
340px would need a new export from you at around 2000px.

Live on the site as of Sprint 3: it is the Overview portrait, and it is the
subject of signature effect A (the shader plane that warps on hover). The real
`<img>` stays in the DOM and owns the layout, the alt text and the no-WebGL
fallback; the shader is drawn over the top and the image is only hidden once
the texture has actually loaded.

No further images are needed. Sprint 3 is one effect done well, so the project
screenshots that the old "still missing" list asked for are off the list.

**Alt text** (resolved 2026-09-06):

```
Divyansh Sharma, smiling over his shoulder at the camera, leaning on a railing
above a floodlit cricket ground at night.
```

Written from the photograph itself, replacing an earlier placeholder that was
wrong on both counts — it claimed a straight-on portrait against a plain
background. Divyansh should still sanity-check it, since it describes him.

---

## Still missing — do not invent these

Leave a clearly marked `TODO:` wherever these are needed and tell me. I'll write
them and add them to this file.

- **Alt text** for any other image added later.
- **Loader copy.** The preloader currently shows the name and a counter and no
  sentence. If it should say something, write it here.
- **OG image.** The existing `og.png` was rendered in the old light palette and
  will look wrong against a black site. It needs re-rendering once the visual
  direction is settled, with a tagline I'll write then.
- **404 copy.** Needed at Phase 5, not before.

---

## Decisions already made — don't re-ask

- **No Instagram section.** It isn't in the old site and it isn't in this file.
  It's out of scope for V2.
- **Email:** use `divyansh.convivial@gmail.com`, the one on the old site.
- **The real old site is `_old-reference/index.html`.** The file at
  `_old-reference/public/index.html` is an abandoned earlier draft — dark neon,
  Orbitron, "Full Stack Engineer". Ignore it entirely as a content source.
- **The old light palette does not carry over.** Words yes, design no.

---

## TelemetryStrip — open question, not yet decided

The old site has `TelemetryStrip` ("fig. 01"), a hand-built interactive SVG
plotting step-sensor drift, scrubbable with the pointer. It's the most
distinctive thing on the old page and it maps directly onto the step
reconciliation system.

Don't drop it and don't rebuild it yet. When we reach Phase 3, propose two
options for what it becomes in a WebGL context and let me choose.