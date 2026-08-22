import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================
// Step reconciliation, plotted as one thing: how far the phone's
// step sensor has drifted ahead of the true count.
//
// The sensor reports a cumulative count since boot, so "steps today"
// is derived by subtracting a boot-time offset. A stale offset makes
// the count run high, and the error grows until the offset is
// re-derived — every 50 steps.
//
// Scrub the plot (pointer or arrow keys) to read the two counts at
// any point. The readout is the argument: two numbers that disagree,
// and the gap between them.
// ============================================================

const STEP_MAX = 300;
const RESYNC = 50;

// Plot geometry (viewBox units).
const VB_W = 920;
const VB_H = 170;
const X0 = 96;
const X1 = 890;
const TOP = 36; // drift = D_MAX
const BASE = 120; // drift = 0
const D_MAX = 28;

const x = (s) => X0 + (s / STEP_MAX) * (X1 - X0);
const y = (d) => BASE - (d / D_MAX) * (BASE - TOP);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

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

const driftPath = samples
    .map((s, i) => `${i ? "L" : "M"}${x(s).toFixed(2)} ${y(drift(s)).toFixed(2)}`)
    .join("");

const resyncPoints = [];
for (let s = RESYNC; s <= STEP_MAX; s += RESYNC) resyncPoints.push(s);

const xTicks = [0, 100, 200, 300];
const MONO = "'IBM Plex Mono', monospace";

/** One labelled figure in the readout. Fixed width so nothing jitters. */
const Cell = ({ label, value, tone = "text-ink", width = "3ch" }) => (
    <span className="flex items-baseline gap-1.5">
        <span className="text-graphite">{label}</span>
        <span className={`${tone} tabular-nums`} style={{ minWidth: width }}>
            {value}
        </span>
    </span>
);

