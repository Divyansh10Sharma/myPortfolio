import { useEffect, useState } from "react";
import { profile, navLinks } from "../../data/content";
import { Pill } from "../ui";

/**
 * Transparent over the hero, opaque once you leave it.
 *
 * The scroll listener is the one place this experiment reads scroll position,
 * and it stores a BOOLEAN in state rather than the position itself. That
 * distinction is the whole reason this is allowed to be React state at all:
 * the value changes twice in a session, not sixty times a second, so a
 * re-render is exactly the right response to it.
 */
export function Nav() {
    const [stuck, setStuck] = useState(false);

    useEffect(() => {
        const onScroll = () => setStuck(window.scrollY > 24);

        onScroll(); // set the correct state for a page loaded mid-scroll
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={stuck ? "nav is-stuck" : "nav"}>
            <div className="nav__inner">
                <a className="nav__mark" href="#top">
                    <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
                        <rect width="32" height="32" rx="8" fill="#111111" />
                        <path
                            d="M4 23 L11 10 L11 23 L18 10 L18 23 L25 10"
                            fill="none"
                            stroke="#5683da"
                            strokeWidth="2.5"
                            strokeLinejoin="miter"
                        />
                    </svg>
                    {profile.name}
                </a>

                <nav aria-label="Sections">
                    <ul className="nav__links">
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <a href={`#${link.id}`}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="nav__actions">
                    <a
                        className="nav__text-link"
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        GitHub
                    </a>
                    <Pill href={profile.resume} variant="ghost" external>
                        Résumé
                    </Pill>
                    <Pill href={`mailto:${profile.email}`} variant="primary">
                        Get in touch
                    </Pill>
                </div>
            </div>
        </header>
    );
}
