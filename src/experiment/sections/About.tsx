import { overview } from "../../data/content";
import { Band, Reveal, SectionHead, Tag } from "../ui";

/**
 * The contrast flip.
 *
 * Everything above this point has been dark. This band is white, and that
 * change is doing structural work rather than decorative — DESIGN.md calls the
 * alternation "the page's structural rhythm", and this is the beat where it
 * lands hardest. The reader has been looking at a lit stage; now the lights
 * come up and there is a person to read about.
 *
 * The photograph gets the product-screenshot frame treatment: 12px radius and
 * the one heavy shadow the system permits. On this page it is the only piece
 * of real photography, which is exactly why it can carry that weight.
 */
export function About() {
    return (
        <Band tone="light" id="overview">
            <SectionHead eyebrow="01 · Overview" title={overview.heading} />

            <div className="about">
                <Reveal className="about__copy">
                    {overview.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 32)} className="body-lg muted">
                            {paragraph}
                        </p>
                    ))}

                    <div className="tags">
                        <Tag tone="iris">{overview.certification.name}</Tag>
                        <Tag tone="ember">{overview.certification.detail}</Tag>
                        <Tag tone="ash">{overview.certification.date}</Tag>
                    </div>
                </Reveal>

                <Reveal delay={120}>
                    {/* width and height are the image's real intrinsic size.
                        They do not size it — the stylesheet does — they let the
                        browser reserve a correctly shaped box before the file
                        arrives, so the band does not jump when it lands. */}
                    <div className="frame">
                        <img
                            src="/divyansh.webp"
                            alt={overview.portraitAlt}
                            width={680}
                            height={680}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </Reveal>
            </div>
        </Band>
    );
}
