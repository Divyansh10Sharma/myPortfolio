import { useEffect, useState } from "react";
import { profile } from "../data";
import { Section } from "../components/Spine";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import { Github, Linkedin, Document, ArrowUpRight } from "../components/Icons";

const links = [
    { href: profile.github, label: "GitHub", Icon: Github },
    { href: profile.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: profile.resume, label: "Resume (PDF)", Icon: Document },
];

/** Live local time — tells a remote recruiter the overlap at a glance. */
const LocalTime = () => {
    const format = () =>
        new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
        }).format(new Date());

    const [now, setNow] = useState(format);

    useEffect(() => {
        const id = setInterval(() => setNow(format()), 20000);
        return () => clearInterval(id);
    }, []);

    return (
        <span className="tabular-nums">
            {now} local
        </span>
    );
};

const Contact = () => {
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard blocked (insecure context, permissions) — the mailto
            // link beside it still works, so fail quietly.
        }
    };

    return (
    <Section index="06" label="CONTACT" id="contact">
        <Heading className="max-w-measure text-2xl text-ink md:text-3xl">
            Open to backend and AI engineering roles
        </Heading>

        <Reveal delay={60} className="mt-10 border-t border-rule pt-8">
            <a
                href={`mailto:${profile.email}`}
                className="link link-out inline-block max-w-full break-all font-mono text-ink"
                style={{ fontSize: "clamp(0.95rem, 4.6vw, 3rem)", lineHeight: 1.15 }}
            >
                {profile.email}
            </a>

            <div className="mt-4">
                <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex items-center gap-2 rounded border border-rule px-3 py-1.5 font-mono text-xs text-graphite transition-colors duration-150 hover:border-ink hover:text-ink"
                >
                    <span
                        aria-hidden="true"
                        className={`inline-block h-1.5 w-1.5 transition-colors duration-200 ${
                            copied ? "bg-signal" : "bg-rule"
                        }`}
                    />
                    {copied ? "copied to clipboard" : "copy email"}
                </button>
                <span aria-live="polite" className="sr-only">
                    {copied ? "Email address copied to clipboard" : ""}
                </span>
            </div>

            <p className="mt-6 font-mono text-sm text-graphite">
                <a href={profile.phoneHref} className="link text-graphite hover:text-ink">
                    {profile.phone}
                </a>
                <span className="text-rule"> · </span>
                {profile.location}
                <span className="text-rule"> · </span>
                <LocalTime />
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
};

export default Contact;
