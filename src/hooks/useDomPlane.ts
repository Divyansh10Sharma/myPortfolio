import { useCallback, useRef } from "react";
import { useThree } from "@react-three/fiber";
import type { Mesh } from "three";
import { scrollState } from "../state/scroll";

export interface PlaneBounds {
    width: number;
    height: number;
    left: number;
    /** Position relative to the DOCUMENT, not the viewport. */
    docTop: number;
}

/**
 * Makes a WebGL mesh shadow a real DOM element.
 *
 * This was a base class in the vanilla build (`DomPlane.js`). A class with one
 * job, some stored state and two methods is exactly the shape of a custom hook,
 * so in React it becomes one — and it reads better, because there is no
 * inheritance to follow.
 *
 * The coordinate translation is the whole point:
 *
 *   DOM:   (0,0) top-left of the page, y grows DOWNWARD, in CSS pixels.
 *   WebGL: (0,0) centre of the screen, y grows UPWARD.
 *
 * Move the origin to the middle, flip y. Two steps, and that is all it is.
 *
 * This works because our camera is orthographic and R3F sizes it so one world
 * unit is one CSS pixel. A 340px-wide element becomes a 340-unit-wide plane and
 * no scale factor has to be carried around.
 */
export function useDomPlane(element: HTMLElement | null) {
    const meshRef = useRef<Mesh>(null);
    const bounds = useRef<PlaneBounds>({
        width: 0,
        height: 0,
        left: 0,
        docTop: 0,
    });

    // `size` is R3F's viewport size in CSS pixels. It updates on resize, which
    // is what makes the plane follow the layout.
    const size = useThree((state) => state.size);

    /**
     * Read the element's position. Called on mount and on resize — NEVER every
     * frame.
     *
     * getBoundingClientRect() forces the browser to recalculate layout. Doing
     * that sixty times a second inside a render loop is the most common reason
     * a WebGL site stutters while scrolling.
     */
    const measure = useCallback(() => {
        if (!element) return;

        const rect = element.getBoundingClientRect();

        bounds.current.width = rect.width;
        bounds.current.height = rect.height;
        bounds.current.left = rect.left;
        // Document-relative: the viewport position changes on every scroll,
        // the document position only when the layout changes.
        bounds.current.docTop = rect.top + scrollState.pixels;

        if (meshRef.current) {
            meshRef.current.scale.set(rect.width, rect.height, 1);
        }
    }, [element]);

    /** Cheap arithmetic, safe to run every frame. No DOM access. */
    const position = useCallback(() => {
        const { docTop, height, left, width } = bounds.current;

        const screenTop = docTop - scrollState.pixels;
        const centreX = left + width / 2;
        const centreY = screenTop + height / 2;

        if (meshRef.current) {
            meshRef.current.position.x = centreX - size.width / 2;
            // The minus sign is the entire difference between the two systems.
            meshRef.current.position.y = -centreY + size.height / 2;
        }

        // Is any part of it on screen? Work nobody can see is worth skipping.
        return screenTop < size.height && screenTop + height > 0;
    }, [size.width, size.height]);

    return { meshRef, bounds, measure, position };
}
