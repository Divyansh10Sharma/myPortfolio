import { useEffect, useState } from "react";
import { navLinks, profile } from "../data/content";

/**
 * Sticky nav. Highlights whichever section is currently under it.
 *
 * IntersectionObserver rather than a scroll handler, so the browser does the
 * work off the main thread. The active id IS React state — it changes rarely
 * (only when you cross a section boundary) and when it does we genuinely want a
 * re-render to move the highlight. Compare with scroll position, which changes
 * every frame and must never be state.
 */
export function Nav() {
    const [active, setActive] = useState<string>("");

    useEffect(() => {
        const sections = navLinks
            .map((link) => document.getElementById(link.id))
            .filter((el): el is HTMLElement => el !== null);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            // A band across the upper third: a section is "current" once its
            // top passes the nav, not when it is fully on screen.
            { rootMargin: "-60px 0px -66% 0px" }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return (
        <header className="nav">
            <div className="nav__inner">
                <a className="nav__name" href="#top">
                    {profile.name}
                </a>

                <nav className="nav__links" aria-label="Primary">
                    {navLinks.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            className={active === link.id ? "is-active" : undefined}
                            aria-current={active === link.id ? "true" : undefined}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <a
                    className="nav__resume"
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                >
                    Resume ↗
                </a>
            </div>
        </header>
    );
}
