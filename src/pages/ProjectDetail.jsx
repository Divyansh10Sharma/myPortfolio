// ============================================================
// ProjectDetail.jsx — Enhanced with:
//   • Challenges & Solutions section
//   • Tech Stack deep-dive breakdown
//   • Screenshot gallery
// ============================================================

import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../assets/data";
import {
    FiArrowLeft, FiGithub, FiExternalLink,
    FiCheckCircle, FiCode, FiTag, FiZap,
    FiCamera, FiChevronLeft, FiChevronRight, FiX,
} from "react-icons/fi";
import Footer from "../components/layout/Footer";

// ── Lightbox ─────────────────────────────────────────────────
const Lightbox = ({ screenshots, activeIndex, onClose, onPrev, onNext }) => (
    <AnimatePresence>
        {activeIndex !== null && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.92)" }}
                onClick={onClose}
            >
                <button
                    className="absolute top-6 right-6 text-gray-400 hover:text-white p-2"
                    onClick={onClose}
                >
                    <FiX size={24} />
                </button>
                <button
                    className="absolute left-6 text-gray-400 hover:text-white p-3"
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                >
                    <FiChevronLeft size={28} />
                </button>
                <motion.div
                    key={activeIndex}
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.92, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={screenshots[activeIndex].src}
                        alt={screenshots[activeIndex].caption}
                        className="max-h-[80vh] max-w-[85vw] rounded-2xl object-contain"
                        style={{ boxShadow: "0 0 60px rgba(145,94,255,0.3)" }}
                    />
                    <p className="text-gray-400 text-sm font-mono">
                        {screenshots[activeIndex].caption}
                    </p>
                </motion.div>
                <button
                    className="absolute right-6 text-gray-400 hover:text-white p-3"
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                >
                    <FiChevronRight size={28} />
                </button>
            </motion.div>
        )}
    </AnimatePresence>
);

