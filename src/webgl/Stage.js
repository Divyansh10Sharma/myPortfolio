/**
 * Stage — the four objects every WebGL page needs, plus the loop that drives them.
 *
 *   scene    the room: a list of things that are allowed to be drawn
 *   camera   where we are standing and which way we are facing
 *   renderer the thing that looks at the scene from the camera and writes pixels
 *   mesh     one object in the room: a shape (geometry) wearing a surface (material)
 *
 * The cube here is scaffolding and gets deleted at Phase 2. Everything around it
 * — the resize handling, the reduced-motion branch, the pixel-ratio clamp and the
 * disposal — is permanent.
 */

import * as THREE from "three";

// A phone with a 3x screen would otherwise ask us to draw nine times as many
// pixels as a 1x screen covering the same physical area, which is the fastest
// known way to kill framerate on the mid-range Android devices we are targeting.
// Past 2x the visual difference is very hard to see, so we cap it.
const MAX_PIXEL_RATIO = 2;

export default class Stage {
    constructor(canvas) {
        this.canvas = canvas;

        // A clock, not a frame counter. Frames arrive at different speeds on
        // different machines, so anything that moves is driven by seconds
        // elapsed, never by "how many times has this function run".
        this.clock = new THREE.Clock();

        // Held so we can cancel the loop in dispose(). A loop still running
        // after its canvas is gone is a leak that is very hard to spot later.
        this.frameId = null;

        // If the visitor has asked their operating system for less motion, we
        // honour it: draw one frame and never start the loop. Checked here and
        // on every phase from now on.
        this.prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.#buildRenderer();
        this.#buildScene();
        this.#buildCube();

        // Bound once and stored, because removeEventListener needs the exact
        // same function reference addEventListener was given. Calling
        // this.#onResize.bind(this) twice makes two different functions, and
        // the listener then never actually comes off.
        this.onResize = this.#onResize.bind(this);
        window.addEventListener("resize", this.onResize);
    }

    /* ── the renderer: the one that actually writes pixels ─────────────── */

    #buildRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,

            // Smooths the hard diagonal edges of the wireframe. Costs a little
            // fill rate. We turn this off again at Phase 4 — once the image is
            // passing through post-processing passes, anti-aliasing has to be
            // done a different way anyway.
            antialias: true,

            // The page behind the canvas is already black, so we do not need a
            // see-through canvas. An opaque one is cheaper: the GPU can skip
            // blending this layer against whatever is underneath it.
            alpha: false,
        });

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Tells Three the colours we hand it are meant for a normal sRGB
        // monitor, so it converts correctly on the way out. Without this line
        // everything renders subtly washed out — most visible in dark greys,
        // which is the entire palette of this site.
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    /* ── the room, and where we stand in it ────────────────────────────── */

    #buildScene() {
        // The scene has no rendering ability of its own. It is a list.
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45, // field of view in degrees: how wide our vision is. Small numbers
            // are a telephoto lens (flat, distant, calm), large numbers are a
            // fisheye (dramatic, distorted). 45 is roughly a normal lens.
            window.innerWidth / window.innerHeight, // aspect ratio — must match
            // the canvas or everything is stretched
            0.1, // near: anything closer than this is not drawn
            100 // far: anything further than this is not drawn
        );

        // Three's world has x to the right, y up, and z coming out of the screen
        // towards your face. So a positive z moves the camera backwards, away
        // from the cube sitting at the origin.
        this.camera.position.z = 3;

        this.scene.add(this.camera);
    }

    /* ── the one object in the room ────────────────────────────────────── */

    #buildCube() {
        // Geometry: where the corners are. 1x1x1 units. "Units" are whatever we
        // decide they are — there is no metre in here, only the relationship
        // between this number and the camera's distance of 3.
        this.geometry = new THREE.BoxGeometry(1, 1, 1);

        // Material: what the surface does when it is looked at. "Basic" means it
        // ignores light entirely and paints one flat colour. That is why there
        // is no light anywhere in this file — a basic material would not care if
        // there were one.
        //
        // wireframe draws only the edges between corners. Solid, this cube would
        // read as a flat grey hexagon: with no light, every face returns the
        // identical colour and the shape disappears. See GO POKE IT.
        this.material = new THREE.MeshBasicMaterial({
            color: 0xe9ebed, // --bone, the same off-white as the page text
            wireframe: true,
        });

        // Mesh: shape and surface bound together into one thing that has a
        // position and a rotation. This is what gets added to the room.
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
    }

    /* ── the loop ──────────────────────────────────────────────────────── */

    start() {
        if (this.prefersReducedMotion) {
            // One frame, held still. The cube is visible; it does not move.
            this.renderer.render(this.scene, this.camera);
            return;
        }
        this.#tick();
    }

    #tick() {
        // Queue the next frame BEFORE doing the work. If drawing throws, we have
        // at least already asked for the next attempt.
        this.frameId = requestAnimationFrame(() => this.#tick());

        // Seconds since the clock started. This is the wall clock — the line that
        // makes the cube turn at the same speed on a 120Hz monitor and on a
        // struggling phone.
        const elapsed = this.clock.getElapsedTime();

        // Rotation is SET from the time, never added to. Writing
        //     this.cube.rotation.y += 0.01
        // means "a bit more each frame", which silently ties the speed of the
        // animation to the speed of the machine.
        this.cube.rotation.y = elapsed * 0.4; // 0.4 radians per second
        this.cube.rotation.x = elapsed * 0.15; // slower tilt, so it never looks
        // like it is spinning on a single axis

        // Draw the room from the camera onto the canvas. One page of the
        // flipbook, torn off.
        this.renderer.render(this.scene, this.camera);
    }

    /* ── keeping up with the window ────────────────────────────────────── */

    #onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;

        // The camera caches its lens maths in a matrix and does not recompute it
        // on its own. Change aspect without this line and nothing happens at all
        // — a genuinely confusing bug the first time you hit it.
        this.camera.updateProjectionMatrix();

        // Re-read the pixel ratio too: dragging a window between a laptop screen
        // and an external monitor changes it without reloading the page.
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /* ── cleanup ───────────────────────────────────────────────────────── */

    /**
     * Geometries, materials and textures allocate memory on the GPU, and the GPU
     * is not reachable by JavaScript's garbage collector. Dropping the last
     * reference to a mesh frees the JS object and leaves the vertex data sitting
     * on the graphics card forever. Every one of them has to be released by hand.
     *
     * Nothing calls this yet — Phase 0 has one scene that lives as long as the
     * page does. It starts to matter at Phase 5, where route changes create and
     * destroy meshes repeatedly and the leak compounds until the tab dies.
     */
    dispose() {
        if (this.frameId !== null) cancelAnimationFrame(this.frameId);
        window.removeEventListener("resize", this.onResize);

        this.scene.remove(this.cube);
        this.geometry.dispose();
        this.material.dispose();

        // Releases the WebGL context itself, not only what was inside it.
        this.renderer.dispose();
    }
}
