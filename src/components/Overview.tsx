import { forwardRef } from "react";
import { overview } from "../data/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/**
 * About, plus the portrait that signature effect A draws over.
 *
 * Same forwardRef pattern as Hero: App needs the real <img> to hand to the
 * shader plane.
 */
export const Overview = forwardRef<HTMLImageElement>(function Overview(_props, ref) {
    const { heading, paragraphs, certification, portraitAlt } = overview;

    return (
        <Section id="overview" index="01" label="Overview">
            <div className="section__grid">
                <div className="col-main">
                    <Reveal as="h2">{heading}</Reveal>

                    {paragraphs.map((paragraph, i) => (
                        <Reveal as="p" className="prose" key={i} delay={0.05 * (i + 1)}>
                            {paragraph}
                        </Reveal>
                    ))}
                </div>

                <Reveal className="col-side" delay={0.1}>
                    <figure className="portrait">
                        {/* 680px covers the 340px slot at 2x. The full-resolution
                            original lives in assets-source/, outside public/, so
                            it is never shipped. */}
                        <picture>
                            <source srcSet="/divyansh.webp" type="image/webp" />
                            <img
                                ref={ref}
                                src="/divyansh-680.jpg"
                                alt={portraitAlt}
                                width={680}
                                height={680}
                                decoding="async"
                            />
                        </picture>
                    </figure>

                    <p className="label">Certification</p>
                    <p className="side__item">{certification.name}</p>
                    <p className="side__meta">{certification.detail}</p>
                    <p className="side__meta">{certification.date}</p>
                </Reveal>
            </div>
        </Section>
    );
});
