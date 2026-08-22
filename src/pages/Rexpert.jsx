import { Link } from "react-router-dom";
import { SpineColumn, Section } from "../components/Spine";
import Reveal from "../components/Reveal";
import DiagramRequestFlow from "../components/DiagramRequestFlow";
import DiagramAgentLoop from "../components/DiagramAgentLoop";
import { ArrowRight } from "../components/Icons";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { profile } from "../data";

// ── Small building blocks, local to this page ───────────────
const P = ({ children, delay = 0 }) => (
    <Reveal as="p" delay={delay} className="mt-5 max-w-measure font-sans text-base text-ink">
        {children}
    </Reveal>
);

const H = ({ children }) => (
    <Reveal as="h2" className="max-w-measure text-2xl text-ink">
        {children}
    </Reveal>
);

/** Parameter table — mono, hairline separated. */
const ParamTable = ({ caption, rows, headers }) => (
    <Reveal as="figure" className="mt-8 max-w-measure">
        <table className="w-full border-collapse text-left">
            <caption className="mb-3 text-left font-mono text-xs uppercase tracking-label text-graphite">
                {caption}
            </caption>
            <thead>
                <tr className="border-y border-rule">
                    {headers.map((h, i) => (
                        <th
                            key={h}
                            scope="col"
                            className={`py-2 font-mono text-xs font-medium uppercase tracking-label text-graphite ${
                                i > 0 ? "text-right" : ""
                            }`}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row[0]} className="border-b border-rule">
                        {row.map((cell, i) => (
                            <td
                                key={i}
                                className={`py-2.5 font-mono text-sm ${
                                    i > 0 ? "text-right text-ink" : "text-graphite"
                                }`}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </Reveal>
);

const meta = [
    ["Role", "Sole engineer — design, build, ship"],
    ["Context", "Train Rex · 2025"],
    ["Stack", "Pinecone · Anthropic Claude · OpenAI · Flask · PostgreSQL · Firestore"],
    ["Scale", "500 users per agent run"],
];

const Rexpert = () => {
    useDocumentMeta(
        "Rexpert — a closed-loop AI coaching system",
        "A case study on keeping an LLM out of the one decision it couldn't be trusted with: Pinecone RAG across four namespaces, five rule-triggered agents, and a deterministic dropout-risk model that never enters the model's context."
    );

    return (
        <main>
            <SpineColumn>
            {/* ── Title ──────────────────────────────────── */}
            <section id="top" className="pt-14 md:pt-20">
                <p className="load-in font-mono text-xs uppercase tracking-label text-graphite">
                    Case study
                </p>

                <h1
                    className="load-in mt-5 max-w-measure text-[2rem] font-bold tracking-tight text-ink md:text-3xl"
                    style={{ "--i": 1 }}
                >
                    Rexpert — a closed-loop AI coaching system
                </h1>

                <p
                    className="load-in mt-6 max-w-measure font-sans text-lg text-graphite"
                    style={{ "--i": 2 }}
                >
                    How I kept an LLM out of the one decision it couldn't be trusted with.
                </p>

                <dl
                    className="load-in mt-12 max-w-measure border-t border-rule"
                    style={{ "--i": 3 }}
                >
                    {meta.map(([term, value]) => (
                        <div
                            key={term}
                            className="flex flex-col gap-1 border-b border-rule py-3 sm:flex-row sm:gap-6"
                        >
                            <dt className="font-mono text-xs uppercase tracking-label text-graphite sm:w-24 sm:shrink-0 sm:pt-0.5">
                                {term}
                            </dt>
                            <dd className="font-mono text-sm text-ink">{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* ── 01 ─────────────────────────────────────── */}
            <Section index="01" label="THE PROBLEM" id="problem">
                <H>The problem</H>
                <P>
                    Users drop out of a 21-day fitness challenge, and the highest-risk window
                    is days 10 to 14 — observed from real behaviour, not assumed. Catching
                    that early enough to intervene means scoring every user every day, and
                    then having a coach say something useful and personal about it.
                </P>
                <P delay={60}>
                    Those are two very different problems. One is arithmetic that has to be
                    right. The other is language that has to sound like a person. The whole
                    design follows from refusing to let one system do both.
                </P>
            </Section>

            {/* ── 02 ─────────────────────────────────────── */}
            <Section index="02" label="RISK SCORE" id="risk">
                <H>Why the risk score is not an LLM job</H>
                <P>
                    Dropout risk is a weighted composite of five signals, computed in Python.
                    It is never shown to the user, and it is never placed in the model's
                    context.
                </P>

                <ParamTable
                    caption="Dropout risk — component weights"
                    headers={["Signal", "Weight"]}
                    rows={[
                        ["Consecutive misses", "0.35"],
                        ["Score trend", "0.25"],
                        ["Completion rate", "0.20"],
                        ["Challenge-day risk", "0.10"],
                        ["Score quality", "0.10"],
                    ]}
                />

                <P>
                    An LLM asked to produce or reason about this number would produce a
                    plausible one. A plausible risk score is worse than no risk score at all
                    — it survives review, it gets acted on, and nothing about its confidence
                    tells you it was invented. Determinism here is the entire point.
                </P>
                <P delay={60}>
                    So the score is computed upstream, used to decide{" "}
                    <em className="not-italic text-signal">whether</em> to intervene, and
                    then discarded before the model is asked{" "}
                    <em className="not-italic text-signal">what</em> to say. The model writes
                    the message. It never learns the number that triggered it.
                </P>

                <Reveal className="mt-12">
                    <DiagramRequestFlow />
                </Reveal>
            </Section>

            {/* ── 03 ─────────────────────────────────────── */}
            <Section index="03" label="RETRIEVAL" id="retrieval">
                <H>Retrieval</H>
                <P>
                    A Pinecone index spans four namespaces — static docs, FAQs, blogs and
                    coaching notes. Queries run cross-namespace with deduplication and
                    re-ranking, so a single question can pull authoritative product copy and
                    a coach's own phrasing in the same result set.
                </P>

                <ParamTable
                    caption="Retrieval configuration"
                    headers={["Parameter", "Value"]}
                    rows={[
                        ["Embedding model", "text-embedding-3-large"],
                        ["Dimensions", "1024 (truncated)"],
                        ["Namespaces", "4"],
                        ["Similarity threshold", "0.35"],
                    ]}
                />

                <P>
                    The detail that matters most is what gets embedded. The query text is
                    enriched with the user's life stage and cohort before it becomes a
                    vector, so retrieval happens against an enriched query rather than the
                    raw message. The same words from a new user and a week-three user
                    retrieve different material, which is the behaviour you actually want.
                </P>
            </Section>

            {/* ── 04 ─────────────────────────────────────── */}
            <Section index="04" label="AGENTS" id="agents">
                <H>The agents</H>
                <P>
                    Five rule-triggered agents — onboarding, daily check-in, dropout risk,
                    progress and cohort — each encoding a real coaching playbook rather than
                    a prompt. The rules are the product; the prompt is just how the rule gets
                    spoken.
                </P>
                <P delay={60}>
                    One rule is worth naming on its own: users on a five-day streak with high
                    scores get skipped. The correct intervention is often none, and a system
                    that cannot decide to stay quiet will train its users to ignore it.
                </P>
                <P delay={120}>
                    Agents do not send messages. They write jobs to a queue that the existing
                    delivery pipeline consumes. That producer/consumer split means a failure
                    in generation never becomes a failure in delivery — the queue is the
                    seam, and either side can be retried without the other.
                </P>
            </Section>

            {/* ── 05 ─────────────────────────────────────── */}
            <Section index="05" label="CONTEXT" id="context">
                <H>Context assembly</H>
                <P>
                    Subscription tier, persona, cultural context, upsell timing, RAG results,
                    tiered memory and live cohort data are fetched in parallel and reconciled
                    into one non-contradictory system prompt per message. Reconciled is the
                    operative word: these sources disagree, and resolving that at assembly
                    time is cheaper and far more predictable than hoping the model resolves
                    it at generation time.
                </P>
                <P delay={60}>
                    The same code path serves both the free and paid experience off a single
                    tier flag. There is no second prompt to keep in sync, which is the kind
                    of decision that costs nothing on day one and saves a great deal by
                    month six.
                </P>
            </Section>

            {/* ── 06 ─────────────────────────────────────── */}
            <Section index="06" label="MEMORY" id="memory">
                <H>Memory, and what the model is allowed to say</H>
                <P>
                    Extracted memory carries a three-tier sensitivity policy, and the tier
                    decides how the model may use a fact — not whether it stores it.
                </P>

                <ParamTable
                    caption="Memory sensitivity tiers"
                    headers={["Tier", "Model behaviour"]}
                    rows={[
                        ["Open", "May be quoted back to the user"],
                        ["Gentle", "Referenced only when topically relevant"],
                        ["Silent", "Shapes tone; never quoted"],
                    ]}
                />

                <P>
                    Silent fields — family context, for instance — are allowed to shape tone
                    but the model is explicitly instructed never to quote them. A coach who
                    knows you have a newborn writes differently without announcing that they
                    know. This is a privacy design decision expressed as prompt architecture,
                    and it is enforced where the context is assembled rather than left to the
                    model's discretion.
                </P>
            </Section>

            {/* ── 07 ─────────────────────────────────────── */}
            <Section index="07" label="THE LOOP" id="loop">
                <H>Closing the loop</H>
                <P>
                    Coaches read risk scores and recommended actions in a dashboard, make the
                    call, and post their notes back to the user's profile. Those notes feed
                    the model's memory for that specific person.
                </P>
                <P delay={60}>
                    Model informs human, human judgment feeds back into the model. The system
                    is not trying to replace the coach — it is trying to make sure the coach
                    is looking at the right twelve people out of five hundred, and that what
                    they learn there does not evaporate.
                </P>

                <Reveal className="mt-12">
                    <DiagramAgentLoop />
                </Reveal>
            </Section>

            {/* ── 08 ─────────────────────────────────────── */}
            <Section index="08" label="RETROSPECT" id="retrospect">
                <H>What I'd do differently</H>
                <P>
                    There is no automated test suite. As the engineer who built this under
                    time pressure, idempotency and deterministic fallbacks were the safety
                    net instead — every write path can run twice without damage, and every
                    model call has a non-model path behind it.
                </P>
                <P delay={60}>
                    That is a defensible trade for one engineer shipping against a deadline,
                    and it is not a defensible steady state. With a second engineer on it,
                    tests come first — starting with the risk scorer, because it is the piece
                    whose silent failure would be hardest to notice.
                </P>

                <Reveal delay={120} className="mt-12 border-t border-rule pt-8">
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 rounded bg-signal px-5 py-3 font-mono text-sm text-paper transition-colors duration-150 hover:bg-ink"
                        >
                            Back to index
                            <ArrowRight size={14} />
                        </Link>
                        <a
                            href={`mailto:${profile.email}`}
                            className="link font-mono text-sm text-ink"
                        >
                            {profile.email}
                        </a>
                    </div>
                </Reveal>
            </Section>
            </SpineColumn>
        </main>
    );
};

export default Rexpert;
