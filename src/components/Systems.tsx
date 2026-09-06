import { systems, systemsIntro, type System } from "../data/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./SplitReveal";

/**
 * One system. Split out as its own component because it has real internal
 * structure — two content layers, an optional NDA marker, a stack list.
 *
 * The short line from CONTENT.md is the default layer; the long body from the
 * old site sits inside a <details>. Native <details> rather than a JS toggle:
 * it works without JavaScript, it is keyboard accessible for free, and browsers
 * can find text inside a closed one.
 */
function SystemRow({ system }: { system: System }) {
    return (
        <Reveal as="article" className="row">
            <div className="row__head">
                <p className="row__index">{system.index}</p>
                <h3>{system.name}</h3>
                {system.subtitle && <p className="row__subtitle">{system.subtitle}</p>}
            </div>

            <div className="row__body">
                <p className="lead">{system.lead}</p>

                <details className="detail">
                    <summary>Read the detail</summary>
                    <p>{system.body}</p>
                </details>

                <p className="stack">
                    <span className="label">Stack</span> {system.stack.join(" · ")}
                </p>

                {/* Rexpert is under NDA. The marker travels with the content and
                    must not be removed — see CONTENT.md. */}
                {system.confidential && <p className="nda">Details withheld under NDA</p>}
            </div>
        </Reveal>
    );
}

export function Systems() {
    return (
        <Section id="systems" index="02" label="Systems">
            <SplitReveal as="h2">Systems I own</SplitReveal>
            <Reveal as="p" className="prose prose--lede" delay={0.05}>
                {systemsIntro}
            </Reveal>

            <div className="list">
                {systems.map((system) => (
                    <SystemRow key={system.id} system={system} />
                ))}
            </div>
        </Section>
    );
}
