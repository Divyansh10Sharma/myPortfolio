import { closingQuote } from "../data/content";
import { Reveal } from "./Reveal";

/**
 * The closing sign-off above the footer.
 *
 * Not a <Section>: it has no number and no label, because it is a coda rather
 * than a part of the argument the rest of the page is making.
 */
export function Coda() {
    return (
        <section className="section coda">
            <figure>
                <Reveal as="blockquote">{closingQuote.text}</Reveal>
                <Reveal as="figcaption" delay={0.08}>
                    {closingQuote.attribution}
                </Reveal>
            </figure>
        </section>
    );
}
