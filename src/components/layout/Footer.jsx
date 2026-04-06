// ============================================================
// Footer.jsx — Minimal cosmic footer
// ============================================================

import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { heroData } from "../../assets/data";

const Footer = () => (
    <footer
        className="relative z-10 py-8 px-6 md:px-16"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: "linear-gradient(135deg, #915eff, #00d4ff)" }}
                />
                <span className="font-display text-sm font-bold gradient-text">Divyansh Sharma</span>
            </div>

            <p className="text-gray-600 text-xs font-mono text-center">
                © {new Date().getFullYear()} · Built with React + Tailwind · Deployed on Vercel
            </p>

            <div className="flex gap-3">
                {[
                    { href: heroData.github,  Icon: FiGithub,   label: "GitHub"   },
                    { href: heroData.linkedin, Icon: FiLinkedin, label: "LinkedIn" },
                    { href: `mailto:${heroData.email}`, Icon: FiMail, label: "Email" },
                ].map(({ href, Icon, label }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <Icon size={14} />
                    </a>
                ))}
            </div>
        </div>
    </footer>
);

export default Footer;
