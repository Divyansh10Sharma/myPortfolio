import { projects } from "../data/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Projects() {
    return (
        <Section id="projects" index="04" label="Projects">
            <Reveal as="h2">Side projects</Reveal>

            <div className="list">
                {projects.map((project) => (
                    <Reveal as="article" className="row" key={project.name}>
                        <div className="row__head">
                            <p className="row__index">{project.index}</p>
                            <h3>{project.name}</h3>
                            {project.subtitle && (
                                <p className="row__subtitle">{project.subtitle}</p>
                            )}
                        </div>
                        <div className="row__body">
                            <p className="prose">{project.body}</p>
                            {project.href && (
                                <a
                                    className="out"
                                    href={project.href}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {project.hrefLabel} ↗
                                </a>
                            )}
                        </div>
                    </Reveal>
                ))}
            </div>
        </Section>
    );
}
