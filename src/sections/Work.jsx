import { work } from "../data";
import { Section } from "../components/Spine";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";

const Work = () => (
    <Section index="03" label="WORK" id="work">
        <Heading className="text-2xl text-ink md:text-3xl">Where I've worked</Heading>

        <div className="mt-12">
            {work.map((role) => (
                <Reveal
                    key={role.org}
                    className="grid grid-cols-1 gap-x-6 gap-y-3 border-t border-rule py-8 md:grid-cols-12"
                >
                    <p className="font-mono text-sm text-graphite md:col-span-3">{role.dates}</p>

                    <div className="md:col-span-8 md:col-start-5">
                        <h3 className="text-lg text-ink">
                            {role.role},{" "}
                            <span className="font-mono text-base font-normal">{role.org}</span>
                        </h3>
                        <p className="mt-1 font-mono text-sm text-graphite">{role.location}</p>
                        <p className="mt-4 max-w-measure font-sans text-base text-ink">
                            {role.line}
                        </p>
                    </div>
                </Reveal>
            ))}
            <div className="border-t border-rule" />
        </div>
    </Section>
);

export default Work;
