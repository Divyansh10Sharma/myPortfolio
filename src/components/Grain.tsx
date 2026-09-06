import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

/**
 * A layer of film over the entire page, DOM text included.
 *
 * THE IDEA: the post-processing pass covers everything the canvas draws, but
 * all the body text is DOM sitting on top of the canvas, so it receives none of
 * it. The result is subtle but it is the thing that gives the game away — the
 * background looks photographed and the words look printed on afterwards.
 *
 * This is a sheet of tracing paper laid over the whole page. It cannot know
 * what is underneath and does not need to: it just puts the same texture over
 * all of it.
 *
 * The noise is an inline SVG turbulence filter rather than an image file, so
 * there is no request and nothing to cache. It is generated once by the browser
 * and then only moved.
 */
export function Grain() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Touch devices keep the texture but not the movement. Jittering a
        // full-screen composited layer is a luxury worth paying for on a
        // desktop GPU and not on a mid-range phone, where those frames are
        // needed elsewhere. The grain still does its job standing still.
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const element = ref.current;
        if (!element) return;

        // Nine positions, cycled. Film grain does not drift smoothly — it jumps
        // to a new arrangement every frame — so animating position continuously
        // would read as crawling rather than as grain.
        // Small offsets, within the 5% of slack the layer has on each side.
        // The tile is only 128px, so a couple of percent is already several
        // tiles' worth of movement — the pattern changes completely.
        const steps = [
            [0, 0],
            [-1, -2],
            [-3, 1],
            [2, -3],
            [-1, 3],
            [-3, 2],
            [2, 1],
            [1, -3],
            [-2, 2],
        ];

        let index = 0;
        let elapsed = 0;

        // Roughly 8 changes a second, not 60. Real film grain at 24fps is
        // slower than the display, and shuffling it every frame looks like
        // television static rather than film.
        const interval = 1 / 8;

        const tick = () => {
            elapsed += gsap.ticker.deltaRatio() / 60;
            if (elapsed < interval) return;
            elapsed = 0;

            index = (index + 1) % steps.length;
            const [x, y] = steps[index];
            // transform only — handled by the compositor, never triggers layout.
            element.style.transform = `translate3d(${x}%, ${y}%, 0)`;
        };

        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
    }, []);

    // aria-hidden and pointer-events:none in the stylesheet: this must never
    // intercept a click or be announced to a screen reader.
    return <div className="grain" ref={ref} aria-hidden="true" />;
}
