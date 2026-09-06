import type { Ref } from "react";
import { Hero } from "../components/Hero";
import { Overview } from "../components/Overview";
import { Systems } from "../components/Systems";
import { Work } from "../components/Work";
import { Projects } from "../components/Projects";
import { Testimonials } from "../components/Testimonials";
import { Contact } from "../components/Contact";
import { Coda } from "../components/Coda";

interface HomeProps {
    ready: boolean;
    /**
     * Callback refs owned by App, because the WebGL planes that shadow these
     * two elements live outside the router and outlive this page.
     *
     * React calls a callback ref with null on unmount, so navigating away
     * automatically tells the canvas those elements are gone and the planes
     * dispose themselves. That is the routing behaviour and the cleanup
     * behaviour being the same thing, for free.
     */
    headlineRef: Ref<HTMLHeadingElement>;
    portraitRef: Ref<HTMLImageElement>;
}

export function Home({ ready, headlineRef, portraitRef }: HomeProps) {
    return (
        <main id="top">
            <Hero ref={headlineRef} ready={ready} />
            <Overview ref={portraitRef} />
            <Systems />
            <Work />
            <Projects />
            <Testimonials />
            <Contact />
            <Coda />
        </main>
    );
}
