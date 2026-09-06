import { forwardRef } from "react";
import { hero, profile, stats } from "../data/content";
import { Reveal } from "./Reveal";

/**
 * The hero.
 *
 * forwardRef because App needs the actual <h1> element to hand to the WebGL
 * text plane — the shader has to know exactly where the heading sits and what
 * it says. This is the React way of doing what the vanilla build did with
 * document.querySelector: the parent owns the reference, the child just exposes
 * it, and there is no global lookup that can silently match the wrong thing.
 */
export const Hero = forwardRef<HTMLHeadingElement, { ready: boolean }>(function Hero(
    { ready },
    ref
) {
    return (
        <section className="hero">
            <Reveal as="p" className="hero__meta" enabled={ready}>
                <span className="dot" aria-hidden="true" />
                {profile.availability}
            </Reveal>

            {/* Stays a real, readable <h1>. The shader draws over it and it is
                only hidden once that shader is genuinely painting. */}
            <h1 className="hero__headline" ref={ref}>
                {hero.headline}
            </h1>

            <Reveal as="p" className="hero__sub" delay={0.1} enabled={ready}>
                {hero.sub}
            </Reveal>

            <Reveal as="dl" className="stats" delay={0.2} enabled={ready}>
                {stats.map((stat) => (
                    <div className="stat" key={stat.label}>
                        <dd>{stat.value}</dd>
                        <dt>{stat.label}</dt>
                    </div>
                ))}
            </Reveal>
        </section>
    );
});
