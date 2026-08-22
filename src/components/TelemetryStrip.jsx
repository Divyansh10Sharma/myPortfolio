import { useEffect, useRef, useState } from "react";

// ============================================================
// Step reconciliation telemetry.
//
// The hardware step sensor reports a cumulative count since boot, so
// "steps today" is derived by subtracting a boot-time offset. When that
// offset goes stale the derived count over-reports, and the error grows
// until the offset is re-derived against Google Fit — every 50 steps.
//
// Top panel: both series, near-coincident (the reconciliation works).
// Bottom panel: the residual, magnified — where the story is legible.
// ============================================================

const STEP_MAX = 300;
const RESYNC = 50;

// Plot geometry (viewBox units).
const X0 = 56;
const X1 = 900;
const A_TOP = 16;
const A_BOT = 92;
const A_MAX = 330;
const B_TOP = 124;
const B_BOT = 158;
const B_MAX = 26;

const x = (s) => X0 + (s / STEP_MAX) * (X1 - X0);
const yA = (v) => A_BOT - (v / A_MAX) * (A_BOT - A_TOP);
const yB = (d) => B_BOT - (d / B_MAX) * (B_BOT - B_TOP);

// Deterministic — no Math.random, so the figure is identical every render.
const drift = (s) => {
    const phase = s - Math.floor(s / RESYNC) * RESYNC;
    const wobble = Math.sin(s * 0.55) * 0.8 + Math.sin(s * 0.17 + 1.3) * 0.55;
    // Wobble fades in after a resync so each window starts cleanly at zero.
    return Math.max(0, phase * 0.44 + wobble * Math.min(1, phase / 10));
};

// Sample densely, with an extra sample immediately before each resync so the
// drop reads as a near-vertical edge rather than a diagonal.
const samples = (() => {
    const out = [];
    for (let start = 0; start <= STEP_MAX; start += RESYNC) {
        for (let p = 0; p <= 49 && start + p <= STEP_MAX; p += 3.5) out.push(start + p);
        if (start + 49.6 <= STEP_MAX) out.push(start + 49.6);
    }
    return out;
})();

const toPath = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join("");

const reconciledPath = toPath(samples.map((s) => [x(s), yA(s)]));
const sensorPath = toPath(samples.map((s) => [x(s), yA(s + drift(s))]));
const residualPath = toPath(samples.map((s) => [x(s), yB(drift(s))]));

const resyncPoints = [];
for (let s = RESYNC; s <= STEP_MAX; s += RESYNC) resyncPoints.push(s);

const xTicks = [0, 50, 100, 150, 200, 250, 300];

/** Measures its own length so the draw animation is exact, not guessed. */
const DrawnPath = ({ d, stroke, width = 1.5, delay = 0, dashed = false }) => {
    const ref = useRef(null);
    const [len, setLen] = useState(null);

    useEffect(() => {
        if (ref.current) setLen(ref.current.getTotalLength());
    }, []);

    return (
        <path
            ref={ref}
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={width}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={dashed ? "3 3" : undefined}
            className={len && !dashed ? "draw" : undefined}
            style={
                len && !dashed
                    ? { "--len": len, "--draw-delay": `${delay}ms` }
                    : { opacity: len === null ? 0 : 1 }
            }
        />
    );
};

