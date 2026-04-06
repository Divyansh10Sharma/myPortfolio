// ============================================================
// Hero.jsx — Full-screen hero with typewriter, glowing orb,
//            floating stats, and scroll indicator
// ============================================================

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { heroData, aboutData } from "../../assets/data";
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from "react-icons/fi";

// ── Framer variants ───────────────────────────────────────
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const Hero = () => {
    const scrollToAbout = () => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* ── Grid overlay ────────────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(145,94,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(145,94,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* ── Glowing center orb ───────────────────────── */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute right-0 md:right-16 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
            >
                <div className="relative w-80 h-80">
                    {/* Outer glow rings */}
                    {[1, 2, 3].map((ring) => (
                        <div
                            key={ring}
                            className="absolute inset-0 rounded-full border border-[#915eff]/20"
                            style={{
                                transform: `scale(${1 + ring * 0.25})`,
                                animation: `spin-slow ${10 + ring * 4}s linear infinite ${ring % 2 === 0 ? "reverse" : ""}`,
                            }}
                        />
                    ))}
                    {/* Core orb */}
                    <div
                        className="absolute inset-8 rounded-full animate-float"
                        style={{
                            background: "radial-gradient(circle at 35% 35%, rgba(145,94,255,0.9), rgba(0,212,255,0.4), rgba(5,8,22,0.9))",
                            boxShadow: "0 0 80px rgba(145,94,255,0.4), 0 0 160px rgba(145,94,255,0.15), inset 0 0 40px rgba(0,212,255,0.15)",
                        }}
                    />
                    {/* Orbit dot */}
                    <div
                        className="absolute inset-0"
                        style={{ animation: "spin-slow 6s linear infinite" }}
                    >
                        <div
                            className="absolute top-4 left-1/2 w-3 h-3 rounded-full -translate-x-1/2"
                            style={{
                                background: "#00d4ff",
                                boxShadow: "0 0 12px #00d4ff, 0 0 24px rgba(0,212,255,0.6)",
                            }}
                        />
                    </div>
                    {/* Aurora dot */}
                    <div
                        className="absolute inset-0"
                        style={{ animation: "spin-slow 9s linear infinite reverse" }}
                    >
                        <div
                            className="absolute bottom-6 right-8 w-2 h-2 rounded-full"
                            style={{
                                background: "#9ebc80",
                                boxShadow: "0 0 10px #9ebc80, 0 0 20px rgba(158,188,128,0.6)",
                            }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* ── Main content ────────────────────────────── */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pt-24 pb-16 lg:max-w-3xl lg:mx-0 lg:ml-16 xl:ml-24"
            >
                {/* Status badge */}
                <motion.div variants={item} className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                        <span className="glow-dot" />
                        <span className="text-sm text-gray-300 font-mono">
                            Available for opportunities
                        </span>
                    </div>
                </motion.div>

                {/* Name */}
                <motion.h1
                    variants={item}
                    className="font-display font-bold mb-2"
                    style={{
                        fontSize: "clamp(2.5rem, 6vw, 5rem)",
                        lineHeight: 1.1,
                        background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #915eff 70%, #00d4ff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    {heroData.name}
                </motion.h1>

                {/* Typewriter role */}
                <motion.div variants={item} className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-0.5" style={{ background: "linear-gradient(90deg, #915eff, #00d4ff)" }} />
                    <div className="font-mono text-lg md:text-xl" style={{ color: "#00d4ff" }}>
                        <TypeAnimation
                            sequence={[
                                "Full Stack Engineer",   1800,
                                "React Native Developer",1800,
                                "AI/ML Integrator",      1800,
                                "SaaS Architect",        1800,
                                "Healthtech Builder",    1800,
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor
                        />
                    </div>
                </motion.div>

                {/* Sub tagline */}
                <motion.p
                    variants={item}
                    className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl"
                >
                    Building production systems in healthtech — from AI-powered nutrition engines
                    to gym SaaS platforms that process <span className="text-[#9ebc80] font-semibold">₹70K+/month</span>.
                    2+ years shipping real products that reach real users.
                </motion.p>

                {/* CTA buttons */}
                <motion.div variants={item} className="flex flex-wrap gap-4 mb-10">
                    <button
                        onClick={scrollToAbout}
                        className="relative px-7 py-3 rounded-xl font-semibold text-white text-sm overflow-hidden group"
                        style={{ background: "linear-gradient(135deg, #915eff, #00d4ff)", boxShadow: "0 0 30px rgba(145,94,255,0.4)" }}
                    >
                        <span className="relative z-10">Explore My Work</span>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                             style={{ background: "linear-gradient(135deg, #a070ff, #30e0ff)" }} />
                    </button>
                    <a
                        href={heroData.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                        style={{
                            border: "1px solid rgba(145,94,255,0.5)",
                            color: "#915eff",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(145,94,255,0.1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                        Download Resume
                    </a>
                </motion.div>

                {/* Social links */}
                <motion.div variants={item} className="flex items-center gap-4">
                    {[
                        { href: heroData.github,   Icon: FiGithub,   label: "GitHub"   },
                        { href: heroData.linkedin,  Icon: FiLinkedin, label: "LinkedIn" },
                        { href: `mailto:${heroData.email}`, Icon: FiMail, label: "Email" },
                    ].map(({ href, Icon, label }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={label}
                            className="flex items-center justify-center w-10 h-10 rounded-lg glass-card text-gray-400 hover:text-white transition-colors group"
                        >
                            <Icon size={18} className="group-hover:scale-110 transition-transform" />
                        </a>
                    ))}
                    <div className="w-px h-6 bg-white/10" />
                    <span className="text-xs text-gray-500 font-mono">Delhi, India</span>
                </motion.div>

                {/* ── Quick stats ──────────────────────────── */}
                <motion.div
                    variants={item}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 pt-8"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                    {aboutData.stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div
                                className="font-display font-bold text-2xl md:text-3xl"
                                style={{
                                    background: "linear-gradient(135deg, #9ebc80, #00d4ff)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                {stat.value}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 font-body">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* ── Scroll indicator ─────────────────────────── */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                onClick={scrollToAbout}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
                <span className="text-xs font-mono tracking-widest">SCROLL</span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <FiArrowDown size={16} />
                </motion.div>
            </motion.button>
        </section>
    );
};

export default Hero;
