import { work } from "../data/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Work() {
    return (
        <Section id="work" index="03" label="Work">
            <Reveal as="h2">Where I've worked</Reveal>

            <div className="list">
                {work.map((role) => (
                    <Reveal as="article" className="row" key={role.org}>
                        <div className="row__head">
                            <p className="row__index">{role.dates}</p>
                        </div>
                        <div className="row__body">
                            <h3>
                                {role.role}, <span className="org">{role.org}</span>
                            </h3>
                            <p className="row__subtitle">{role.location}</p>
                            <p className="prose">{role.line}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </Section>
    );
}
