import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import Lenis from "lenis";
import { setScrollState } from "../state/scroll";

/**
 * Smooth scrolling, and the bridge between Lenis and everything else.
 *
 * Lenis intercepts the wheel and animates the scroll position itself, so a
 * flick decays over ~1.2s instead of stopping dead. That glide is most of the
 * "expensive" feeling, and the same numbers drive the shaders.
 *
 * In the vanilla build this was ~30 lines in main.js. Here it is a hook, which
 * is a real improvement: setup and teardown sit next to each other and cannot
 * drift apart. The `return` at the end of the effect is the dispose().
 *
 * @param enabled false under reduced motion — no smooth scroll at all
 */
export function useSmoothScroll(enabled: boolean): React.RefObject<Lenis | null> {
    // A ref, not state: nothing about the page's appearance depends on the
    // Lenis instance existing, so storing it in state would re-render for no
    // reason. See state/scroll.ts for the longer version of this argument.
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        if (!enabled) {
            // Reduced motion: no Lenis, but the shaders still want to know
            // where we are on the page, so read it natively instead.
            const onNativeScroll = () => {
                const max =
                    document.documentElement.scrollHeight - window.innerHeight;
                setScrollState({
                    progress: max > 0 ? window.scrollY / max : 0,
                    pixels: window.scrollY,
                    velocity: 0,
                });
            };

            window.addEventListener("scroll", onNativeScroll, { passive: true });
            onNativeScroll();
            return () => window.removeEventListener("scroll", onNativeScroll);
        }

        const lenis = new Lenis({
            duration: 1.2, // seconds to settle. Above ~1.6 it feels broken.
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            // Touch is left alone deliberately: phone browsers already have
            // their own momentum scrolling and fighting it feels wrong.
            syncTouch: false,
        });

        lenisRef.current = lenis;

        // Driven from GSAP's ticker rather than its own requestAnimationFrame.
        // R3F runs its own loop for the canvas; this keeps everything DOM-side
        // on one loop rather than three.
        const raf = (time: number) => lenis.raf(time * 1000); // GSAP counts
        // seconds, Lenis wants milliseconds
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        // Lenis moves the page without firing native scroll events the way
        // ScrollTrigger expects, so it has to be told.
        lenis.on("scroll", ScrollTrigger.update);

        // And this is the handoff into the shaders. Note what crosses the
        // boundary: three plain numbers, written into a mutable object. No
        // setState, no re-render, no React involvement at all.
        lenis.on("scroll", ({ progress, scroll, velocity }: Lenis) => {
            setScrollState({ progress, pixels: scroll, velocity });
        });

        return () => {
            gsap.ticker.remove(raf);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [enabled]);

    return lenisRef;
}
