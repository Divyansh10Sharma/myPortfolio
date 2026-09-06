/**
 * DomPlane — a WebGL rectangle that pretends to be a DOM element.
 *
 * The problem this solves: the browser lays out the page, and WebGL knows
 * nothing about that. To draw a shader exactly where an <img> or an <h1> sits,
 * something has to translate one coordinate system into the other.
 *
 * DOM coordinates:  (0,0) is the TOP-LEFT of the page, y grows DOWNWARD,
 *                   measured in CSS pixels.
 * WebGL coordinates: (0,0) is the CENTRE of the screen, y grows UPWARD.
 *
 * So the translation is: shift the origin from the corner to the middle, and
 * flip the direction of y. That is genuinely all it is, and it is the piece
 * everyone finds fiddly the first time.
 *
 * Subclasses supply the material. This class only handles being in the right
 * place at the right size.
 */

import { Mesh, PlaneGeometry } from "three";

export default class DomPlane {
    /**
     * @param {HTMLElement} element the DOM element to shadow
     * @param {object} opts.segments subdivisions — only matters if the vertex
     *        shader moves the corners around. A flat image needs 1.
     */
    constructor(element, { segments = 1 } = {}) {
        this.element = element;

        // A 1x1 plane, scaled to the element's size later. Building it at unit
        // size means a resize is a scale change rather than a new geometry —
        // and rebuilding geometry every resize is how you leak GPU memory.
        this.geometry = new PlaneGeometry(1, 1, segments, segments);

        this.mesh = null; // subclasses assign this once they have a material
        this.bounds = { width: 0, height: 0, docTop: 0, left: 0 };
    }

    /**
     * Measure the element. Called on load and on resize — never per frame.
     *
     * getBoundingClientRect() forces the browser to recalculate layout. Doing
     * that sixty times a second, in the middle of a render loop, is one of the
     * most reliable ways to make a smooth site stutter. So we measure rarely,
     * store the result, and do cheap arithmetic on it every frame instead.
     *
     * @param {number} scrollY the current scroll position in pixels
     */
    measure(scrollY) {
        const rect = this.element.getBoundingClientRect();

        this.bounds.width = rect.width;
        this.bounds.height = rect.height;
        this.bounds.left = rect.left;

        // Store the position relative to the whole DOCUMENT, not the viewport.
        // The viewport position changes every time you scroll; the document
        // position only changes when the layout changes.
        this.bounds.docTop = rect.top + scrollY;

        if (this.mesh) this.mesh.scale.set(rect.width, rect.height, 1);
    }

    /**
     * Reposition for the current scroll. Called every frame — pure arithmetic,
     * no DOM access.
     *
     * @param {number} scrollY current scroll in pixels
     * @param {number} viewportWidth
     * @param {number} viewportHeight
     */
    update(scrollY, viewportWidth, viewportHeight) {
        if (!this.mesh) return;

        // Where the element's top edge is on screen right now.
        const screenTop = this.bounds.docTop - scrollY;

        // Centre of the element, in DOM coordinates.
        const centreX = this.bounds.left + this.bounds.width / 2;
        const centreY = screenTop + this.bounds.height / 2;

        // The translation. Move the origin to the middle of the screen, then
        // flip y — hence the minus sign, which is the entire difference between
        // the two coordinate systems.
        this.mesh.position.x = centreX - viewportWidth / 2;
        this.mesh.position.y = -centreY + viewportHeight / 2;
    }

    /** Is any part of this plane on screen? Skipping off-screen work is free. */
    isVisible(scrollY, viewportHeight) {
        const screenTop = this.bounds.docTop - scrollY;
        return screenTop < viewportHeight && screenTop + this.bounds.height > 0;
    }

    dispose() {
        this.geometry.dispose();
        if (this.mesh?.material) this.mesh.material.dispose();
    }
}
