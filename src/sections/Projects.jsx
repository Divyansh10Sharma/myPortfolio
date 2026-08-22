import { projects } from "../data";
import { Section } from "../components/Spine";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import { ArrowUpRight } from "../components/Icons";

const Projects = () => (
    <Section index="04" label="PROJECTS" id="projects">
        <Heading className="text-2xl text-ink md:text-3xl">Side projects</Heading>

        <div className="mt-12">
            {projects.map((project, i) => (
                <Reveal
                    key={project.name}
                    as="article"
                    className="grid grid-cols-1 gap-x-6 gap-y-3 border-t border-rule py-10 md:grid-cols-12"
                >
                    <div className="md:col-span-3">
                        <p className="font-mono text-xs tracking-label text-graphite">
                            P-0{i + 1}
                        </p>
                        <h3 className="mt-2 text-lg text-ink">{project.name}</h3>
                        {project.subtitle && (
                            <p className="mt-1 font-mono text-sm text-graphite">
                                {project.subtitle}
                            </p>
                        )}
                    </div>

                    <div
                        className={
                            i === 0
                                ? "md:col-span-8 md:col-start-5"
                                : "md:col-span-6 md:col-start-5"
                        }
                    >
                        <p className="font-sans text-base text-ink">{project.body}</p>

                        {project.href && (
                            <a
                                href={project.href}
                                target="_blank"
                                rel="noreferrer"
                                className="link mt-4 inline-flex max-w-full items-baseline gap-1.5 font-mono text-sm text-signal"
                            >
                                {/* Long repo URLs must wrap rather than push
                                    the page wider than the viewport. */}
                                <span className="min-w-0 break-all">{project.hrefLabel}</span>
                                <ArrowUpRight size={12} className="shrink-0" />
                            </a>
                        )}
                    </div>
                </Reveal>
            ))}
            <div className="border-t border-rule" />
        </div>
    </Section>
);

export default Projects;
