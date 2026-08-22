import { profile } from "../data";
import { Section } from "../components/Spine";
import Reveal from "../components/Reveal";
import { Github, Linkedin, Document, ArrowUpRight } from "../components/Icons";

const links = [
    { href: profile.github, label: "GitHub", Icon: Github },
    { href: profile.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: profile.resume, label: "Resume (PDF)", Icon: Document },
];

const Contact = () => (
    <Section index="06" label="CONTACT" id="contact">
        <Reveal as="h2" className="max-w-measure text-2xl text-ink md:text-3xl">
            Open to backend and AI engineering roles
        </Reveal>

        <Reveal delay={60} className="mt-10 border-t border-rule pt-8">
            <a
                href={`mailto:${profile.email}`}
                className="link link-out inline-block max-w-full break-all font-mono text-ink"
                style={{ fontSize: "clamp(0.95rem, 4.6vw, 3rem)", lineHeight: 1.15 }}
            >
                {profile.email}
            </a>

            <p className="mt-6 font-mono text-sm text-graphite">
                <a href={profile.phoneHref} className="link text-graphite hover:text-ink">
                    {profile.phone}
                </a>
                <span className="text-rule"> · </span>
                {profile.location}
            </p>
        </Reveal>

        <Reveal delay={120} className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {links.map(({ href, label, Icon }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="link inline-flex items-center gap-2 font-mono text-sm text-ink"
                >
                    <Icon size={15} className="text-graphite" />
                    {label}
                    <ArrowUpRight size={12} className="text-graphite" />
                </a>
            ))}
        </Reveal>
    </Section>
);

export default Contact;
