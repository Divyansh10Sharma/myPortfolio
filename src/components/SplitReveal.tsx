import {
    createElement,
    useEffect,
    useRef,
    type ElementType,
    type FunctionComponent,
    type ReactNode,
    type Ref,
} from "react";
import { gsap, SplitText } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface SplitRevealProps {
    children: ReactNode;
    as?: ElementType;
    className?: string;
}

/**
 * Headings arrive a line at a time, rising out from behind their own baseline.
 *
 * THE IDEA: a `Reveal` fades a whole block in at once, which reads as one event
 * — the paragraph appeared. Splitting it into lines and starting each one a
 * fraction after the last turns it into a sequence instead, and a sequence
 * directs the eye. It is the difference between a slide appearing and someone
 * beginning to speak.
 *
 * The masking is what sells it: each line sits inside a box with the overflow
 * hidden, so the line does not fade in from nowhere, it travels up from behind
 * an edge. Physical rather than digital.
 *
 * Used for headings only. Body copy stays as a plain `Reveal` — staggering a
 * paragraph makes it slower to read for no gain, and this must never be
 * something a reader has to wait for.
 */
export function SplitReveal({
    children,
    as: Tag = "h2",
    className,
}: SplitRevealProps) {
    const ref = useRef<HTMLElement>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        if (reducedMotion) {
            gsap.set(element, { opacity: 1 });
            return;
        }

        let split: SplitText | null = null;
        let tween: gsap.core.Tween | null = null;
        let cancelled = false;

        const start = () => {
            if (cancelled || !ref.current) return;

            // Split FIRST, while the element is still transparent. The lines
            // are pushed below their masks by the tween's starting state, so by
            // the time we make it visible there is nothing to see yet — no
            // flash of un-split text.
            split = new SplitText(element, {
                type: "lines",
                mask: "lines", // SplitText builds the overflow-hidden wrapper
                linesClass: "split-line",
            });

            gsap.set(element, { opacity: 1 });

            tween = gsap.from(split.lines, {
                yPercent: 115, // just past 100, so no descender peeks out
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.08, // enough to read as a sequence, not as a wait
                scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    once: true,
                },
            });
        };

        // Fonts first: SplitText measures where the lines break, and measuring
        // the fallback face puts the breaks in the wrong places and jumps when
        // the real font lands.
        document.fonts.ready.then(start);

        // If fonts never resolve — a dead CDN, a browser that does not support
        // the promise — the heading must not stay invisible forever. Content is
        // not allowed to depend on an animation.
        const failsafe = window.setTimeout(() => {
            if (!split) gsap.set(element, { opacity: 1 });
        }, 2500);

        return () => {
            cancelled = true;
            window.clearTimeout(failsafe);
            tween?.scrollTrigger?.kill();
            tween?.kill();
            // revert() puts the original markup back. Without it the split
            // <div>s survive the unmount and React is left reconciling against
            // DOM it did not create.
            split?.revert();
        };
    }, [reducedMotion]);

    // Same createElement approach as Reveal: written as JSX, TypeScript tries
    // to resolve the props against every HTML element and gives up.
    const Element = Tag as unknown as FunctionComponent<{
        ref?: Ref<HTMLElement>;
        className?: string;
        children?: ReactNode;
    }>;

    return createElement(Element, { ref, className }, children);
}
