import {
    createElement,
    useEffect,
    useRef,
    type ElementType,
    type FunctionComponent,
    type ReactNode,
    type Ref,
} from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface RevealProps {
    children: ReactNode;
    /** Which tag to render. Defaults to a div. */
    as?: ElementType;
    className?: string;
    /** Seconds to wait before starting, for staggering siblings. */
    delay?: number;
}

/**
 * Fades its children up, once, when they first scroll into view.
 *
 * In the vanilla build this was a loop in main.js that queried the whole
 * document for `.reveal` and attached a ScrollTrigger to each match. It worked,
 * but the animation lived a long way from the markup it animated.
 *
 * As a component the behaviour wraps the thing it applies to, which is the
 * genuine improvement React brings here: `<Reveal><h2>…</h2></Reveal>` says what
 * it does at the point of use, and the cleanup is guaranteed.
 */
export function Reveal({
    children,
    as: Tag = "div",
    className,
    delay = 0,
}: RevealProps) {
    const ref = useRef<HTMLElement>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Reduced motion: visible immediately, no animation at all. Note that
        // it is shown rather than left hidden — the content is not optional.
        if (reducedMotion) {
            gsap.set(element, { opacity: 1, y: 0 });
            return;
        }

        const tween = gsap.fromTo(
            element,
            { opacity: 0, y: 28 },
            {
                opacity: 1,
                y: 0,
                duration: 1.1,
                delay,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 88%", // fire slightly before it reaches the fold
                    once: true, // replaying on scroll-up makes a site restless
                },
            }
        );

        // Kill the tween AND its ScrollTrigger. Killing only the tween leaves
        // the trigger registered, listening forever, holding a reference to an
        // element that no longer exists.
        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [reducedMotion, delay]);

    /**
     * Rendering "whatever tag we were told to" is awkward to type. Written as
     * JSX, TypeScript tries to resolve the props against every possible HTML
     * element at once and gives up with "union type too complex".
     *
     * createElement sidesteps that: we state the three props we actually pass
     * and hand it the tag. Not `any` — the shape is still checked, we have just
     * stopped asking TypeScript to enumerate every element in the DOM.
     */
    const Element = Tag as unknown as FunctionComponent<{
        ref?: Ref<HTMLElement>;
        className?: string;
        children?: ReactNode;
    }>;

    return createElement(Element, { ref, className }, children);
}
