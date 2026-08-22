import { Box, Arrow, Note, Caption, Figure } from "./DiagramParts";

// ── Geometry ────────────────────────────────────────────────
const COL_X = 270;
const COL_W = 290;
const CX = COL_X + COL_W / 2;

const IN_X = 24;
const IN_W = 210;
const IN_H = 28;
const inputs = [
    "subscription tier",
    "persona",
    "cultural context",
    "upsell timing",
    "tiered memory",
    "live cohort data",
];
const inputY = (i) => 238 + i * 34;

// Everything to the right of this line is invisible to the model.
const BOUNDARY_X = 600;

const RIGHT_X = 636;
const RIGHT_W = 260;

const weights = [
    "0.35  consecutive misses",
    "0.25  score trend",
    "0.20  completion rate",
    "0.10  challenge-day risk",
    "0.10  score quality",
];

const DiagramRequestFlow = () => (
    <Figure
        id="fig-02"
        viewBox="0 0 920 620"
        width="920"
        height="620"
        label="Request flow diagram. A user message passes through query enrichment, Pinecone retrieval and context assembly into Claude, which returns a streamed response. Six inputs — subscription tier, persona, cultural context, upsell timing, tiered memory and live cohort data — are fetched in parallel and converge on context assembly. To the right of a dashed boundary line, the deterministic dropout risk scorer feeds an agent trigger. No arrow connects the risk scorer to the model."
        caption="fig. 02 — request flow. The risk scorer sits outside the model context boundary. There is deliberately no arrow from it into Claude."
    >
        {/* ── Trust boundary ─────────────────────────────── */}
        <line
            x1={BOUNDARY_X}
            y1="16"
            x2={BOUNDARY_X}
            y2="570"
            stroke="var(--warn)"
            strokeWidth="1"
            strokeDasharray="5 5"
        />
        <Caption x={592} y={300} anchor="middle" transform={`rotate(-90 592 300)`}>
            MODEL CONTEXT BOUNDARY
        </Caption>

        {/* ── Main pipeline ──────────────────────────────── */}
        <Box x={COL_X} y={28} w={COL_W} h={40} index="01" title="User message" />
        <Arrow d={`M${CX} 68 V98`} />

        <Box
            x={COL_X}
            y={100}
            w={COL_W}
            h={54}
            index="02"
            title="Query enrichment"
            sub="+ life stage, cohort"
        />
        <Arrow d={`M${CX} 154 V184`} />

        <Box
            x={COL_X}
            y={186}
            w={COL_W}
            h={54}
            index="03"
            title="Pinecone retrieval"
            sub="4 namespaces · sim ≥ 0.35"
        />
        <Arrow d={`M${CX} 240 V294`} />
        <Note x={CX + 10} y={272}>
            RAG results
        </Note>

        <Box
            x={COL_X}
            y={296}
            w={COL_W}
            h={58}
            index="04"
            title="Context assembly"
            sub="one non-contradictory prompt"
        />
        <Arrow d={`M${CX} 354 V420`} />

        <Box x={COL_X} y={422} w={COL_W} h={46} index="05" title="Claude" tone="signal" />
        <Arrow d={`M${CX} 468 V504`} tone="signal" />

        <Box x={COL_X} y={506} w={COL_W} h={40} index="06" title="Streamed response" />

        {/* ── Six parallel inputs converging ─────────────── */}
        <Caption x={IN_X} y={226}>
            FETCHED IN PARALLEL
        </Caption>
        {inputs.map((label, i) => {
            const cy = inputY(i) + IN_H / 2;
            return (
                <g key={label}>
                    <Box x={IN_X} y={inputY(i)} w={IN_W} h={IN_H} title={label} />
                    <Arrow d={`M${IN_X + IN_W} ${cy} H252 L${COL_X - 4} 325`} />
                </g>
            );
        })}

        {/* ── Risk scorer, outside the boundary ──────────── */}
        <Caption x={RIGHT_X} y={238}>
            WEIGHTED COMPOSITE
        </Caption>
        {weights.map((w, i) => (
            <Note key={w} x={RIGHT_X} y={256 + i * 14}>
                {w}
            </Note>
        ))}

        <Box
            x={RIGHT_X}
            y={356}
            w={RIGHT_W}
            h={58}
            title="Dropout risk scorer"
            sub="deterministic · Python"
            tone="warn"
        />
        <Arrow d={`M${RIGHT_X + RIGHT_W / 2} 414 V458`} tone="warn" />

        <Box x={RIGHT_X} y={460} w={RIGHT_W} h={46} title="Agent trigger" />
        <Note x={RIGHT_X} y={528}>
            → dispatched in fig. 03
        </Note>

        {/* The argument, stated where the arrow isn't. */}
        <Note x={BOUNDARY_X} y={596} anchor="middle" tone="warn" size={10}>
            the risk score never crosses this line — the model cannot see it
        </Note>
    </Figure>
);

export default DiagramRequestFlow;
