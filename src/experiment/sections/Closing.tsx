import { closingQuote, profile } from "../../data/content";
import { Band, Reveal } from "../ui";

/**
 * The sign-off, on the obsidian canvas.
 *
 * Set in the display face but well under hero size, and centred — the only
 * centred block on the page. It gets the last dark tone in the stack, so the
 * page closes one step lighter than the void it opened on.
 *
 * The attribution here is UNVERIFIED, carried over from content.ts along with
 * that warning. Worth confirming before this is in front of anyone.
 */
export function Coda() {
    return (
        <Band tone="canvas" tight>
            <Reveal>
                <figure className="coda">
                    <blockquote className="coda__quote">
                        {closingQuote.text}
                    </blockquote>
                    <figcaption className="caption coda__attribution">
                        {closingQuote.attribution}
                    </figcaption>
                </figure>
            </Reveal>
        </Band>
    );
}

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                {/* Deliberately NOT content.ts's `footerLine`: that one says
                    "Built with React, R3F and GSAP", which is true of the real
                    site and false of this page — there is no WebGL here at
                    all. Rather than invent a replacement line, this shows only
                    facts that are already true. */}
                <p className="caption">{profile.name}</p>
                <p className="caption">{profile.location}</p>
            </div>
        </footer>
    );
}
