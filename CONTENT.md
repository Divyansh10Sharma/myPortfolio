# CONTENT.md — new copy written for the V2 build

This file is **new copy I wrote for the redesign**. It did not exist in the old site.

Precedence: where this file and `./_old-reference/` disagree, **this file wins**.
Everything not covered here still comes from `./_old-reference/` and the same rule
applies — do not invent copy that isn't in one of these two places.

---

## Hero

**Headline** (this is the one, use it):

```
Five codebases. One engineer.
```

**Sub-line** (sits under the headline, smaller):

```
Backend, AI, and native systems at Train Rex — from a multi-agent coaching
model to a step counter that reconciles against itself every fifty steps.
```

Notes for you:
- The headline is four words on purpose. It needs to be very large — this is the
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

## Section headings

Keep the old ones. `Systems I own`, `Where I've worked`, `Side projects`, the
availability line, and the footer line all carry over from
`_old-reference/src/data/index.js` unchanged.

**One exception:** the footer currently reads "Built with React and Tailwind."
That becomes false during this build. Update it to match the real stack at the
end of Phase 3, once the port has actually happened. Leave it alone until then.

---

## Still missing — do not invent these

Leave a clearly marked `TODO:` wherever these are needed and tell me. I'll write
them and add them to this file.

- **Photograph of me.** Coming separately. Until it arrives, leave the space and
  the layout intact rather than substituting a placeholder image or a shape.
- **Visual assets for the Phase 3 image planes.** There are no project
  screenshots anywhere in the old repo. Before Phase 3, tell me exactly what you
  need — how many images, what aspect ratio, what minimum resolution — and I'll
  produce them.
- **Alt text** for every image, once the images exist.
- **Loader copy.** What the preloader says while it counts.
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