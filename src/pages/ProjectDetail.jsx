// ============================================================
// ProjectDetail.jsx — Separate route for /project/:id
//                     Full project detail view with back navigation
// ============================================================

import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { projects } from "../assets/data";
import {
    FiArrowLeft, FiGithub, FiExternalLink,
    FiCheckCircle, FiCode, FiTag,
} from "react-icons/fi";
import Footer from "../components/layout/Footer";

const ProjectDetail = () => {
    const { id }    = useParams();
    const navigate  = useNavigate();
    const project   = projects.find((p) => p.id === id);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    // ── 404 state ────────────────────────────────────────
    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 relative z-10">
                <div className="font-display text-6xl font-bold gradient-text">404</div>
                <p className="text-gray-400">Project not found.</p>
                <Link to="/" className="btn-primary px-6 py-3 rounded-xl text-sm">
                    Back to Portfolio
                </Link>
            </div>
        );
    }

    const gradientBgs = {
        "train-rex-app": "linear-gradient(135deg, rgba(145,94,255,0.2), rgba(0,212,255,0.1))",
        "gym-saas":      "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(158,188,128,0.1))",
        "thread":        "linear-gradient(135deg, rgba(158,188,128,0.2), rgba(249,115,22,0.1))",
        "frencie":       "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(145,94,255,0.1))",
        "face-attendance":"linear-gradient(135deg, rgba(255,107,157,0.2), rgba(0,212,255,0.1))",
    };
    const heroBg = gradientBgs[project.id] || gradientBgs["train-rex-app"];

    return (
        <div className="relative z-10 min-h-screen">
            {/* ── Hero banner ──────────────────────────────── */}
            <div
                className="relative pt-28 pb-20 px-6 md:px-16"
                style={{ background: heroBg }}
            >
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(145,94,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(145,94,255,0.8) 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Back button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 group"
                    >
                        <FiArrowLeft
                            size={16}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                        <span className="text-sm font-mono">Back</span>
                    </motion.button>

                    {/* Project name */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {project.featured && (
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-mono font-medium"
                                    style={{
                                        background: "rgba(158,188,128,0.2)",
                                        border: "1px solid rgba(158,188,128,0.4)",
                                        color: "#9ebc80",
                                    }}
                                >
                                    ★ Featured Project
                                </span>
                            )}
                        </div>

                        <h1
                            className="font-display font-bold mb-4"
                            style={{
                                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                                lineHeight: 1.1,
                                background: "linear-gradient(135deg, #ffffff, #915eff, #00d4ff)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {project.name}
                        </h1>

                        <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                            {project.shortDescription}
                        </p>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-4 mt-8">
                            {project.source_code_link && (
                                <a
                                    href={project.source_code_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                                    style={{
                                        background: "linear-gradient(135deg, #915eff, #00d4ff)",
                                        boxShadow: "0 0 20px rgba(145,94,255,0.4)",
                                    }}
                                >
                                    <FiGithub size={16} />
                                    View Source Code
                                </a>
                            )}
                            {project.live_link && (
                                <a
                                    href={project.live_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                                    style={{
                                        border: "1px solid rgba(145,94,255,0.5)",
                                        color: "#915eff",
                                    }}
                                >
                                    <FiExternalLink size={16} />
                                    Live Demo
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Detail body ──────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-6 md:px-16 py-16 grid lg:grid-cols-3 gap-10">

                {/* ── Main content ─────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="lg:col-span-2 flex flex-col gap-8"
                >
                    {/* About */}
                    <div className="glass-card rounded-2xl p-7">
                        <h2 className="font-display font-bold text-white text-xl mb-4">About this Project</h2>
                        <p className="text-gray-300 leading-relaxed text-[15px] whitespace-pre-line">
                            {project.description}
                        </p>
                    </div>

                    {/* Key Highlights */}
                    {project.highlights && (
                        <div className="glass-card rounded-2xl p-7">
                            <div className="flex items-center gap-2 mb-5">
                                <FiCheckCircle className="text-[#9ebc80]" size={18} />
                                <h2 className="font-display font-bold text-white text-lg">Key Highlights</h2>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {project.highlights.map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 p-4 rounded-xl"
                                        style={{
                                            background: "rgba(158,188,128,0.06)",
                                            border: "1px solid rgba(158,188,128,0.15)",
                                        }}
                                    >
                                        <div
                                            className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ background: "#9ebc80", boxShadow: "0 0 6px #9ebc80" }}
                                        />
                                        <span className="text-gray-200 text-sm">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* ── Sidebar ──────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="flex flex-col gap-5"
                >
                    {/* Tech stack */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FiCode className="text-[#00d4ff]" size={16} />
                            <h3 className="font-semibold text-white text-sm">Tech Stack</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span key={tag.name} className="tag-pill text-xs">{tag.name}</span>
                            ))}
                        </div>
                    </div>

                    {/* Categories / tags */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FiTag className="text-[#915eff]" size={16} />
                            <h3 className="font-semibold text-white text-sm">Category</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span key={tag.name} className={`text-sm font-mono ${tag.color}`}>
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Other projects */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-semibold text-white text-sm mb-4">Other Projects</h3>
                        <div className="flex flex-col gap-2">
                            {projects
                                .filter((p) => p.id !== project.id)
                                .slice(0, 3)
                                .map((p) => (
                                    <Link
                                        key={p.id}
                                        to={`/project/${p.id}`}
                                        className="flex items-center justify-between py-2 px-3 rounded-lg text-sm text-gray-400 hover:text-white transition-colors group"
                                        style={{ border: "1px solid transparent" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(145,94,255,0.25)"; e.currentTarget.style.background = "rgba(145,94,255,0.06)"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
                                    >
                                        <span className="font-mono">{p.name}</span>
                                        <FiArrowLeft
                                            size={12}
                                            className="rotate-180 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                                        />
                                    </Link>
                                ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default ProjectDetail;
