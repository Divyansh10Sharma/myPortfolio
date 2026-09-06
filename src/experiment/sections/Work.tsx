import { work } from "../../data/content";
import { Band, Reveal, SectionHead } from "../ui";

/**
 * Two roles, as rows rather than cards.
 *
 * A card grid would be wrong here and it is worth saying why: cards imply
 * parallel, interchangeable items you scan and pick between. Employment is a
 * sequence. Rows separated by hairlines read top to bottom, which is how a
 * reader already expects to take in a history.
 */
export function Work() {
    return (
        <Band tone="linen" id="work">
            <SectionHead eyebrow="03 · Work" title="Where I've worked" />

            <div className="rows">
                {work.map((role) => (
                    <Reveal key={`${role.org}-${role.dates}`}>
                        <div className="row">
                            <p className="caption faint">{role.dates}</p>

                            <div className="row__body">
                                <h3 className="heading">{role.role}</h3>
                                <p className="body-lg">
                                    {role.org} · {role.location}
                                </p>
                                <p className="muted">{role.line}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </Band>
    );
}
