import { testimonials } from "../../data/content";
import { Band, Reveal, SectionHead } from "../ui";

/**
 * Two quotes, in 30px-radius panels.
 *
 * The panel radius is the largest in the system and it is used exactly once,
 * here. That is deliberate: quotes are the only content on the page written by
 * someone other than Divyansh, and giving them a shape nothing else has is a
 * quieter way of saying so than a label would be.
 *
 * No heading. The real site has none for this section either — only its
 * numbered label — and writing one would be inventing copy.
 */
export function Testimonials() {
    return (
        <Band tone="linen" id="testimonials">
            <SectionHead eyebrow="05 · Testimonials" />

            <div className="grid grid--2">
                {testimonials.map((item, index) => (
                    <Reveal key={item.name} delay={index * 100}>
                        <figure className="quote">
                            <p className="quote__mark" aria-hidden="true">
                                “
                            </p>
                            <blockquote className="subheading">
                                {item.quote}
                            </blockquote>
                            <figcaption className="muted">
                                {item.name} · {item.title}
                            </figcaption>
                        </figure>
                    </Reveal>
                ))}
            </div>
        </Band>
    );
}
