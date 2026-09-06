import { systems, systemsIntro } from "../../data/content";
import { Band, Reveal, SectionHead, Tag } from "../ui";

/**
 * Six feature cards. The centre of gravity of the whole page.
 *
 * Card content is the `lead` line, not the full `body`. The long version is
 * three or four sentences of real engineering detail, which is the right thing
 * on a page built around reading and the wrong thing in a 24px-padded card in
 * a three-column grid — it would set the row height by whichever system had
 * the most to say and leave the others half empty.
 */
export function Systems() {
    return (
        <Band tone="void" id="systems">
            {/* Heading and intro are the real site's, verbatim. This is a
                restyling experiment, not a rewrite — no copy is invented here. */}
            <SectionHead
                eyebrow="02 · Systems"
                title="Systems I own"
                lead={systemsIntro}
            />

            <div className="grid grid--3">
                {systems.map((system, index) => (
                    <Reveal key={system.id} delay={(index % 3) * 80}>
                        <article
                            className={
                                // The corner glow is punctuation, not
                                // decoration: it marks the two systems worth
                                // stopping on, and DESIGN.md's "some variants"
                                // stops being true if every card has one.
                                system.id === "rexpert"
                                    ? "card card--glow"
                                    : system.id === "migration"
                                      ? "card card--glow card--glow-iris"
                                      : "card"
                            }
                        >
                            <p className="caption card__index">{system.index}</p>

                            <h3 className="heading card__title">{system.name}</h3>

                            {system.subtitle && (
                                <p className="caption faint">{system.subtitle}</p>
                            )}

                            <p className="card__body">{system.lead}</p>

                            <div className="card__foot">
                                <div className="tags">
                                    {system.confidential && (
                                        <Tag tone="ember">Under NDA</Tag>
                                    )}
                                    {system.stack.map((item) => (
                                        <Tag key={item} tone="iris">
                                            {item}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </Reveal>
                ))}
            </div>
        </Band>
    );
}
