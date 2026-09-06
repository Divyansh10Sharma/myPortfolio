import { testimonials } from "../data/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Testimonials() {
    return (
        <Section id="testimonials" index="05" label="Testimonials">
            <div className="quotes">
                {testimonials.map((item, i) => (
                    <Reveal key={item.name} delay={i * 0.06}>
                        <figure>
                            <blockquote>{item.quote}</blockquote>
                            <figcaption>
                                — {item.name}, {item.title}
                            </figcaption>
                        </figure>
                    </Reveal>
                ))}
            </div>
        </Section>
    );
}
