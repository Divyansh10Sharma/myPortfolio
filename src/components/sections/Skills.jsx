// ============================================================
// Skills.jsx — Animated skill category cards with hover glow
// ============================================================

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { skillCategories } from "../../assets/data";

const cardColors = ["#915eff", "#00d4ff", "#9ebc80", "#f97316", "#ff6b9d"];

const SkillCard = ({ category, index, inView }) => {
    const color = cardColors[index % cardColors.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 group cursor-default"
            style={{ "--card-color": color }}
        >
            {/* Icon + title */}
            <div className="flex items-center gap-3 mb-5">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{
                        background: `${color}20`,
                        border: `1px solid ${color}40`,
                        boxShadow: `0 0 20px ${color}15`,
                    }}
                >
                    {category.icon}
                </div>
                <h3
                    className="font-display font-semibold text-base"
                    style={{ color }}
                >
                    {category.category}
                </h3>
            </div>

            {/* Skill pills */}
            <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                    <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-gray-300 transition-all duration-200 hover:text-white"
                        style={{
                            background: `${color}10`,
                            border: `1px solid ${color}25`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${color}25`;
                            e.currentTarget.style.borderColor = `${color}60`;
                            e.currentTarget.style.boxShadow = `0 0 12px ${color}30`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = `${color}10`;
                            e.currentTarget.style.borderColor = `${color}25`;
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};

const Skills = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="skills" className="relative section-padding z-10">
            <div className="max-w-7xl mx-auto">
                <div ref={ref}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: "#00d4ff", boxShadow: "0 0 8px #00d4ff" }} />
                        <span className="text-xs font-mono tracking-widest text-[#00d4ff] uppercase">Expertise</span>
                    </div>
                    <h2 className="section-title mb-3">Skills & Technologies</h2>
                    <p className="section-subtitle mb-14">
                        A polyglot stack — from mobile to backend to cloud, built for production at scale.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {skillCategories.map((cat, i) => (
                            <SkillCard key={cat.category} category={cat} index={i} inView={inView} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
