import { stats } from "../../data/content";
import { Band, Reveal } from "../ui";

/**
 * Four numbers, straight under the hero.
 *
 * On the obsidian canvas rather than the void, so it reads as a step up out of
 * the hero's darkness rather than a continuation of it. This is the smallest
 * possible use of the dark/light band rhythm — the tone changes, the mode does
 * not.
 */
export function Stats() {
    return (
        <Band tone="canvas" tight>
            <div className="stats">
                {stats.map((stat, index) => (
                    // Staggered by index, so the four arrive as a sequence.
                    <Reveal key={stat.label} delay={index * 80}>
                        <p className="stat__value">{stat.value}</p>
                        <p className="stat__label">{stat.label}</p>
                    </Reveal>
                ))}
            </div>
        </Band>
    );
}