const TelemetryStrip = () => (
    <figure id="fig-01" className="w-full scroll-mt-24">
        <figcaption className="mb-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="font-mono text-xs text-graphite">
                fig. 01 — sensor drift vs reconciled total, resync every 50 steps
            </span>
            <span className="flex items-center gap-4 font-mono text-xs text-graphite">
                <span className="flex items-center gap-2">
                    <svg width="16" height="8" aria-hidden="true" className="shrink-0">
                        <line x1="0" y1="4" x2="16" y2="4" stroke="var(--signal)" strokeWidth="1.5" />
                    </svg>
                    reconciled
                </span>
                <span className="flex items-center gap-2">
                    <svg width="16" height="8" aria-hidden="true" className="shrink-0">
                        <line x1="0" y1="4" x2="16" y2="4" stroke="var(--warn)" strokeWidth="1.5" />
                    </svg>
                    raw sensor
                </span>
            </span>
        </figcaption>

        {/* Scrolls rather than squashing below ~720px. */}
        <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
            <svg
                viewBox="0 0 920 198"
                width="920"
                height="198"
                className="h-auto w-[920px] min-w-[720px] max-w-none md:w-full"
                role="img"
                aria-label="Line chart. Top panel: the raw hardware step sensor and the reconciled cloud-authoritative total, rising together across 300 steps and visually near-identical. Bottom panel: the residual between them, a sawtooth that climbs to roughly 23 steps of drift and resets to zero at every 50-step resync."
            >
                <g className="fade-in-late" style={{ "--draw-delay": "200ms" }}>
                    {/* Panel frames — hairline, open on the right. */}
                    <line x1={X0} y1={A_TOP} x2={X0} y2={A_BOT} stroke="var(--rule)" strokeWidth="1" />
                    <line x1={X0} y1={B_TOP} x2={X0} y2={B_BOT} stroke="var(--rule)" strokeWidth="1" />

                    {/* Horizontal gridlines + y labels. */}
                    {[
                        { v: 0, label: "0" },
                        { v: 150, label: "150" },
                        { v: 300, label: "300" },
                    ].map(({ v, label }) => (
                        <g key={`a${v}`}>
                            <line
                                x1={X0}
                                y1={yA(v)}
                                x2={X1}
                                y2={yA(v)}
                                stroke="var(--rule)"
                                strokeWidth="1"
                                strokeDasharray={v === 0 ? undefined : "2 4"}
                            />
                            <text
                                x={X0 - 10}
                                y={yA(v) + 3}
                                textAnchor="end"
                                fontFamily="'IBM Plex Mono', monospace"
                                fontSize="9"
                                fill="var(--graphite)"
                            >
                                {label}
                            </text>
                        </g>
                    ))}

                    {[
                        { d: 0, label: "0" },
                        { d: 24, label: "+24" },
                    ].map(({ d, label }) => (
                        <g key={`b${d}`}>
                            <line
                                x1={X0}
                                y1={yB(d)}
                                x2={X1}
                                y2={yB(d)}
                                stroke="var(--rule)"
                                strokeWidth="1"
                                strokeDasharray={d === 0 ? undefined : "2 4"}
                            />
                            <text
                                x={X0 - 10}
                                y={yB(d) + 3}
                                textAnchor="end"
                                fontFamily="'IBM Plex Mono', monospace"
                                fontSize="9"
                                fill="var(--graphite)"
                            >
                                {label}
                            </text>
                        </g>
                    ))}

                    {/* Resync events — dashed verticals spanning both panels. */}
                    {resyncPoints.map((s) => (
                        <line
                            key={s}
                            x1={x(s)}
                            y1={A_TOP}
                            x2={x(s)}
                            y2={B_BOT}
                            stroke="var(--rule)"
                            strokeWidth="1"
                            strokeDasharray="2 5"
                        />
                    ))}

                    {/* X axis ticks + labels. */}
                    {xTicks.map((s) => (
                        <g key={`x${s}`}>
                            <line
                                x1={x(s)}
                                y1={B_BOT}
                                x2={x(s)}
                                y2={B_BOT + 5}
                                stroke="var(--graphite)"
                                strokeWidth="1"
                            />
                            <text
                                x={x(s)}
                                y={B_BOT + 17}
                                textAnchor="middle"
                                fontFamily="'IBM Plex Mono', monospace"
                                fontSize="9"
                                fill="var(--graphite)"
                            >
                                {s}
                            </text>
                        </g>
                    ))}
                    {/* Unit and event annotations sit on their own row, clear
                        of the tick labels. */}
                    <text
                        x={X1}
                        y={B_BOT + 32}
                        textAnchor="end"
                        fontFamily="'IBM Plex Mono', monospace"
                        fontSize="9"
                        fill="var(--graphite)"
                        letterSpacing="0.08em"
                    >
                        STEPS
                    </text>
                    <text
                        x={x(50)}
                        y={B_BOT + 32}
                        textAnchor="middle"
                        fontFamily="'IBM Plex Mono', monospace"
                        fontSize="9"
                        fill="var(--graphite)"
                    >
                        ↑ resync
                    </text>

                    {/* Panel captions. */}
                    <text
                        x={X0}
                        y={A_TOP - 6}
                        fontFamily="'IBM Plex Mono', monospace"
                        fontSize="9"
                        fill="var(--graphite)"
                        letterSpacing="0.08em"
                    >
                        CUMULATIVE COUNT
                    </text>
                    <text
                        x={X0}
                        y={B_TOP - 6}
                        fontFamily="'IBM Plex Mono', monospace"
                        fontSize="9"
                        fill="var(--graphite)"
                        letterSpacing="0.08em"
                    >
                        RESIDUAL Δ — SENSOR MINUS RECONCILED
                    </text>
                </g>

                {/* Series — reconciled first so the drifting sensor reads on top. */}
                <DrawnPath d={reconciledPath} stroke="var(--signal)" delay={150} />
                <DrawnPath d={sensorPath} stroke="var(--warn)" delay={150} />
                <DrawnPath d={residualPath} stroke="var(--warn)" delay={400} />

                {/* Zero residual — by definition, the reconciled total. */}
                <line
                    x1={X0}
                    y1={yB(0)}
                    x2={X1}
                    y2={yB(0)}
                    stroke="var(--signal)"
                    strokeWidth="1.5"
                    className="fade-in-late"
                    style={{ "--draw-delay": "1000ms" }}
                />

                {/* Resync markers on the residual baseline. */}
                <g className="fade-in-late" style={{ "--draw-delay": "1400ms" }}>
                    {resyncPoints.map((s) => (
                        <circle
                            key={s}
                            cx={x(s)}
                            cy={yB(0)}
                            r="2.5"
                            fill="var(--paper)"
                            stroke="var(--signal)"
                            strokeWidth="1.5"
                        />
                    ))}
                </g>
            </svg>
        </div>
    </figure>
);

export default TelemetryStrip;
