// ============================================================
// Experience.jsx — Vertical timeline using
//                 react-vertical-timeline-component
// ============================================================

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { experiences } from "../../assets/data";
import { FiBriefcase, FiCalendar, FiMapPin } from "react-icons/fi";

// ── Individual experience card ───────────────────────────
const ExperienceCard = ({ experience }) => {
    return (
        <VerticalTimelineElement
            contentStyle={{
                background: "rgba(13, 20, 36, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                padding: "1.5rem",
            }}
            contentArrowStyle={{ borderRight: "7px solid rgba(13, 20, 36, 0.85)" }}
            iconStyle={{
                background: experience.iconBg,
                boxShadow: `0 0 0 4px rgba(5,8,22,1), 0 0 20px ${experience.iconBg}66`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            icon={
                <span
                    className="font-display font-bold text-sm"
                    style={{ color: "#050816" }}
                >
                    {experience.iconText}
                </span>
            }
        >
            {/* ── Card header ──────────────────────────── */}
            <div className="mb-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                        <h3 className="font-display font-bold text-white text-lg">
                            {experience.title}
                        </h3>
                        <p
                            className="font-semibold text-sm mt-0.5"
                            style={{ color: experience.iconBg }}
                        >
                            {experience.company_name}
                        </p>
                    </div>
                    <span
                        className="px-3 py-1 rounded-full text-xs font-mono"
                        style={{
                            background: "rgba(145,94,255,0.12)",
                            border: "1px solid rgba(145,94,255,0.25)",
                            color: "#b490ff",
                        }}
                    >
                        {experience.type}
                    </span>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-mono">
                        <FiCalendar size={11} />
                        {experience.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-mono">
                        <FiMapPin size={11} />
                        {experience.location}
                    </div>
                </div>
            </div>

            {/* ── Bullet points ─────────────────────────── */}
            <ul className="flex flex-col gap-2.5">
                {experience.points.map((point, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                        <span
                            className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                            style={{ background: experience.iconBg, boxShadow: `0 0 6px ${experience.iconBg}` }}
                        />
                        <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                    </li>
                ))}
            </ul>

            {/* ── Tech stack pills ──────────────────────── */}
            <div className="flex flex-wrap gap-1.5 mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {experience.tech.map((t) => (
                    <span key={t} className="tag-pill text-[11px]">{t}</span>
                ))}
            </div>
        </VerticalTimelineElement>
    );
};

// ── Section ──────────────────────────────────────────────
const Experience = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

    return (
        <section id="experience" className="relative section-padding z-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "#915eff", boxShadow: "0 0 8px #915eff" }}
                        />
                        <span className="text-xs font-mono tracking-widest text-[#915eff] uppercase">
                            Career
                        </span>
                    </div>
                    <h2 className="section-title mb-3">Work Experience</h2>
                    <p className="section-subtitle mb-16">
                        2+ years of building production systems end-to-end — from architecture to deployment.
                    </p>

                    {/* Timeline */}
                    <VerticalTimeline lineColor="transparent">
                        {experiences.map((exp) => (
                            <ExperienceCard key={exp.id} experience={exp} />
                        ))}

                        {/* "More to come" terminus */}
                        <VerticalTimelineElement
                            iconStyle={{
                                background: "rgba(145,94,255,0.2)",
                                border: "2px dashed rgba(145,94,255,0.5)",
                                boxShadow: "0 0 20px rgba(145,94,255,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            icon={<FiBriefcase className="text-[#915eff]" size={18} />}
                        />
                    </VerticalTimeline>
                </motion.div>
            </div>
        </section>
    );
};

export default Experience;