// ── Main Component ───────────────────────────────────────────
const ProjectDetail = () => {
    const { id }    = useParams();
    const navigate  = useNavigate();
    const project   = projects.find((p) => p.id === id);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

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

    const screenshots   = project.screenshots || [];
    const hasScreenshots = screenshots.length > 0;
    const hasChallenges  = project.challenges && project.challenges.length > 0;
    const hasTechBreakdown = project.techBreakdown && project.techBreakdown.length > 0;

    const gradientBgs = {
        "train-rex-app":  "linear-gradient(135deg, rgba(145,94,255,0.2), rgba(0,212,255,0.1))",
        "gym-saas":       "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(158,188,128,0.1))",
        "thread":         "linear-gradient(135deg, rgba(158,188,128,0.2), rgba(249,115,22,0.1))",
        "frencie":        "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(145,94,255,0.1))",
        "face-attendance":"linear-gradient(135deg, rgba(255,107,157,0.2), rgba(0,212,255,0.1))",
    };
    const heroBg = gradientBgs[project.id] || gradientBgs["train-rex-app"];

    const sectionVariants = {
        hidden:  { opacity: 0, y: 28 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.55 } }),
    };

    return (
        <div className="relative z-10 min-h-screen">

            {/* ── Lightbox ─────────────────────────────────── */}
            {hasScreenshots && (
                <Lightbox
                    screenshots={screenshots}
                    activeIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={() => setLightboxIndex((lightboxIndex - 1 + screenshots.length) % screenshots.length)}
                    onNext={() => setLightboxIndex((lightboxIndex + 1) % screenshots.length)}
                />
            )}

            {/* ── Hero banner ──────────────────────────────── */}
            <div
                className="relative pt-28 pb-20 px-6 md:px-16"
                style={{ background: heroBg }}
            >
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(145,94,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(145,94,255,0.8) 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />

                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 group"
                    >
                        <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-mono">Back</span>
                    </motion.button>

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
            <div className="max-w-5xl mx-auto px-6 md:px-16 py-16 flex flex-col gap-10">

                {/* ── Top grid: About + Sidebar ──────────── */}
                <div className="grid lg:grid-cols-3 gap-10">

                    {/* Left: About + Highlights */}
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
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

                    {/* Right: Sidebar */}
                    <motion.div
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
                        className="flex flex-col gap-5"
                    >
                        {/* Tech stack pills */}
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

                        {/* Category */}
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
                                            <FiArrowLeft size={12} className="rotate-180 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Tech Breakdown (full width) ────────────── */}
                {hasTechBreakdown && (
                    <motion.div
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
                        className="glass-card rounded-2xl p-7"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <FiCode className="text-[#00d4ff]" size={18} />
                            <h2 className="font-display font-bold text-white text-xl">Tech Stack Breakdown</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {project.techBreakdown.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex gap-4 p-4 rounded-xl group transition-all duration-200"
                                    style={{
                                        background: "rgba(0,212,255,0.04)",
                                        border: "1px solid rgba(0,212,255,0.12)",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"; e.currentTarget.style.background = "rgba(0,212,255,0.08)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)"; e.currentTarget.style.background = "rgba(0,212,255,0.04)"; }}
                                >
                                    <div
                                        className="mt-0.5 px-2 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap h-fit"
                                        style={{
                                            background: "rgba(0,212,255,0.15)",
                                            color: "#00d4ff",
                                            border: "1px solid rgba(0,212,255,0.3)",
                                        }}
                                    >
                                        {item.tech}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{item.role}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Challenges & Solutions (full width) ────── */}
                {hasChallenges && (
                    <motion.div
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
                        className="glass-card rounded-2xl p-7"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <FiZap className="text-[#915eff]" size={18} />
                            <h2 className="font-display font-bold text-white text-xl">Challenges & How I Solved Them</h2>
                        </div>
                        <div className="flex flex-col gap-5">
                            {project.challenges.map((item, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl overflow-hidden"
                                    style={{ border: "1px solid rgba(145,94,255,0.15)" }}
                                >
                                    {/* Problem */}
                                    <div
                                        className="flex gap-3 p-5"
                                        style={{ background: "rgba(145,94,255,0.07)" }}
                                    >
                                        <div
                                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono mt-0.5"
                                            style={{
                                                background: "rgba(145,94,255,0.3)",
                                                color: "#915eff",
                                                border: "1px solid rgba(145,94,255,0.5)",
                                            }}
                                        >
                                            ?
                                        </div>
                                        <div>
                                            <p className="text-xs font-mono text-[#915eff] mb-1 uppercase tracking-wider">Problem</p>
                                            <p className="text-gray-200 text-sm leading-relaxed">{item.problem}</p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div
                                        className="h-px"
                                        style={{ background: "linear-gradient(90deg, rgba(145,94,255,0.3), rgba(0,212,255,0.3))" }}
                                    />

                                    {/* Solution */}
                                    <div
                                        className="flex gap-3 p-5"
                                        style={{ background: "rgba(0,212,255,0.04)" }}
                                    >
                                        <div
                                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono mt-0.5"
                                            style={{
                                                background: "rgba(0,212,255,0.2)",
                                                color: "#00d4ff",
                                                border: "1px solid rgba(0,212,255,0.4)",
                                            }}
                                        >
                                            ✓
                                        </div>
                                        <div>
                                            <p className="text-xs font-mono text-[#00d4ff] mb-1 uppercase tracking-wider">Solution</p>
                                            <p className="text-gray-300 text-sm leading-relaxed">{item.solution}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Screenshot Gallery (full width) ─────────── */}
                {hasScreenshots && (
                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
                        className="glass-card rounded-2xl p-7"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <FiCamera className="text-[#9ebc80]" size={18} />
                            <h2 className="font-display font-bold text-white text-xl">Screenshots</h2>
                            <span className="text-xs font-mono text-gray-500 ml-1">click to expand</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {screenshots.map((shot, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative cursor-pointer rounded-xl overflow-hidden group"
                                    style={{
                                        border: "1px solid rgba(158,188,128,0.2)",
                                        aspectRatio: "16/10",
                                    }}
                                    onClick={() => setLightboxIndex(i)}
                                >
                                    <img
                                        src={shot.src}
                                        alt={shot.caption}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Overlay on hover */}
                                    <div
                                        className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}
                                    >
                                        <span className="text-white text-xs font-mono">{shot.caption}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── No screenshots placeholder ──────────────── */}
                {!hasScreenshots && (
                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
                        className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center"
                        style={{
                            border: "1px dashed rgba(145,94,255,0.2)",
                            background: "rgba(145,94,255,0.03)",
                        }}
                    >
                        <FiCamera size={28} className="text-gray-600" />
                        <p className="text-gray-500 text-sm font-mono">Screenshots coming soon</p>
                        {/* <p className="text-gray-600 text-xs">Add image imports to the screenshots array in data.js</p> */}
                    </motion.div>
                )}

            </div>

            <Footer />
        </div>
    );
};

export default ProjectDetail;