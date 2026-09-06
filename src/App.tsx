import { useCallback, useEffect, useState } from "react";
import { Scene } from "./webgl-r3f/Scene";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Overview } from "./components/Overview";
import { Systems } from "./components/Systems";
import { Work } from "./components/Work";
import { Projects } from "./components/Projects";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Coda } from "./components/Coda";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { Cursor } from "./components/Cursor";
import { Grain } from "./components/Grain";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useQuality } from "./hooks/useQuality";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useMagnetic } from "./hooks/useMagnetic";

/**
 * The parent. Owns the shared concerns and hands them down.
 *
 * This is the file that answers "where does everything get wired together",
 * which in the vanilla build was main.js. The difference worth noticing: there
 * is no querySelector anywhere. The two DOM elements the shaders need are
 * captured by ref from the components that render them, so it is impossible for
 * the shader to attach to the wrong element or to run before it exists.
 */
export default function App() {
    const reducedMotion = useReducedMotion();
    const quality = useQuality();

    // Lenis. Disabled entirely under reduced motion.
    const lenisRef = useSmoothScroll(!reducedMotion);

    // Large targets only. The email address is the biggest type on the page
    // after the headline, and the nav resume link sits alone in the corner —
    // both are far too big for a few pixels of travel to affect aim. Body
    // links and nav items are deliberately excluded.
    useMagnetic(".email, .nav__resume");

    // The real DOM elements the WebGL planes shadow. State rather than refs,
    // because the Scene must RE-RENDER once they exist — a ref changing does
    // not tell React anything. This is the one place in the whole port where
    // the ref-versus-state rule points the other way.
    const [headline, setHeadline] = useState<HTMLElement | null>(null);
    const [portrait, setPortrait] = useState<HTMLImageElement | null>(null);

    const [loading, setLoading] = useState(!reducedMotion);

    // Two flags, not one, because the handoff has two moments.
    //
    //   ready   — the panel has started lifting; everything underneath begins
    //             to move, while the panel is still travelling
    //   loading — the panel has finished and can be unmounted
    //
    // Under reduced motion there is no panel and no handoff, so the page is
    // ready immediately.
    const [ready, setReady] = useState(reducedMotion);

    const onLoaderReveal = useCallback(() => setReady(true), []);
    const onLoaderDone = useCallback(() => {
        setLoading(false);
        // Belt and braces: if the lift somehow never fired its onStart, the
        // hero must still be released rather than sitting invisible forever.
        setReady(true);
    }, []);

    /* ── in-page links ─────────────────────────────────────────
       Anchor clicks must go through Lenis, otherwise the browser jumps
       instantly and Lenis's idea of the scroll position desyncs from the real
       one — after which the next wheel movement teleports the page. */
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href || href.length < 2) return;

            const target = document.querySelector(href);
            const lenis = lenisRef.current;
            if (!target || !lenis) return; // reduced motion: let the browser do it

            event.preventDefault();
            lenis.scrollTo(target as HTMLElement, { offset: -60 }); // clear the nav
        };

        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, [lenisRef]);

    /* ── landing part-way down the page ────────────────────────
       Someone opens a link ending in #systems, or reloads after scrolling. The
       browser restores the old position before Lenis exists, so we take
       restoration over and do it ourselves once everything is running. */
    useEffect(() => {
        if ("scrollRestoration" in history) history.scrollRestoration = "manual";

        const hash = location.hash;
        if (hash.length < 2) return;

        const target = document.querySelector(hash);
        if (!target) return;

        // After paint, so the layout is settled and the measurement is real.
        const id = window.setTimeout(() => {
            const lenis = lenisRef.current;
            if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -60, immediate: true });
            else target.scrollIntoView();
        }, 100);

        return () => window.clearTimeout(id);
    }, [lenisRef]);

    return (
        <>
            {loading && <Preloader onReveal={onLoaderReveal} onDone={onLoaderDone} />}

            <Scene
                quality={quality}
                reducedMotion={reducedMotion}
                headline={headline}
                portrait={portrait}
                portraitSrc="/divyansh.webp"
                ready={ready}
            />

            <Cursor />
            <Grain />

            <a className="skip" href="#overview">
                Skip to content
            </a>

            <Nav />

            <main id="top">
                <Hero ref={setHeadline} ready={ready} />
                <Overview ref={setPortrait} />
                <Systems />
                <Work />
                <Projects />
                <Testimonials />
                <Contact />
                <Coda />
            </main>

            <Footer />
        </>
    );
}
