// ============================================================
// Navbar.jsx — Fixed navbar with active section detection,
//              mobile hamburger menu, and smooth scroll
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../../assets/data";

const Navbar = () => {
    const [scrolled,     setScrolled]     = useState(false);
    const [activeSection,setActiveSection]= useState("hero");
    const [menuOpen,     setMenuOpen]     = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHome   = location.pathname === "/";

    // ── Scroll listeners ──────────────────────────────────
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);

            // Detect which section is in view
            const sectionIds = ["hero", ...navLinks.map((l) => l.id)];
            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const el = document.getElementById(sectionIds[i]);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 120) {
                        setActiveSection(sectionIds[i]);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on resize
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ── Smooth scroll handler ─────────────────────────────
    const handleNavClick = useCallback((id) => {
        setMenuOpen(false);
        if (!isHome) {
            // Navigate home first, then scroll after paint
            navigate("/");
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isHome, navigate]);

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? "backdrop-blur-xl border-b border-white/5"
                        : "bg-transparent"
                }`}
                style={scrolled ? { background: "rgba(5, 8, 22, 0.85)" } : {}}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">

                    {/* ── Logo ────────────────────────────── */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 group"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        {/* Glowing orbit icon */}
                        <div className="relative w-8 h-8">
                            <div className="absolute inset-0 rounded-full border-2 border-[#915eff] opacity-60 group-hover:opacity-100 transition-opacity" />
                            <div
                                className="absolute inset-1 rounded-full"
                                style={{ background: "linear-gradient(135deg, #915eff, #00d4ff)" }}
                            />
                            <div
                                className="absolute -inset-1 rounded-full border border-[#00d4ff] opacity-0 group-hover:opacity-40 transition-opacity animate-spin-slow"
                                style={{ borderStyle: "dashed" }}
                            />
                        </div>
                        <span className="font-display text-lg font-bold tracking-wider gradient-text">
                            DS
                        </span>
                    </Link>

                    {/* ── Desktop nav links ────────────────── */}
                    <ul className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <button
                                    onClick={() => handleNavClick(link.id)}
                                    className={`relative px-4 py-2 text-sm font-medium font-body rounded-lg transition-all duration-200 ${
                                        activeSection === link.id && isHome
                                            ? "text-white"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {/* Active indicator pill */}
                                    {activeSection === link.id && isHome && (
                                        <motion.div
                                            layoutId="nav-active"
                                            className="absolute inset-0 rounded-lg"
                                            style={{ background: "rgba(145, 94, 255, 0.15)", border: "1px solid rgba(145,94,255,0.3)" }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* ── CTA + Mobile toggle ───────────────── */}
                    <div className="flex items-center gap-3">
                        <a
                            href="mailto:divyansh.convivial@gmail.com"
                            className="hidden md:inline-flex btn-primary text-sm px-5 py-2 rounded-lg font-semibold z-10 relative"
                            style={{ background: "linear-gradient(135deg, #915eff, #00d4ff)", boxShadow: "0 0 20px rgba(145,94,255,0.3)" }}
                        >
                            Hire Me
                        </a>

                        {/* Hamburger */}
                        <button
                            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg border border-white/10 hover:border-[#915eff]/50 transition-colors"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                className="block w-5 h-0.5 bg-gray-300"
                            />
                            <motion.span
                                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="block w-5 h-0.5 bg-gray-300"
                            />
                            <motion.span
                                animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                className="block w-5 h-0.5 bg-gray-300"
                            />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* ── Mobile menu drawer ─────────────────────── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-16 left-0 right-0 z-40 md:hidden"
                        style={{ background: "rgba(5, 8, 22, 0.97)", borderBottom: "1px solid rgba(145,94,255,0.2)" }}
                    >
                        <ul className="flex flex-col py-4 px-6 gap-1">
                            {navLinks.map((link, idx) => (
                                <motion.li
                                    key={link.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <button
                                        onClick={() => handleNavClick(link.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                            activeSection === link.id
                                                ? "text-white bg-[#915eff]/15 border border-[#915eff]/30"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                </motion.li>
                            ))}
                            <li className="pt-2">
                                <a
                                    href="mailto:divyansh.convivial@gmail.com"
                                    className="block text-center py-3 rounded-lg text-sm font-semibold text-white"
                                    style={{ background: "linear-gradient(135deg, #915eff, #00d4ff)" }}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Hire Me
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
