import { useRef, type ReactNode } from "react";
import { Reveal } from "./Reveal";
import { useVelocitySkew } from "../hooks/useVelocitySkew";

interface SectionProps {
    id: string;
    /** The two-digit number in the label, e.g. "02". */
    index: string;
    label: string;
    children: ReactNode;
    /**
     * Lean and lag while the page scrolls. Off for any section that hosts a
     * WebGL plane — see Overview.
     */
    skew?: boolean;
}

/**
 * The shared shell every section sits in: the numbered label, the padding, the
 * scroll-margin that keeps anchors clear of the fixed nav.
 *
 * In the vanilla build this markup was copy-pasted six times. That is the
 * clearest single win of the port — one definition, six uses, and changing the
 * label style means editing one file.
 */
export function Section({ id, index, label, children, skew = true }: SectionProps) {
    const ref = useRef<HTMLElement>(null);
    useVelocitySkew(ref, skew);

    return (
        <section className="section" id={id} ref={ref}>
            <Reveal as="p" className="section__label">
                <span>{index}</span> {label}
            </Reveal>
            {children}
        </section>
    );
}
