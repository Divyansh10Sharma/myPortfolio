import { Link } from "react-router-dom";
import { systems } from "../data";
import { Section } from "../components/Spine";
import Reveal from "../components/Reveal";
import { ArrowRight } from "../components/Icons";

const StackLine = ({ stack }) => (
    <p className="mt-5 font-mono text-xs leading-relaxed">
        <span className="uppercase tracking-label text-graphite">Stack&nbsp;&nbsp;</span>
        {stack.map((item, i) => (
            <span key={item}>
                {i > 0 && <span className="text-rule"> · </span>}
                <span className="text-ink">{item}</span>
            </span>
        ))}
    </p>
);

const SystemBlock = ({ system, isFirst }) => (
    <Reveal
        as="article"
        className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-rule py-10 md:grid-cols-12 md:py-12"
    >
        <div className="md:col-span-3">
            <p
                className={`font-mono text-xs tracking-label ${
                    isFirst ? "text-signal" : "text-graphite"
                }`}
            >
                {system.index}
            </p>
            <h3 className="mt-2 text-xl text-ink">{system.name}</h3>
            {system.subtitle && (
                <p className="mt-1 font-mono text-sm text-graphite">{system.subtitle}</p>
            )}
        </div>

        {/* Measure alternates down the page — the asymmetry is structural. */}
        <div
            className={
                system.span === "wide"
                    ? "md:col-span-8 md:col-start-5"
                    : "md:col-span-6 md:col-start-5"
            }
        >
            <p className="font-sans text-base text-ink">{system.body}</p>

            <StackLine stack={system.stack} />

            {system.href && (
                <Link
                    to={system.href}
                    className="link mt-5 inline-flex items-center gap-2 font-mono text-sm text-signal"
                >
                    {system.hrefLabel}
                    <ArrowRight size={13} />
                </Link>
            )}

            {system.figure === "telemetry" && (
                <a
                    href="#fig-01"
                    className="link mt-5 inline-block font-mono text-xs text-graphite hover:text-ink"
                >
                    ↑ plotted in fig. 01
                </a>
            )}
        </div>
    </Reveal>
);

const Systems = () => (
    <Section index="02" label="SYSTEMS" id="systems">
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
            <div className="md:col-span-8">
                <Reveal as="h2" className="text-2xl text-ink md:text-3xl">
                    Systems I own
                </Reveal>
                <Reveal
                    as="p"
                    delay={60}
                    className="mt-5 max-w-measure font-sans text-base text-graphite"
                >
                    Six production systems at Train Rex, each shipped end-to-end. The
                    common thread is keeping the deterministic parts deterministic.
                </Reveal>
            </div>
        </div>

        <div className="mt-12">
            {systems.map((system, i) => (
                <SystemBlock key={system.id} system={system} isFirst={i === 0} />
            ))}
            <div className="border-t border-rule" />
        </div>
    </Section>
);

export default Systems;
