import { useState } from "react";
import { profile, stats } from "../data";
import TelemetryStrip from "../components/TelemetryStrip";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import { ArrowDown, ArrowUpRight } from "../components/Icons";

const Hero = () => {
    const [counting, setCounting] = useState(false);

    return (
    <section id="top" className="pt-14 md:pt-20">
        <p className="load-in flex items-center gap-2.5 font-mono text-xs uppercase tracking-label text-graphite">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-signal" />
            {profile.availability}
        </p>

        <h1
            className="load-in mt-5 text-[2.5rem] font-bold tracking-tight text-ink md:text-4xl"
            style={{ "--i": 1 }}
        >
            {profile.name}
        </h1>

        <p className="load-in mt-3 font-mono text-lg text-signal" style={{ "--i": 2 }}>
            {profile.role}
        </p>

        <p
            className="load-in mt-6 max-w-short font-sans text-base text-ink"
            style={{ "--i": 3 }}
        >
            {profile.intro}
        </p>

        <div className="load-in mt-8 flex flex-wrap gap-3" style={{ "--i": 4 }}>
            <a
                href="#systems"
                className="inline-flex items-center gap-2 rounded bg-signal px-5 py-3 font-mono text-sm text-paper transition-colors duration-150 hover:bg-ink"
            >
                See the systems I've built
                <ArrowDown size={14} />
            </a>
            <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded border border-ink px-5 py-3 font-mono text-sm text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
            >
                Download resume
                <ArrowUpRight size={14} />
            </a>
        </div>

        <div className="load-in mt-14" style={{ "--i": 5 }}>
            <TelemetryStrip />
        </div>

        <Reveal
            as="dl"
            effect="stagger"
            onReveal={() => setCounting(true)}
            className="load-in mt-14 grid grid-cols-2 border-t border-rule md:grid-cols-4"
            style={{ "--i": 6 }}
        >
            {stats.map((stat, i) => (
                <div
                    key={stat.label}
                    style={{ "--n": i }}
                    className={`border-rule py-6 pr-6 ${i % 2 === 1 ? "border-l pl-6" : ""} ${
                        i >= 2 ? "border-t md:border-t-0" : ""
                    } ${i >= 1 ? "md:border-l md:pl-6" : ""}`}
                >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                        <span className="block font-mono text-xl font-medium text-ink">
                            <CountUp value={stat.value} run={counting} />
                        </span>
                        <span className="mt-1.5 block font-mono text-xs text-graphite">
                            {stat.label}
                        </span>
                    </dd>
                </div>
            ))}
        </Reveal>
    </section>
    );
};

export default Hero;
