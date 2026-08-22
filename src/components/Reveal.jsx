import { useEffect, useRef, useState } from "react";

/** True when the visitor has asked for less motion. */
export const prefersReducedMotion = () =>
    typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const EFFECTS = {
    fade: "reveal", // opacity + 24px rise
    lines: "reveal-lines", // type unmasked by a clip
    stagger: "stagger", // children arrive in sequence
};

/**
 * Reveals its children once, when 12% of the element enters the viewport.
 * Uses IntersectionObserver + a CSS class — no animation library.
 */
const Reveal = ({
    as: Tag = "div",
    effect = "fade",
    delay = 0,
    className = "",
    children,
    onReveal,
    ...rest
}) => {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);
    const callback = useRef(onReveal);
    callback.current = onReveal;

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const reveal = () => {
            setShown(true);
            callback.current?.();
        };

        // Never gate content on an animation the user has opted out of, and
        // degrade to "visible" where IntersectionObserver is unavailable.
        if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
            reveal();
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Reveal on intersection, or if the element is already above
                // the viewport — an anchor jump or an instant (reduced-motion)
                // scroll can skip a section entirely, and it must not be left
                // permanently invisible.
                if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
                    reveal();
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`${EFFECTS[effect]} ${shown ? "is-visible" : ""} ${className}`}
            style={{ "--reveal-delay": `${delay}ms` }}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
