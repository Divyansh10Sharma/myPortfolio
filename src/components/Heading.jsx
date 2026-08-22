import Reveal from "./Reveal";

/**
 * A section heading that is unmasked by a clip rather than faded in — the
 * line rises out from behind its own baseline, the way type gets set.
 * The inner span is the clipped block; the outer tag keeps the semantics.
 */
const Heading = ({ as = "h2", className = "", delay = 0, children }) => (
    <Reveal as={as} effect="lines" delay={delay} className={className}>
        <span>{children}</span>
    </Reveal>
);

export default Heading;