const TelemetryStrip = () => {
    const svgRef = useRef(null);
    const drawRef = useRef(null);
    const [len, setLen] = useState(null);
    const [cursor, setCursor] = useState(null); // step under the pointer

    useEffect(() => {
        if (drawRef.current) setLen(drawRef.current.getTotalLength());
    }, []);

    // Map a client x-coordinate onto the plot's step axis.
    const stepFromClientX = useCallback((clientX) => {
        const svg = svgRef.current;
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        if (!rect.width) return null;
        const localX = ((clientX - rect.left) / rect.width) * VB_W;
        const t = (localX - X0) / (X1 - X0);
        return clamp(Math.round(t * STEP_MAX), 0, STEP_MAX);
    }, []);

    const onPointerMove = (e) => {
        // Ignore touch: on mobile the figure scrolls horizontally instead.
        if (e.pointerType === "touch") return;
        setCursor(stepFromClientX(e.clientX));
    };

    const onKeyDown = (e) => {
        const delta = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0;
        if (!delta) return;
        e.preventDefault();
        setCursor((c) => clamp((c ?? 0) + delta, 0, STEP_MAX));
    };

    const active = cursor !== null;
    const d = active ? drift(cursor) : 0;
    const sensor = active ? Math.round(cursor + d) : 0;

    return (
        <figure id="fig-01" className="w-full scroll-mt-24">
            <figcaption className="mb-4 max-w-measure font-mono text-xs leading-relaxed text-graphite">
                <span className="text-ink">fig. 01</span> — the phone&rsquo;s step sensor
                creeps ahead of the real count as you walk. Every 50 steps the app
                re-derives its offset against the cloud total, and the error drops back
                to zero.
            </figcaption>

            {/* Readout. Holds its height so the chart never shifts. */}
            <div className="mb-2 flex h-5 flex-wrap items-baseline gap-x-5 gap-y-1 font-mono text-xs">
                {active ? (
                    <>
                        <Cell label="STEP" value={cursor} />
                        <Cell label="SENSOR" value={sensor} tone="text-warn-ink" />
                        <Cell label="RECONCILED" value={cursor} tone="text-signal" />
                        <Cell
                            label="DRIFT"
                            value={`+${Math.round(d)}`}
                            tone={Math.round(d) === 0 ? "text-graphite" : "text-warn-ink"}
                        />
                    </>
                ) : (
                    <span className="text-graphite">
                        {/* Scrubbing is pointer-only; on touch the plot scrolls
                            instead, so the hint has to differ. */}
                        <span className="sm:hidden">swipe the plot to explore →</span>
                        <span className="hidden sm:inline">
                            scrub the plot to read both counts · ← → to step
                        </span>
                    </span>
                )}
            </div>

            {/* Scrolls rather than squashing below ~640px. */}
            <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${VB_W} ${VB_H}`}
                    width={VB_W}
                    height={VB_H}
                    tabIndex={0}
                    onPointerMove={onPointerMove}
                    onPointerLeave={() => setCursor(null)}
                    onKeyDown={onKeyDown}
                    onBlur={() => setCursor(null)}
                    className="h-auto w-[920px] min-w-[640px] max-w-none rounded md:w-full"
                    role="img"
                    aria-label="Line chart of step-sensor drift over 300 steps. The drift climbs steadily to roughly 23 steps, then drops to zero at every 50-step resync, repeating six times as a sawtooth. A flat line at zero marks the reconciled total. Use the left and right arrow keys to read values along the plot."
                >
                    <g className="fade-in-late" style={{ "--draw-delay": "150ms" }}>
                        <text
                            x={X0}
                            y={20}
                            fontFamily={MONO}
                            fontSize="9"
                            fill="var(--graphite)"
                            letterSpacing="0.1em"
                        >
                            STEPS AHEAD OF THE TRUE COUNT
                        </text>

                        {/* Upper reference line — roughly where drift peaks. */}
                        <line
                            x1={X0}
                            y1={y(24)}
                            x2={X1}
                            y2={y(24)}
                            stroke="var(--rule)"
                            strokeWidth="1"
                            strokeDasharray="2 4"
                        />
                        <text
                            x={X0 - 10}
                            y={y(24) + 3}
                            textAnchor="end"
                            fontFamily={MONO}
                            fontSize="9.5"
                            fill="var(--graphite)"
                        >
                            +24
                        </text>
                        <text
                            x={X0 - 10}
                            y={BASE + 3}
                            textAnchor="end"
                            fontFamily={MONO}
                            fontSize="9.5"
                            fill="var(--graphite)"
                        >
                            0
                        </text>

                        <line
                            x1={X0}
                            y1={TOP}
                            x2={X0}
                            y2={BASE}
                            stroke="var(--rule)"
                            strokeWidth="1"
                        />

                        {xTicks.map((s) => (
                            <g key={s}>
                                <line
                                    x1={x(s)}
                                    y1={BASE}
                                    x2={x(s)}
                                    y2={BASE + 5}
                                    stroke="var(--graphite)"
                                    strokeWidth="1"
                                />
                                <text
                                    x={x(s)}
                                    y={BASE + 19}
                                    textAnchor="middle"
                                    fontFamily={MONO}
                                    fontSize="9.5"
                                    fill="var(--graphite)"
                                >
                                    {s}
                                </text>
                            </g>
                        ))}
                        <text
                            x={X1}
                            y={BASE + 34}
                            textAnchor="end"
                            fontFamily={MONO}
                            fontSize="9"
                            fill="var(--graphite)"
                            letterSpacing="0.1em"
                        >
                            STEPS WALKED
                        </text>
                        <text
                            x={x(50)}
                            y={BASE + 19}
                            textAnchor="middle"
                            fontFamily={MONO}
                            fontSize="9.5"
                            fill="var(--graphite)"
                        >
                            ↑ resync
                        </text>
                    </g>

                    {/* The drifting sensor. */}
                    <path
                        ref={drawRef}
                        d={driftPath}
                        fill="none"
                        stroke="var(--warn)"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className={len ? "draw" : undefined}
                        style={len ? { "--len": len, "--draw-delay": "250ms" } : { opacity: 0 }}
                    />

                    {/* Zero drift — the reconciled, cloud-authoritative total. */}
                    <line
                        x1={X0}
                        y1={BASE}
                        x2={X1}
                        y2={BASE}
                        stroke="var(--signal)"
                        strokeWidth="1.75"
                        className="fade-in-late"
                        style={{ "--draw-delay": "150ms" }}
                    />

                    <g className="fade-in-late" style={{ "--draw-delay": "1300ms" }}>
                        {resyncPoints.map((s) => (
                            <circle
                                key={s}
                                cx={x(s)}
                                cy={BASE}
                                r="2.75"
                                fill="var(--paper)"
                                stroke="var(--signal)"
                                strokeWidth="1.75"
                            />
                        ))}
                    </g>

                    {/* ── Scrub crosshair ─────────────────────────── */}
                    {active && (
                        <g pointerEvents="none">
                            <line
                                x1={x(cursor)}
                                y1={TOP - 12}
                                x2={x(cursor)}
                                y2={BASE}
                                stroke="var(--graphite)"
                                strokeWidth="1"
                            />
                            {/* The gap being measured, drawn as a bar. */}
                            <line
                                x1={x(cursor)}
                                y1={y(d)}
                                x2={x(cursor)}
                                y2={BASE}
                                stroke="var(--warn)"
                                strokeWidth="3"
                                opacity="0.25"
                            />
                            <circle
                                cx={x(cursor)}
                                cy={y(d)}
                                r="3.25"
                                fill="var(--warn)"
                                stroke="var(--paper)"
                                strokeWidth="1.5"
                            />
                            <circle
                                cx={x(cursor)}
                                cy={BASE}
                                r="3.25"
                                fill="var(--signal)"
                                stroke="var(--paper)"
                                strokeWidth="1.5"
                            />
                        </g>
                    )}
                </svg>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-graphite">
                {[
                    ["var(--warn)", "raw sensor drift"],
                    ["var(--signal)", "reconciled total"],
                ].map(([color, label]) => (
                    <span key={label} className="flex items-center gap-2">
                        <svg width="16" height="8" aria-hidden="true" className="shrink-0">
                            <line x1="0" y1="4" x2="16" y2="4" stroke={color} strokeWidth="1.75" />
                        </svg>
                        {label}
                    </span>
                ))}
            </div>
        </figure>
    );
};

export default TelemetryStrip;
