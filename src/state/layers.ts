import type { WebGLRenderer } from "three";

/**
 * A slot for something that must be drawn BEFORE the main scene.
 *
 * Why this exists: the canvas camera is orthographic, and it has to stay that
 * way — `useDomPlane` relies on one world unit being one CSS pixel to line the
 * photograph and headline up with their DOM elements. Swapping it for a
 * perspective camera would break that mapping completely.
 *
 * So the depth field brings its own scene and its own perspective camera, and
 * registers a function here saying "draw me first". PostProcessing already owns
 * the render loop, so it is the natural place to call it.
 *
 * A plain mutable object rather than context or state: this is read once per
 * frame inside the loop, and re-rendering React to hand over a function would
 * be exactly the mistake documented in state/scroll.ts.
 */
export const backgroundLayer: {
    render: ((gl: WebGLRenderer) => void) | null;
} = {
    render: null,
};
