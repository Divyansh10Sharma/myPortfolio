import { projects } from "../../data/content";
import { Band, Pill, Reveal, SectionHead } from "../ui";

/**
 * Dark cards on a white band — the system's most distinctive single move.
 *
 * DESIGN.md describes it explicitly: a card grid on #ffffff where each card is
 * #111111 with a 12px radius and a slate border. It is counter-intuitive
 * enough to be worth trying deliberately — on most sites a dark card on white
 * would look like an error, and here it reads as the product's own dark UI
 * quoted inside an editorial page.
 */
export function Projects() {
    return (
        <Band tone="light" id="projects">
            <SectionHead eyebrow="04 · Projects" title="Side projects" />

            <div className="grid grid--3">
                {projects.map((project, index) => (
                    <Reveal key={project.index} delay={(index % 3) * 80}>
                        <article className="card">
                            <p className="caption card__index">{project.index}</p>

                            <h3 className="heading card__title">{project.name}</h3>

                            {project.subtitle && (
                                <p className="caption faint">{project.subtitle}</p>
                            )}

                            <p className="card__body">{project.body}</p>

                            {project.href && (
                                <div className="card__foot">
                                    <Pill
                                        href={project.href}
                                        variant="ghost"
                                        external
                                        arrow
                                    >
                                        {project.hrefLabel ?? "Visit"}
                                    </Pill>
                                </div>
                            )}
                        </article>
                    </Reveal>
                ))}
            </div>
        </Band>
    );
}
