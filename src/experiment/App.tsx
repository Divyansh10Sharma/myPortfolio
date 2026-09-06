import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { Stats } from "./sections/Stats";
import { Systems } from "./sections/Systems";
import { About } from "./sections/About";
import { Work } from "./sections/Work";
import { Projects } from "./sections/Projects";
import { Testimonials } from "./sections/Testimonials";
import { Contact } from "./sections/Contact";
import { Coda, Footer } from "./sections/Closing";

/**
 * The Huly experiment.
 *
 * Same content as the real site, a completely different visual system. It runs
 * from its own HTML entry point (`experiment.html`) and shares nothing with the
 * live build except `src/data/content.ts` — no WebGL, no GSAP, no Lenis, no
 * router. That isolation is the point: it can be judged, kept or deleted
 * without touching anything that ships.
 *
 * THE BAND ORDER IS THE DESIGN. DESIGN.md calls the dark/light alternation the
 * page's structural rhythm, so the sequence below is a deliberate arc rather
 * than the order the sections happened to be written in:
 *
 *   void      hero, the aurora, the one piece of spectacle
 *   canvas    stats — one step out of the dark
 *   void      systems — the heaviest section, back in the dark
 *   light     about — the flip; lights up, and there is a person here
 *   linen     work
 *   light     projects — dark cards on white, the system's signature move
 *   linen     testimonials
 *   void      contact — back to the dark to close
 *   canvas    the quote
 *
 * Read as a whole it is dark spectacle, a lit editorial middle, then dark
 * again for the ask.
 */
export default function App() {
    return (
        <>
            <a className="skip" href="#overview">
                Skip to content
            </a>

            <Nav />

            <main>
                <Hero />
                <Stats />
                <Systems />
                <About />
                <Work />
                <Projects />
                <Testimonials />
                <Contact />
                <Coda />
            </main>

            <Footer />

            {/* Nothing to do with the design system. It is here so this page
                can never be mistaken for the real site by someone who lands on
                it from a stale link — including me. */}
            <a className="experiment-flag" href="/">
                <strong>Experiment</strong> · Huly design system · back to the real
                site
            </a>
        </>
    );
}
