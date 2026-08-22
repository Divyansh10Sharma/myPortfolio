import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks, profile } from "../data";
import { ArrowUpRight } from "./Icons";

const Nav = () => {
    const { pathname } = useLocation();
    const isHome = pathname === "/";
    const [active, setActive] = useState("");

    useEffect(() => {
        if (!isHome) return;

        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                // The section whose top has most recently passed the nav.
                let current = "";
                for (const { id } of navLinks) {
                    const el = document.getElementById(id);
                    if (el && el.getBoundingClientRect().top <= 140) current = id;
                }
                setActive(current);
            });
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [isHome]);

    return (
        <header className="sticky top-0 z-50 border-b border-rule bg-paper">
            <nav aria-label="Primary" className="mx-auto w-full max-w-content px-6">
                <div className="flex h-14 items-center gap-4">
                    {isHome ? (
                        <a href="#top" className="link shrink-0 font-mono text-sm text-ink">
                            {profile.name}
                        </a>
                    ) : (
                        <Link to="/" className="link shrink-0 font-mono text-sm text-ink">
                            {profile.name}
                        </Link>
                    )}

                    {/* The full set can't fit at 375px without truncating
                        mid-word, so section links are desktop-only. */}
                    {isHome ? (
                        <>
                            <span
                                aria-hidden="true"
                                className="hidden h-4 w-px shrink-0 bg-rule md:block"
                            />
                            <ul className="hidden min-w-0 items-center gap-5 md:flex">
                                {navLinks.map((link) => (
                                    <li key={link.id} className="shrink-0">
                                        <a
                                            href={`#${link.id}`}
                                            aria-current={active === link.id ? "true" : undefined}
                                            className={`link font-mono text-sm transition-colors duration-150 ${
                                                active === link.id
                                                    ? "text-signal"
                                                    : "text-graphite hover:text-ink"
                                            }`}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <span
                                aria-hidden="true"
                                className="hidden h-4 w-px shrink-0 bg-rule sm:block"
                            />
                            <Link
                                to="/"
                                className="link hidden min-w-0 font-mono text-sm text-graphite hover:text-ink sm:block"
                            >
                                ← Index
                            </Link>
                        </>
                    )}

                    <span className="flex-1" />

                    <a
                        href={profile.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="link flex shrink-0 items-center gap-1.5 border-l border-rule pl-4 font-mono text-sm text-ink"
                    >
                        Resume
                        <ArrowUpRight size={12} className="text-graphite" />
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default Nav;
