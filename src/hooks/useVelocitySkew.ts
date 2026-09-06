import { useEffect, type RefObject } from "react";
import { gsap } from "../lib/gsap";
import { scrollState } from "../state/scroll";

/** Degrees at full scroll speed. Above about 2 this stops reading as weight. */
const MAX_SKEW = 1.1;
/** Pixels of lag at full speed. */
const MAX_LAG = 14;

/**
 * Makes a block of content feel heavy while the page moves.
 *
 * THE IDEA: think of the page as a stack of paper being pulled past you rather
 * than a rigid board. When you tug it, the sheets do not all arrive at once —
 * they lean slightly, and lag a fraction behind, and settle when you stop.
 *
 * That is the whole effect: a degree of skew and a few pixels of drag,
 * proportional to how fast you are scrolling, easing back to nothing the moment
 * you stop. It is deliberately small enough that most people will not be able
 * to say what changed, only that the page feels less like a spreadsheet.
 *
 * It reads the same velocity number the headline shader already uses, so the
 * DOM and the WebGL layer are responding to one shared input rather than two
 * systems that happen to move at the same time.
 *
 * @param ref the element to transform
 * @param enabled false to opt out entirely — see Overview for why it does
 */
export function useVelocitySkew(
    ref: RefObject<HTMLElement | null>,
    enabled = true
) {
    useEffect(() => {
        if (!enabled) return;
        // A page that leans when you scroll is exactly what reduced motion is
        // asking us not to do.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const element = ref.current;
        if (!element) return;

        let skew = 0;
        let lag = 0;

        const tick = () => {
            // Same normalisation as the headline shader: raw velocity is
            // unbounded and a trackpad flick can spike to hundreds of pixels a
            // frame, which would fold the page in half.
            const normalised = Math.max(-1, Math.min(1, scrollState.velocity / 55));

            const targetSkew = normalised * MAX_SKEW;
            const targetLag = normalised * MAX_LAG;

            // Chase rather than jump. The easing is what turns a raw number
            // into something that feels like mass.
            skew += (targetSkew - skew) * 0.12;
            lag += (targetLag - lag) * 0.12;

            // Snap to exactly zero once it is imperceptible. Without this the
            // element keeps a transform forever, which keeps it promoted to its
            // own compositor layer and keeps it very slightly crooked.
            if (Math.abs(skew) < 0.005) skew = 0;
            if (Math.abs(lag) < 0.05) lag = 0;

            if (skew === 0 && lag === 0) {
                element.style.transform = "";
                return;
            }

            // translate3d first so the whole thing stays on the compositor.
            element.style.transform = `translate3d(0, ${lag}px, 0) skewY(${skew}deg)`;
        };

        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            element.style.transform = "";
        };
    }, [ref, enabled]);
}
