import { profile } from "../../data/content";
import { Band, Pill, Reveal, SectionHead } from "../ui";

/**
 * Back to the void for the close.
 *
 * The email is set in the display face at 56px, which makes it the second
 * biggest thing on the page after the hero headline. On a portfolio that is
 * the correct hierarchy: the whole document is an argument, and this is the
 * conclusion it has been building toward.
 */
export function Contact() {
    return (
        <Band tone="void" id="contact">
            <SectionHead
                eyebrow="06 · Contact"
                title="Open to backend and AI engineering roles"
            />

            <Reveal>
                <a className="contact__email" href={`mailto:${profile.email}`}>
                    {profile.email}
                </a>

                <p className="body-lg muted contact__meta">
                    <a href={profile.phoneHref} className="nav__text-link">
                        {profile.phone}
                    </a>
                    {" · "}
                    {profile.location}
                </p>

                <div className="contact__links">
                    <Pill href={profile.github} variant="ghost" external arrow>
                        GitHub
                    </Pill>
                    <Pill href={profile.linkedin} variant="ghost" external arrow>
                        LinkedIn
                    </Pill>
                    <Pill href={profile.resume} variant="primary" external arrow>
                        Résumé
                    </Pill>
                </div>
            </Reveal>
        </Band>
    );
}
