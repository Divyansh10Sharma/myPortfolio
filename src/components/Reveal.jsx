import { useEffect, useRef, useState } from "react";

/**
 * Reveals its children once, when 12% of the element enters the viewport.
 * Uses IntersectionObserver + a CSS class — no animation library.
 */
const Reveal = ({ as: Tag = "div", delay = 0, className = "", children, ...rest }) => {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Never gate content on an animation the user has opted out of, and
        // degrade to "visible" where IntersectionObserver is unavailable.
        const reduced =
            typeof matchMedia === "function" &&
            matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduced || typeof IntersectionObserver === "undefined") {
            setShown(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Reveal on intersection, or if the element is already above
                // the viewport — an anchor jump or an instant (reduced-motion)
                // scroll can skip a section entirely, and it must not be left
                // permanently invisible.
                if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
                    setShown(true);
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
            className={`reveal ${shown ? "is-visible" : ""} ${className}`}
            style={{ "--reveal-delay": `${delay}ms` }}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
