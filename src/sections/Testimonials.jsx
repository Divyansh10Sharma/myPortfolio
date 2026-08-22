import { testimonials } from "../data";
import { Section } from "../components/Spine";
import Reveal from "../components/Reveal";

const Testimonials = () => (
    <Section index="05" label="TESTIMONIALS" id="testimonials">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
            {testimonials.map((item, i) => (
                <Reveal
                    key={item.name}
                    delay={i * 60}
                    className={i === 0 ? "md:col-span-5" : "md:col-span-5 md:col-start-8"}
                >
                    <figure>
                        <blockquote className="border-l border-signal pl-5">
                            <p className="font-sans text-lg text-ink">{item.quote}</p>
                        </blockquote>
                        <figcaption className="mt-4 pl-5 font-mono text-sm text-graphite">
                            — {item.name}, {item.title}
                        </figcaption>
                    </figure>
                </Reveal>
            ))}
        </div>
    </Section>
);

export default Testimonials;
