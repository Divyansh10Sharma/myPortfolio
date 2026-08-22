import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/**
 * The document spine: a continuous 1px hairline down the left margin of the
 * content column, ticked at regular intervals, with numbered section labels
 * hung off it. Wraps the whole page so the line is unbroken.
 */
export const SpineColumn = ({ children, className = "" }) => (
    <div className={`mx-auto w-full max-w-content px-6 ${className}`}>
        <div className="relative border-l border-rule pl-6 md:pl-spine">
            {/* Minor ticks every 32px, extending right off the spine. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-70"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(to bottom, var(--rule) 0 1px, transparent 1px 32px)",
                }}
            />
            {children}
        </div>
    </div>
);

/**
 * One numbered section. The label attaches to the spine with a major tick and
 * tracks the reader down the section on desktop. While a section is the one
 * being read its tick extends and its label darkens — position feedback
 * without introducing colour to the gutter.
 */
export const Section = ({ index, label, id, children, className = "" }) => {
    const ref = useRef(null);
    const [current, setCurrent] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            ([entry]) => setCurrent(entry.isIntersecting),
            // A band across the upper-middle of the viewport: whichever
            // section occupies it is the one being read.
            { rootMargin: "-20% 0px -55% 0px" }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} id={id} className={`relative pt-[72px] md:pt-section ${className}`}>
            {/* Desktop: label hung on the spine, to the left of the content. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-spine top-[72px] hidden w-spine md:top-section md:block"
            >
                <div className="sticky top-24">
                    {/* Major tick — longer and darker than the minor ticks. */}
                    <div
                        className={`absolute left-0 top-[0.45rem] h-px bg-graphite transition-all duration-300 ${
                            current ? "w-6" : "w-4"
                        }`}
                    />
                    <div className="pl-6 font-mono text-xs leading-[1.35] tracking-[0.04em]">
                        <div className="text-ink">{index}</div>
                        <div
                            className={`transition-colors duration-300 ${
                                current ? "text-ink" : "text-graphite"
                            }`}
                        >
                            {label}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: label sits inline above the heading. */}
            <Reveal className="mb-6 md:hidden">
                <p className="font-mono text-xs tracking-[0.04em] text-graphite">
                    <span className="text-ink">{index}</span> / {label}
                </p>
            </Reveal>

            {children}
        </section>
    );
};
