import { profile } from "../data/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Contact() {
    return (
        <Section id="contact" index="06" label="Contact">
            <Reveal as="h2">Open to backend and AI engineering roles</Reveal>

            <Reveal delay={0.05}>
                <a className="email" href={`mailto:${profile.email}`}>
                    {profile.email}
                </a>
            </Reveal>

            <Reveal as="p" className="contact__meta" delay={0.1}>
                <a href={profile.phoneHref}>{profile.phone}</a>
                <span className="sep">·</span>
                {profile.location}
            </Reveal>

            <Reveal as="p" className="contact__links" delay={0.15}>
                <a href={profile.github} target="_blank" rel="noreferrer">
                    GitHub ↗
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn ↗
                </a>
                <a href={profile.resume} target="_blank" rel="noreferrer">
                    Resume (PDF) ↗
                </a>
            </Reveal>
        </Section>
    );
}
