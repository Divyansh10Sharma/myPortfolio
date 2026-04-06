// ============================================================
// Projects.jsx — Tilt project cards grid with detail page links
//                Featured badge, tech tags, links
// ============================================================

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { projects } from "../../assets/data";
import { FiGithub, FiExternalLink, FiStar, FiArrowRight } from "react-icons/fi";

// ── Single project card ──────────────────────────────────
const ProjectCard = ({ project, index, inView }) => {
    const gradients = [
        "linear-gradient(135deg, rgba(145,94,255,0.15), rgba(0,212,255,0.05))",
        "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(158,188,128,0.05))",
        "linear-gradient(135deg, rgba(158,188,128,0.15), rgba(249,115,22,0.05))",
        "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(145,94,255,0.05))",
        "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(0,212,255,0.05))",
    ];
    const bg = gradients[index % gradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="h-full"
        >
            <Tilt
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                glareEnable={true}
                glareMaxOpacity={0.06}
                glareColor="#915eff"
                glarePosition="all"
                className="h-full"
            >
                <div
                    className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group"
                    style={{ minHeight: "380px" }}
                >
                    {/* ── Card top gradient area ─────────── */}
                    <div
                        className="relative h-40 flex items-center justify-center overflow-hidden"
                        style={{ background: bg }}
                    >
                        {/* Project initial / icon placeholder */}
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-2xl text-white"
                            style={{
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                backdropFilter: "blur(10px)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                            }}
                        >
                            {project.name[0]}
                        </div>

                        {/* Featured badge */}
                        {project.featured && (
                            <div
                                className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium"
                                style={{
                                    background: "rgba(158,188,128,0.2)",
                                    border: "1px solid rgba(158,188,128,0.4)",
                                    color: "#9ebc80",
                                }}
                            >
                                <FiStar size={10} />
                                Featured
                            </div>
                        )}

                        {/* Action icons */}
                        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {project.source_code_link && (
                                <a
                                    href={project.source_code_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors"
                                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
                                >
                                    <FiGithub size={14} />
                                </a>
                            )}
                            {project.live_link && (
                                <a
                                    href={project.live_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors"
                                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
                                >
                                    <FiExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ── Card body ─────────────────────────── */}
                    <div className="flex flex-col flex-1 p-5">
                        <h3 className="font-display font-bold text-white text-base mb-2 group-hover:text-[#915eff] transition-colors">
                            {project.name}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                            {project.shortDescription}
                        </p>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.tags.map((tag) => (
                                <span key={tag.name} className={`text-xs font-mono font-medium ${tag.color}`}>
                                    #{tag.name}
                                </span>
                            ))}
                        </div>

                        {/* View detail link */}
                        <Link
                            to={`/project/${project.id}`}
                            className="flex items-center gap-2 text-xs font-semibold font-mono transition-all duration-200 group/link"
                            style={{ color: "#915eff" }}
                        >
                            View Details
                            <FiArrowRight
                                size={13}
                                className="group-hover/link:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>
                </div>
            </Tilt>
        </motion.div>
    );
};

// ── Section ──────────────────────────────────────────────
const Projects = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

    const featured  = projects.filter((p) => p.featured);
    const secondary = projects.filter((p) => !p.featured);

    return (
        <section id="projects" className="relative section-padding z-10">
            <div className="max-w-7xl mx-auto">
                <div ref={ref}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: "#9ebc80", boxShadow: "0 0 8px #9ebc80" }} />
                        <span className="text-xs font-mono tracking-widest text-[#9ebc80] uppercase">Portfolio</span>
                    </div>
                    <h2 className="section-title mb-3">Projects</h2>
                    <p className="section-subtitle mb-14">
                        Production systems shipped end-to-end — each with real users and measurable impact.
                    </p>

                    {/* Featured projects — 2 col */}
                    {featured.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {featured.map((p, i) => (
                                <ProjectCard key={p.id} project={p} index={i} inView={inView} />
                            ))}
                        </div>
                    )}

                    {/* Secondary projects — 3 col */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {secondary.map((p, i) => (
                            <ProjectCard key={p.id} project={p} index={i + featured.length} inView={inView} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
