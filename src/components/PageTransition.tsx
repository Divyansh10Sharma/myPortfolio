import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface PageTransitionProps {
    /** Given the location to render, returns the routes for it. */
    children: (location: ReturnType<typeof useLocation>) => ReactNode;
    onSwap?: () => void;
}

/**
 * Covers the page, swaps its contents, uncovers.
 *
 * THE IDEA: normally clicking a link throws the whole page away and builds a
 * new one — the screen blanks, everything reloads, and any animation that was
 * running dies with it. Instead, a panel slides over the top, the words
 * underneath are quietly replaced while nobody can see them, and the panel
 * slides away again. Nothing is thrown away. The WebGL canvas never even knows
 * a navigation happened.
 *
 * That last part is the whole point of doing this. The canvas lives OUTSIDE the
 * router in App, so it is never unmounted, which means the context, the
 * shaders and the compiled programs all survive. Rebuilding a WebGL context on
 * every navigation is both slow and the classic way to leak GPU memory.
 *
 * The panel is the same motion as the preloader lifting, deliberately — one
 * movement vocabulary for "the page is changing".
 */
export function PageTransition({ children, onSwap }: PageTransitionProps) {
    const location = useLocation();
    const reducedMotion = useReducedMotion();

    // The location currently ON SCREEN, which lags behind the real one while
    // the panel is covering. This split is what makes the swap invisible.
    const [displayed, setDisplayed] = useState(location);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (location.pathname === displayed.pathname) return;

        if (reducedMotion) {
            setDisplayed(location);
            onSwap?.();
            return;
        }

        const panel = panelRef.current;
        if (!panel) {
            setDisplayed(location);
            return;
        }

        const timeline = gsap.timeline();

        timeline
            // In from the bottom.
            .fromTo(
                panel,
                { yPercent: 100 },
                { yPercent: 0, duration: 0.55, ease: "power3.inOut" }
            )
            // Swap while covered. onSwap resets the scroll position — doing it
            // here rather than after means the visitor never sees the jump.
            .add(() => {
                setDisplayed(location);
                onSwap?.();
            })
            // Out through the top, so the panel keeps travelling in one
            // direction rather than retreating the way it came.
            .to(panel, {
                yPercent: -100,
                duration: 0.75,
                ease: "power3.inOut",
                delay: 0.05,
            });

        return () => {
            timeline.kill();
        };
    }, [location, displayed.pathname, reducedMotion, onSwap]);

    return (
        <>
            <div className="transition" ref={panelRef} aria-hidden="true" />
            {children(displayed)}
        </>
    );
}
