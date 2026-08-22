import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./Reveal";

// "5K+" -> { value: 5, suffix: "K+" }, "120%" -> { value: 120, suffix: "%" }
const parse = (raw) => {
    const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(raw.trim());
    if (!match) return null;
    return { value: parseFloat(match[1]), suffix: match[2] };
};

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Counts a stat up to its value once, when `run` first turns true.
 * Falls back to the literal string if it isn't numeric, and to the final
 * value immediately under reduced motion.
 */
const CountUp = ({ value: raw, run, duration = 900 }) => {
    const parsed = parse(raw);
    const [display, setDisplay] = useState(() => (parsed ? 0 : null));
    const started = useRef(false);

    useEffect(() => {
        if (!run || !parsed || started.current) return;
        started.current = true;

        if (prefersReducedMotion()) {
            setDisplay(parsed.value);
            return;
        }

        let frame = 0;
        const t0 = performance.now();
        const tick = (now) => {
            const t = Math.min(1, (now - t0) / duration);
            setDisplay(parsed.value * easeOut(t));
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [run, raw, duration]);

    if (!parsed) return raw;

    // Integers stay integers while counting; one decimal otherwise.
    const isInt = Number.isInteger(parsed.value);
    const shown = isInt ? Math.round(display) : display.toFixed(1);

    return (
        <span className="tabular-nums">
            {shown}
            {parsed.suffix}
        </span>
    );
};

export default CountUp;
