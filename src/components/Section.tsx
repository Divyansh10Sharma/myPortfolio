import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
    id: string;
    /** The two-digit number in the label, e.g. "02". */
    index: string;
    label: string;
    children: ReactNode;
}

/**
 * The shared shell every section sits in: the numbered label, the padding, the
 * scroll-margin that keeps anchors clear of the fixed nav.
 *
 * In the vanilla build this markup was copy-pasted six times. That is the
 * clearest single win of the port — one definition, six uses, and changing the
 * label style means editing one file.
 */
export function Section({ id, index, label, children }: SectionProps) {
    return (
        <section className="section" id={id}>
            <Reveal as="p" className="section__label">
                <span>{index}</span> {label}
            </Reveal>
            {children}
        </section>
    );
}
