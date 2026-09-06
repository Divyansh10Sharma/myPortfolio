import { useEffect } from "react";
import { gsap } from "../lib/gsap";

/** How close the pointer has to get, in pixels beyond the element's own box. */
const RADIUS = 80;
/** How far the element is allowed to travel toward the pointer. */
const PULL = 0.28;

/**
 * Large interactive elements lean toward the pointer as it approaches.
 *
 * THE IDEA: a fridge magnet held near a metal door. It does not touch until it
 * is close, then it visibly reaches the last part of the way by itself. The
 * pull is strongest when it is nearly there and nothing at all from across the
 * room.
 *
 * Why it matters: everything else on the page reacts only once you have
 * committed — hover, click. This reacts to intention, before you arrive, which
 * is most of why studio sites feel like they are paying attention to you.
 *
 * Applied to large targets ONLY. Magnetism on small text is genuinely bad: the
 * thing you are aiming at moves as you aim at it, which is a usability problem
 * dressed up as polish. The elements chosen here — the email address, the
 * resume link — are big enough that a few pixels of travel cannot make them
 * harder to hit.
 */
export function useMagnetic(selector: string) {
    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) return; // no pointer
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const elements = Array.from(
            document.querySelectorAll<HTMLElement>(selector)
        );
        if (elements.length === 0) return;

        // gsap.quickTo builds ONE tween per property per element and then just
        // retargets it. The obvious version — calling gsap.to() on every
        // pointer move — creates a brand new tween each time, so a second of
        // movement leaves dozens of overlapping tweens fighting over the same
        // property. This is the idiomatic fix and it exists precisely for
        // pointer-driven motion.
        const movers = elements.map((element) => ({
            element,
            // Out fast, back slow: leaving should feel like release.
            toX: gsap.quickTo(element, "x", { duration: 0.7, ease: "power3.out" }),
            toY: gsap.quickTo(element, "y", { duration: 0.7, ease: "power3.out" }),
            engaged: false,
        }));

        // One listener on the window rather than two per element. This scales
        // to any number of targets without adding listeners for each.
        const onMove = (event: PointerEvent) => {
            for (const mover of movers) {
                const rect = mover.element.getBoundingClientRect();

                // Distance from the pointer to the centre of the element.
                const dx = event.clientX - (rect.left + rect.width / 2);
                const dy = event.clientY - (rect.top + rect.height / 2);

                // "Close enough" means inside the element's own box plus the
                // radius, so a wide link has a wide catchment and a small one
                // does not.
                const near =
                    Math.abs(dx) < rect.width / 2 + RADIUS &&
                    Math.abs(dy) < rect.height / 2 + RADIUS;

                if (near) {
                    mover.engaged = true;
                    mover.toX(dx * PULL);
                    mover.toY(dy * PULL);
                } else if (mover.engaged) {
                    // Only once, on the frame it leaves range — not on every
                    // pointer move for the rest of the session.
                    mover.engaged = false;
                    mover.toX(0);
                    mover.toY(0);
                }
            }
        };

        window.addEventListener("pointermove", onMove, { passive: true });

        return () => {
            window.removeEventListener("pointermove", onMove);
            // Kill any tween still running, and put everything back. Without
            // this, an element can be left permanently offset if the component
            // unmounts mid-flight.
            gsap.killTweensOf(elements);
            gsap.set(elements, { x: 0, y: 0 });
        };
    }, [selector]);
}
