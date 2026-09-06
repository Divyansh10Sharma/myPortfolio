/**
 * Custom cursor.
 *
 * A small ring that chases the real pointer rather than being pinned to it —
 * the same walk-a-fraction-of-the-way-there idea as the smooth scroll. The lag
 * is the entire effect: a ring locked exactly to the pointer reads as a
 * cheap CSS trick, while one that trails very slightly behind feels physical.
 *
 * The real cursor is left visible. Hiding it is the fashionable choice and it
 * is a genuinely bad one: people lose track of where they are pointing, and on
 * a portfolio being opened by a recruiter in a hurry that is a real cost. The
 * ring is an addition, not a replacement.
 */

const LERP = 0.16; // fraction of the remaining gap covered each frame
const SIZE = 34; // ring diameter in px, matched in style.css

export default function initCursor() {
    // Touch devices have no pointer to follow, and hover means nothing there.
    if (window.matchMedia("(pointer: coarse)").matches) return null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

    const ring = document.createElement("div");
    ring.className = "cursor";
    ring.setAttribute("aria-hidden", "true"); // decoration; nothing to announce
    document.body.appendChild(ring);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let visible = false;

    window.addEventListener(
        "pointermove",
        (event) => {
            targetX = event.clientX;
            targetY = event.clientY;

            if (!visible) {
                // Jump to the pointer the first time rather than gliding in
                // from the centre of the screen, which looks like a bug.
                x = targetX;
                y = targetY;
                visible = true;
                ring.classList.add("is-visible");
            }

            // Grow over anything clickable. closest() walks up the tree, so
            // this still works when the pointer is over a <span> inside a link.
            const interactive = event.target.closest?.("a, button, summary, [role='button']");
            ring.classList.toggle("is-active", Boolean(interactive));
        },
        { passive: true }
    );

    // The pointer leaving the window entirely — not just one element.
    document.addEventListener("pointerleave", () => {
        visible = false;
        ring.classList.remove("is-visible");
    });

    /** Driven from the shared GSAP ticker, so there is still only one loop. */
    function update() {
        x += (targetX - x) * LERP;
        y += (targetY - y) * LERP;

        // translate3d, not left/top: transforms are handled by the compositor
        // and never trigger layout. Animating left/top sixty times a second
        // makes the browser re-lay-out the page sixty times a second.
        ring.style.transform = `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0)`;
    }

    return { update, element: ring };
}
