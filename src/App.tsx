import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Scene } from "./webgl-r3f/Scene";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { Cursor } from "./components/Cursor";
import { Grain } from "./components/Grain";
import { PageTransition } from "./components/PageTransition";
import { Home } from "./pages/Home";
import { SystemPage } from "./pages/SystemPage";

import { useReducedMotion } from "./hooks/useReducedMotion";
import { useQuality } from "./hooks/useQuality";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useMagnetic } from "./hooks/useMagnetic";

/**
 * The parent. Owns everything that must survive a navigation.
 *
 * The ordering here is the whole architecture and it is worth reading in one
 * go: the canvas, the cursor and the grain sit OUTSIDE `<BrowserRouter>`, so
 * routing cannot unmount them. That is what lets the WebGL context, its
 * shaders and its compiled programs live across page changes. Put the canvas
 * inside the router and every navigation destroys and rebuilds a WebGL
 * context, which is slow and is the classic way to leak GPU memory.
 */
export default function App() {
    const reducedMotion = useReducedMotion();
    const quality = useQuality();

    const lenisRef = useSmoothScroll(!reducedMotion);

    useMagnetic(".email, .nav__resume");

    // The real DOM elements the WebGL planes shadow. State, not refs, because
    // the Scene must re-render when they appear or disappear — and they now
    // disappear for real, whenever the visitor navigates to a detail page.
    const [headline, setHeadline] = useState<HTMLElement | null>(null);
    const [portrait, setPortrait] = useState<HTMLImageElement | null>(null);

    const [loading, setLoading] = useState(!reducedMotion);
    const [ready, setReady] = useState(reducedMotion);

    const onLoaderReveal = useCallback(() => setReady(true), []);
    const onLoaderDone = useCallback(() => {
        setLoading(false);
        setReady(true); // belt and braces if the lift never fired onStart
    }, []);

    /**
     * Called while the transition panel is covering the screen.
     *
     * Scroll has to be reset here rather than after, or the visitor watches the
     * new page jump to the top. Lenis owns the scroll position, so it has to be
     * Lenis that moves it — setting window.scrollY directly would desync them.
     */
    const onRouteSwap = useCallback(() => {
        lenisRef.current?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0); // reduced motion, where there is no Lenis
    }, [lenisRef]);

    /* ── in-page links ─────────────────────────────────────────
       Only hash links are intercepted. Router links must be left alone or
       navigation never happens. */
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href || href.length < 2) return;

            const target = document.querySelector(href);
            const lenis = lenisRef.current;
            if (!target || !lenis) return;

            event.preventDefault();
            lenis.scrollTo(target as HTMLElement, { offset: -60 });
        };

        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, [lenisRef]);

    // The browser restores scroll before Lenis exists, which leaves the two
    // disagreeing about where the page is.
    useEffect(() => {
        if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    }, []);

    return (
        <>
            {loading && <Preloader onReveal={onLoaderReveal} onDone={onLoaderDone} />}

            {/* Outside the router on purpose — see the note above. */}
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

            <BrowserRouter>
                <Nav />

                <PageTransition onSwap={onRouteSwap}>
                    {(location) => (
                        <Routes location={location}>
                            <Route
                                path="/"
                                element={
                                    <Home
                                        ready={ready}
                                        headlineRef={setHeadline}
                                        portraitRef={setPortrait}
                                    />
                                }
                            />
                            <Route path="/systems/:slug" element={<SystemPage />} />
                            {/* Anything unrecognised falls back to the index
                                rather than a blank screen. */}
                            <Route path="*" element={<SystemPage />} />
                        </Routes>
                    )}
                </PageTransition>

                <Footer />
            </BrowserRouter>
        </>
    );
}
