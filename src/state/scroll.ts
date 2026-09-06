/**
 * Scroll state, deliberately NOT React state.
 *
 * This is the single most important idea in the whole port, so it is worth
 * being explicit about.
 *
 * The obvious React instinct is `const [scroll, setScroll] = useState(0)`. Do
 * that here and you have built a machine for destroying your own frame rate:
 * scrolling fires continuously, so every frame calls `setScroll`, which
 * re-renders the component, which re-renders its children, sixty times a
 * second. React's rendering model is designed around the idea that renders are
 * occasional. A render loop is the exact opposite.
 *
 * So the rule, and it is the rule for anything animated in React:
 *
 *   State is for values that should cause a re-render when they change.
 *   Refs are for values that change every frame and are read inside the loop.
 *
 * Scroll position changes every frame and is read inside `useFrame`. It is a
 * ref, not state. Nothing here ever triggers a render — the shader reads these
 * numbers directly and paints the new picture itself.
 *
 * This module is a plain mutable object rather than a hook because Lenis lives
 * outside the React tree while the shaders live inside it, and both need the
 * same numbers. It is the smallest possible shared store: no library, no
 * provider, no context.
 */

export interface ScrollState {
    /** 0 at the top of the page, 1 at the bottom. */
    progress: number;
    /** Absolute scroll position in pixels — what the planes need. */
    pixels: number;
    /** Raw scroll speed from Lenis, in pixels per frame. Unbounded. */
    velocity: number;
}

export const scrollState: ScrollState = {
    progress: 0,
    pixels: 0,
    velocity: 0,
};

export function setScrollState(next: Partial<ScrollState>): void {
    Object.assign(scrollState, next);
}
