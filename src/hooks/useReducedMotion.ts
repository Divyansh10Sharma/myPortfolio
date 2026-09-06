import { useEffect, useState } from "react";

/**
 * Does this visitor want less motion?
 *
 * This one IS state, not a ref: it changes rarely (only if the visitor changes
 * their OS setting), and when it changes we genuinely do want everything to
 * re-render and behave differently. That is exactly what state is for.
 */
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);

        query.addEventListener("change", onChange);
        // The cleanup function. This is the React equivalent of the vanilla
        // build's dispose() — the same job, a different shape.
        return () => query.removeEventListener("change", onChange);
    }, []);

    return reduced;
}
