import { Box, Arrow, Note, Caption, Figure } from "./DiagramParts";

const W = 200;
const H = 54;
const COLS = [24, 248, 472, 696];
const TOP_Y = 64;
const BOT_Y = 264;

const DiagramAgentLoop = () => (
    <Figure
        id="fig-03"
        viewBox="0 0 920 360"
        width="920"
        height="360"
        label="Agent loop diagram, drawn as a circuit. A scheduled run triggers deterministic risk scoring, then agent selection, then a job queue. The queue feeds delivery, which reaches a coach dashboard where a human makes the call. The coach's notes are written to the user profile and into tiered memory, which feeds back into risk scoring — closing the loop."
        caption="fig. 03 — the agent loop. Generation and delivery are decoupled through a queue, and the coach's judgment re-enters the system as memory."
    >
        {/* ── Top row, left to right ─────────────────────── */}
        <Box
            x={COLS[0]}
            y={TOP_Y}
            w={W}
            h={H}
            index="01"
            title="Scheduled run"
            sub="per cohort"
        />
        <Arrow d={`M${COLS[0] + W} ${TOP_Y + H / 2} H${COLS[1] - 4}`} />

        <Box
            x={COLS[1]}
            y={TOP_Y}
            w={W}
            h={H}
            index="02"
            title="Risk scoring"
            sub="deterministic · Python"
            tone="warn"
        />
        <Arrow d={`M${COLS[1] + W} ${TOP_Y + H / 2} H${COLS[2] - 4}`} />

        <Box
            x={COLS[2]}
            y={TOP_Y}
            w={W}
            h={H}
            index="03"
            title="Agent selection"
            sub="5 rule-triggered agents"
        />
        <Note x={COLS[2]} y={TOP_Y + H + 22}>
            5-day streak + high scores
        </Note>
        <Note x={COLS[2]} y={TOP_Y + H + 36}>
            → skipped, no message sent
        </Note>
        <Arrow d={`M${COLS[2] + W} ${TOP_Y + H / 2} H${COLS[3] - 4}`} />

        <Box x={COLS[3]} y={TOP_Y} w={W} h={H} index="04" title="Job queue" sub="producer" />

        {/* ── Right edge: queue hands off to delivery ────── */}
        <Arrow d={`M${COLS[3] + W / 2} ${TOP_Y + H} V${BOT_Y - 4}`} />
        <Note x={COLS[3] + W / 2 + 12} y={168}>
            producer /
        </Note>
        <Note x={COLS[3] + W / 2 + 12} y={182}>
            consumer split
        </Note>

        {/* ── Bottom row, right to left ──────────────────── */}
        <Box
            x={COLS[3]}
            y={BOT_Y}
            w={W}
            h={H}
            index="05"
            title="Delivery"
            sub="existing pipeline"
        />
        <Arrow d={`M${COLS[3]} ${BOT_Y + H / 2} H${COLS[2] + W + 4}`} />

        <Caption x={COLS[2]} y={BOT_Y - 10}>
            HUMAN IN THE LOOP
        </Caption>
        <Box
            x={COLS[2]}
            y={BOT_Y}
            w={W}
            h={H}
            index="06"
            title="Coach dashboard"
            sub="reads risk, makes the call"
            tone="signal"
        />
        <Arrow d={`M${COLS[2]} ${BOT_Y + H / 2} H${COLS[1] + W + 4}`} tone="signal" />

        <Box
            x={COLS[1]}
            y={BOT_Y}
            w={W}
            h={H}
            index="07"
            title="Coach notes"
            sub="written to profile"
        />
        <Arrow d={`M${COLS[1]} ${BOT_Y + H / 2} H${COLS[0] + W + 4}`} />

        <Box
            x={COLS[0]}
            y={BOT_Y}
            w={W}
            h={H}
            index="08"
            title="Memory"
            sub="tiered · sensitivity-gated"
        />

        {/* ── Feedback: memory re-enters scoring ─────────── */}
        <Arrow d={`M${COLS[0] + W / 2} ${BOT_Y} V200 H${COLS[1] + W / 2} V${TOP_Y + H + 4}`} />
        <Note x={COLS[0] + W / 2 + 12} y={194}>
            human judgment re-enters as memory
        </Note>
    </Figure>
);

export default DiagramAgentLoop;
