import { Link, useParams } from "react-router-dom";
import { findSystem } from "../data/content";
import { Reveal } from "../components/Reveal";
import { SplitReveal } from "../components/SplitReveal";

/**
 * One system, on its own page.
 *
 * Every word here already existed — the name, subtitle, short line, long body
 * and stack all come from `content.ts`, which is the same data the homepage row
 * renders. Nothing was written for this page, deliberately: new copy is
 * Divyansh's to write, not mine to invent.
 *
 * That also means these pages can be thickened later without touching any of
 * the transition machinery.
 */
export function SystemPage() {
    const { slug } = useParams();
    const system = findSystem(slug);

    // An unknown slug. Not a 404 page — there is no copy for one — but an
    // honest dead end with a way back, which is the useful part anyway.
    if (!system) {
        return (
            <main className="detail" id="top">
                <p className="detail__index">Not found</p>
                <h1 className="detail__name">No such system</h1>
                <Link className="detail__back" to="/">
                    ← Index
                </Link>
            </main>
        );
    }

    return (
        <main className="detail" id="top">
            <Reveal as="p" className="detail__index">
                {system.index}
            </Reveal>

            <SplitReveal as="h1" className="detail__name">
                {system.name}
            </SplitReveal>

            {system.subtitle && (
                <Reveal as="p" className="detail__subtitle" delay={0.05}>
                    {system.subtitle}
                </Reveal>
            )}

            <Reveal as="p" className="detail__lead" delay={0.1}>
                {system.lead}
            </Reveal>

            <Reveal as="p" className="detail__body" delay={0.15}>
                {system.body}
            </Reveal>

            <Reveal className="detail__stack" delay={0.2}>
                <p className="label">Stack</p>
                <p>{system.stack.join(" · ")}</p>
            </Reveal>

            {/* The NDA marker travels with the content wherever it is shown.
                See CONTENT.md — this must not be removed or elaborated. */}
            {system.confidential && (
                <Reveal as="p" className="nda" delay={0.25}>
                    Details withheld under NDA
                </Reveal>
            )}

            <Reveal delay={0.3}>
                <Link className="detail__back" to="/">
                    ← Index
                </Link>
            </Reveal>
        </main>
    );
}
