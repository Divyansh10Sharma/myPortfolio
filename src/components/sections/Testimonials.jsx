// ============================================================
// Testimonials.jsx — Glassmorphic quote cards with avatar initials
// ============================================================

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { testimonials } from "../../assets/data";
import { FiMessageCircle } from "react-icons/fi";

const TestimonialCard = ({ testimonial, index, inView }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="glass-card rounded-2xl p-7 flex flex-col gap-5 relative group"
    >
        {/* Quote icon */}
        <div
            className="absolute top-5 right-5 opacity-10 group-hover:opacity-20 transition-opacity"
            aria-hidden
        >
            <FiMessageCircle size={48} className="text-[#915eff]" />
        </div>

        {/* Quote text */}
        <p className="text-gray-300 text-[15px] leading-relaxed italic relative z-10">
            &ldquo;{testimonial.testimonial}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 relative z-10">
            {/* Avatar */}
            <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0"
                style={{
                    background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}88)`,
                    boxShadow: `0 0 20px ${testimonial.color}40`,
                }}
            >
                {testimonial.initials}
            </div>
            <div>
                <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                <div className="text-gray-500 text-xs font-mono mt-0.5">
                    {testimonial.designation} · {testimonial.company}
                </div>
            </div>
        </div>

        {/* Bottom glow line */}
        <div
            className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, ${testimonial.color}, transparent)` }}
        />
    </motion.div>
);

const Testimonials = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="testimonials" className="relative section-padding z-10">
            <div className="max-w-7xl mx-auto">
                <div ref={ref}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: "#f97316", boxShadow: "0 0 8px #f97316" }} />
                        <span className="text-xs font-mono tracking-widest text-[#f97316] uppercase">Testimonials</span>
                    </div>
                    <h2 className="section-title mb-3">What People Say</h2>
                    <p className="section-subtitle mb-14">
                        Kind words from colleagues and collaborators I've had the privilege of working with.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={t.name} testimonial={t} index={i} inView={inView} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
