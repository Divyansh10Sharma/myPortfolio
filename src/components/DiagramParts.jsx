// Shared primitives for the hand-built diagrams. Same construction language
// as the telemetry strip: hairlines, mono labels, square corners.

const MONO = "'IBM Plex Mono', monospace";

const TONES = {
    ink: { stroke: "var(--ink)", text: "var(--ink)", marker: "arrow-ink" },
    rule: { stroke: "var(--rule)", text: "var(--ink)", marker: "arrow-graphite" },
    warn: { stroke: "var(--warn)", text: "var(--warn-ink)", marker: "arrow-warn" },
    signal: { stroke: "var(--signal)", text: "var(--signal)", marker: "arrow-signal" },
};

/** Arrowhead markers — one per colour, since markers don't inherit stroke. */
export const DiagramDefs = () => (
    <defs>
        {[
            ["arrow-ink", "var(--ink)"],
            ["arrow-graphite", "var(--graphite)"],
            ["arrow-warn", "var(--warn)"],
            ["arrow-signal", "var(--signal)"],
        ].map(([id, fill]) => (
            <marker
                key={id}
                id={id}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
            >
                <path d="M0 1.5 L9 5 L0 8.5 z" fill={fill} />
            </marker>
        ))}
    </defs>
);

export const Box = ({ x, y, w, h, index, title, sub, tone = "rule" }) => {
    const t = TONES[tone];
    const cx = x + w / 2;
    // Vertically centre the label block: title alone, or title + sub.
    const titleY = sub ? y + h / 2 - 2 : y + h / 2 + 4;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="2"
                fill="var(--paper)"
                stroke={t.stroke}
                strokeWidth={tone === "rule" ? 1 : 1.5}
            />
            {index && (
                <text
                    x={x + 8}
                    y={y + 13}
                    fontFamily={MONO}
                    fontSize="8"
                    fill="var(--graphite)"
                    letterSpacing="0.08em"
                >
                    {index}
                </text>
            )}
            <text
                x={cx}
                y={titleY}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize="12"
                fontWeight="500"
                fill={t.text}
            >
                {title}
            </text>
            {sub && (
                <text
                    x={cx}
                    y={y + h / 2 + 14}
                    textAnchor="middle"
                    fontFamily={MONO}
                    fontSize="9.5"
                    fill="var(--graphite)"
                >
                    {sub}
                </text>
            )}
        </g>
    );
};

export const Arrow = ({ d, tone = "rule", dashed = false }) => {
    const t = TONES[tone];
    return (
        <path
            d={d}
            fill="none"
            stroke={tone === "rule" ? "var(--graphite)" : t.stroke}
            strokeWidth="1"
            strokeDasharray={dashed ? "4 4" : undefined}
            markerEnd={`url(#${t.marker})`}
        />
    );
};

export const Note = ({ x, y, children, tone = "graphite", anchor = "start", size = 9.5 }) => (
    <text
        x={x}
        y={y}
        textAnchor={anchor}
        fontFamily={MONO}
        fontSize={size}
        fill={tone === "warn" ? "var(--warn-ink)" : `var(--${tone})`}
    >
        {children}
    </text>
);

/** Small caps annotation, e.g. axis and boundary labels. */
export const Caption = ({ x, y, children, anchor = "start", transform }) => (
    <text
        x={x}
        y={y}
        textAnchor={anchor}
        transform={transform}
        fontFamily={MONO}
        fontSize="8.5"
        fill="var(--graphite)"
        letterSpacing="0.12em"
    >
        {children}
    </text>
);

/** Wraps a diagram: scrolls rather than squashing, carries the caption. */
export const Figure = ({ id, caption, label, viewBox, width, height, children }) => (
    <figure id={id} className="w-full scroll-mt-24">
        <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
            <svg
                viewBox={viewBox}
                width={width}
                height={height}
                className="h-auto w-full min-w-[760px] max-w-none"
                role="img"
                aria-label={label}
            >
                <DiagramDefs />
                {children}
            </svg>
        </div>
        <figcaption className="mt-4 border-t border-rule pt-3 font-mono text-xs text-graphite">
            {caption}
        </figcaption>
    </figure>
);
