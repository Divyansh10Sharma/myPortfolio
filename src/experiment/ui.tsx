import {
    useEffect,
    useRef,
    type ReactNode,
} from "react";

/* ============================================================
   The four primitives every section is built from.

   They are together in one file on purpose. Each is a dozen lines, none of
   them has state worth isolating, and splitting them into four files would
   mean four imports at the top of every section for no gain. The rule I am
   applying: a file per responsibility, and "render the design system's
   vocabulary" is one responsibility.
   ============================================================ */

/* ── Band ─────────────────────────────────────────────────── */

/** The four surfaces from DESIGN.md, named rather than numbered. */
export type Tone = "void" | "canvas" | "light" | "linen";

interface BandProps {
    tone: Tone;
    id?: string;
    /** Half the vertical padding, for the small connective sections. */
    tight?: boolean;
    children: ReactNode;
}

/**
 * A full-width horizontal slice of the page.
 *
 * This is the component that enforces DESIGN.md's firmest rule — "pick a
 * background mode first, never blend them in one component". Because the band
 * sets the text colours as CSS custom properties, everything inside it gets
 * the right ones automatically and no card ever has to ask which kind of
 * section it landed in.
 */
export function Band({ tone, id, tight, children }: BandProps) {
    return (
        <section
            id={id}
            className={`band band--${tone}${tight ? " band--tight" : ""}`}
        >
            <div className="shell">{children}</div>
        </section>
    );
}

/* ── SectionHead ──────────────────────────────────────────── */

interface SectionHeadProps {
    /** The numbered label the real site uses, e.g. "02 · Systems". */
    eyebrow: string;
    /**
     * Optional, because one section on the real site genuinely has no heading
     * beyond its label, and inventing one for it would be inventing copy.
     */
    title?: string;
    lead?: string;
}

export function SectionHead({ eyebrow, title, lead }: SectionHeadProps) {
    return (
        <Reveal className="section-head">
            <p className="caption section-head__eyebrow">{eyebrow}</p>
            {title && <h2 className="display-sm">{title}</h2>}
            {lead && <p className="body-lg muted">{lead}</p>}
        </Reveal>
    );
}

/* ── Pill ─────────────────────────────────────────────────── */

interface PillProps {
    href: string;
    variant: "primary" | "white" | "ghost";
    children: ReactNode;
    /** Opens in a new tab, and says so to a screen reader. */
    external?: boolean;
    arrow?: boolean;
}

/**
 * Every control on the page. Three fills, one geometry.
 *
 * DESIGN.md calls the 9999px radius the system's signature shape, which means
 * it is not a per-button decision — it lives in `.pill` and the variants only
 * change colour. That is why this is one component with a `variant` rather
 * than three components.
 */
export function Pill({ href, variant, children, external, arrow }: PillProps) {
    return (
        <a
            className={`pill pill--${variant}`}
            href={href}
            {...(external
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
        >
            {children}
            {arrow && (
                <span className="pill__arrow" aria-hidden="true">
                    →
                </span>
            )}
        </a>
    );
}

/* ── Tag ──────────────────────────────────────────────────── */

interface TagProps {
    children: ReactNode;
    /** iris for technical, ember for warnings and status, ash for neutral. */
    tone?: "iris" | "ember" | "ash";
    dot?: boolean;
}

export function Tag({ children, tone = "ash", dot }: TagProps) {
    return (
        <span className={`tag tag--${tone}`}>
            {dot && <span className="tag__dot" aria-hidden="true" />}
            {children}
        </span>
    );
}

/* ── Reveal ───────────────────────────────────────────────── */

interface RevealProps {
    children: ReactNode;
    className?: string;
    /** Milliseconds, for staggering siblings. */
    delay?: number;
}

/**
 * Fades a block up the first time it comes into view.
 *
 * IntersectionObserver rather than a scroll listener, and this is worth being
 * deliberate about: a scroll handler runs on every single scroll event and has
 * to call getBoundingClientRect to find out where things are, which forces the
 * browser to recompute layout mid-scroll. IntersectionObserver does the same
 * job off the main thread and tells us only when the answer changes.
 *
 * It disconnects after firing. The element is revealed; there is nothing left
 * to watch, and leaving observers attached to every block on the page is a
 * slow leak that only shows up on long sessions.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                element.classList.add("is-in");
                observer.disconnect();
            },
            {
                threshold: 0.15,
                // Fire slightly before the block reaches the bottom edge, so
                // the movement has finished by the time it is properly in
                // view rather than animating under the reader's eye.
                rootMargin: "0px 0px -8% 0px",
            }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className ? `reveal ${className}` : "reveal"}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}
