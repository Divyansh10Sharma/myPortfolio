// ============================================================
// About.jsx — Bio, highlights, and education/certs
// ============================================================

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { aboutData, education, certificates } from "../../assets/data";
import { FiAward, FiBook } from "react-icons/fi";

const SectionLabel = ({ children }) => (
    <div className="flex items-center gap-3 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ background: "#915eff", boxShadow: "0 0 8px #915eff" }} />
        <span className="text-xs font-mono tracking-widest text-[#915eff] uppercase">{children}</span>
    </div>
);

const About = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="about" className="relative section-padding z-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <SectionLabel>About Me</SectionLabel>
                    <h2 className="section-title mb-12">The Engineer Behind the Build</h2>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* ── Bio card ─────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="glass-card rounded-2xl p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg"
                                    style={{ background: "linear-gradient(135deg, #915eff, #00d4ff)", boxShadow: "0 0 20px rgba(145,94,255,0.4)" }}
                                >
                                    DS
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Divyansh Sharma</div>
                                    <div className="text-sm text-gray-400 flex items-center gap-1.5">
                                        <span className="glow-dot" />
                                        Full Stack Engineer @ Train Rex
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-300 leading-relaxed text-[15px]">
                                {aboutData.description}
                            </p>

                            {/* Tech tags */}
                            <div className="flex flex-wrap gap-2 mt-6">
                                {["React", "React Native", "Flask", "Firebase", "OpenAI", "PostgreSQL", "WebSockets"].map((t) => (
                                    <span key={t} className="tag-pill">{t}</span>
                                ))}
                            </div>
                        </motion.div>

                        {/* ── Education + Certs ────────────── */}
                        <div className="flex flex-col gap-6">
                            {/* Education */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="glass-card rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <FiBook className="text-[#00d4ff]" size={18} />
                                    <span className="font-semibold text-white">Education</span>
                                </div>
                                {education.map((edu) => (
                                    <div key={edu.degree}>
                                        <div className="font-medium text-gray-200 text-sm">{edu.degree}</div>
                                        <div className="text-gray-400 text-sm mt-1">{edu.institution}</div>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-xs font-mono text-[#915eff]">{edu.duration}</span>
                                            <span className="text-xs font-mono text-[#9ebc80]">CGPA: {edu.cgpa}</span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Certificates */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.7, delay: 0.45 }}
                                className="glass-card rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <FiAward className="text-[#9ebc80]" size={18} />
                                    <span className="font-semibold text-white">Certifications</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {certificates.map((cert) => (
                                        <div key={cert.name} className="flex gap-3 items-start">
                                            <div
                                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={{ background: "#915eff", boxShadow: "0 0 6px #915eff" }}
                                            />
                                            <div>
                                                <div className="text-sm text-gray-200">{cert.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{cert.detail}</div>
                                                <div className="text-xs font-mono text-[#915eff] mt-0.5">{cert.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
