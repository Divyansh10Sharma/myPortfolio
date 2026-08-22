import { overview } from "../data";
import { Section } from "../components/Spine";
import Reveal from "../components/Reveal";

const Overview = () => {
    const { heading, paragraphs, certification } = overview;

    return (
        <Section index="01" label="OVERVIEW" id="overview">
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-12">
                <div className="md:col-span-7">
                    <Reveal as="h2" className="text-2xl text-ink md:text-3xl">
                        {heading}
                    </Reveal>

                    <div className="mt-8 flex flex-col gap-5">
                        {paragraphs.map((p, i) => (
                            <Reveal
                                key={i}
                                as="p"
                                delay={60 * (i + 1)}
                                className="max-w-measure font-sans text-base text-ink"
                            >
                                {p}
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Offset right column — deliberately not aligned to the prose. */}
                <div className="md:col-span-4 md:col-start-9">
                    <Reveal delay={120} className="border-t border-rule pt-5">
                        <p className="label">Certification</p>
                        <p className="mt-3 font-mono text-sm text-ink">{certification.name}</p>
                        <p className="mt-1 font-mono text-sm text-graphite">
                            {certification.detail}
                        </p>
                        <p className="mt-1 font-mono text-xs text-graphite">
                            {certification.date}
                        </p>
                    </Reveal>
                </div>
            </div>
        </Section>
    );
};

export default Overview;
