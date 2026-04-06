// ============================================================
// Contact.jsx — EmailJS-powered contact form
//               Replace SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY
//               with your EmailJS credentials
// ============================================================

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import { FiSend, FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { heroData } from "../../assets/data";

// ── Replace these with your real EmailJS credentials ─────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  ?? "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  ?? "YOUR_PUBLIC_KEY";

const inputClass = `
    w-full bg-[#0d1424]/60 border border-white/[0.07] rounded-xl px-4 py-3
    text-gray-200 text-sm placeholder-gray-600 font-body
    focus:outline-none focus:border-[#915eff]/60 focus:bg-[#0d1424]/80
    transition-all duration-200
`;

const Contact = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const formRef = useRef(null);

    const [form, setForm]     = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [status,  setStatus]  = useState(null); // 'success' | 'error' | null

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        // Uses emailjs.send() with explicit field mapping —
        // these keys (from_name, from_email, etc.) must match
        // the variable names in your EmailJS template exactly.
        emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                from_name:  form.name,
                to_name:    "Divyansh Sharma",
                from_email: form.email,
                to_email:   "divyansh.convivial@gmail.com",
                message:    form.message,
            },
            EMAILJS_PUBLIC_KEY
        ).then(
            () => {
                setLoading(false);
                setStatus("success");
                setForm({ name: "", email: "", message: "" });
            },
            (error) => {
                console.error(error);
                setLoading(false);
                setStatus("error");
            }
        );
    };

    return (
        <section id="contact" className="relative section-padding z-10">
            <div className="max-w-7xl mx-auto">
                <div ref={ref}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: "#915eff", boxShadow: "0 0 8px #915eff" }} />
                        <span className="text-xs font-mono tracking-widest text-[#915eff] uppercase">Contact</span>
                    </div>
                    <h2 className="section-title mb-3">Let's Build Something</h2>
                    <p className="section-subtitle mb-14">
                        Open to full-time roles, freelance projects, and interesting collaborations.
                    </p>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* ── Info panel ─────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7 }}
                            className="flex flex-col gap-6"
                        >
                            {/* Contact details */}
                            {[
                                { Icon: FiMail,    label: "Email",    value: heroData.email,      href: `mailto:${heroData.email}` },
                                { Icon: FiPhone,   label: "Phone",    value: "+91 87459-92299",   href: "tel:+918745992299" },
                                { Icon: FiMapPin,  label: "Location", value: "Delhi, India",      href: null },
                            ].map(({ Icon, label, value, href }) => (
                                <div key={label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: "rgba(145,94,255,0.15)", border: "1px solid rgba(145,94,255,0.3)" }}
                                    >
                                        <Icon className="text-[#915eff]" size={18} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-0.5">{label}</div>
                                        {href ? (
                                            <a href={href} className="text-gray-200 text-sm hover:text-[#915eff] transition-colors font-medium">
                                                {value}
                                            </a>
                                        ) : (
                                            <span className="text-gray-200 text-sm font-medium">{value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Social links */}
                            <div className="glass-card rounded-2xl p-5">
                                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Find me on</div>
                                <div className="flex gap-3">
                                    {[
                                        { href: heroData.github,   Icon: FiGithub,   label: "GitHub"   },
                                        { href: heroData.linkedin,  Icon: FiLinkedin, label: "LinkedIn" },
                                    ].map(({ href, Icon, label }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
                                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(145,94,255,0.4)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                                        >
                                            <Icon size={16} />
                                            {label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Form ───────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="glass-card rounded-2xl p-7"
                        >
                            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="I'd like to discuss a project..."
                                        required
                                        rows={5}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                {/* Status messages */}
                                {status === "success" && (
                                    <p className="text-[#9ebc80] text-sm font-mono">
                                        ✓ Message sent! I'll get back to you soon.
                                    </p>
                                )}
                                {status === "error" && (
                                    <p className="text-red-400 text-sm font-mono">
                                        ✗ Something went wrong. Try emailing me directly.
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 disabled:opacity-60"
                                    style={{
                                        background: loading
                                            ? "rgba(145,94,255,0.5)"
                                            : "linear-gradient(135deg, #915eff, #00d4ff)",
                                        boxShadow: loading ? "none" : "0 0 30px rgba(145,94,255,0.3)",
                                    }}
                                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 0 50px rgba(145,94,255,0.5)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = loading ? "none" : "0 0 30px rgba(145,94,255,0.3)"; }}
                                >
                                    <FiSend size={15} />
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
