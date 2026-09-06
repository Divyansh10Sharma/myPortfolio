import { hero, profile } from "../../data/content";
import { Pill, Tag } from "../ui";

/**
 * The aurora moment. Once per page, and this is it.
 *
 * DESIGN.md is unusually strict about this element: the beam is 15–25% of the
 * page width, it runs iris → ember → white, and it must never become a
 * full-surface background. That restraint is the reason it works — a gradient
 * covering everything is a wallpaper, a gradient covering a fifth of the
 * screen is a light source.
 *
 * The three layers are separate elements rather than one stacked background
 * because they need different blurs. The beam is blurred hard enough to lose
 * its edges entirely; the sunburst underneath it stays comparatively tight so
 * the base still reads as the hottest point.
 */
export function Hero() {
    return (
        <section className="hero" id="top">
            <div className="aurora" aria-hidden="true">
                <div className="aurora__beam" />
                <div className="aurora__sunburst" />
            </div>

            <div className="shell">
                <div className="hero__inner">
                    <Tag tone="ember" dot>
                        {profile.availability}
                    </Tag>

                    <h1 className="display">{hero.headline}</h1>

                    <p className="subheading muted">{hero.sub}</p>

                    <div className="hero__actions">
                        {/* The white pill is the one place white is a
                            foreground rather than a background, and DESIGN.md
                            reserves it for the single most important action.
                            Here that is "look at the work". */}
                        <Pill href="#systems" variant="white" arrow>
                            See the systems
                        </Pill>
                        <Pill href={`mailto:${profile.email}`} variant="ghost">
                            {profile.email}
                        </Pill>
                    </div>
                </div>
            </div>
        </section>
    );
}
