/**
 * Stage — the full-screen shader background.
 *
 * One flat rectangle covering the viewport, wearing a fragment shader that
 * paints a slow gradient and a film grain. It sits behind the DOM and reacts to
 * scroll position.
 *
 * The rectangle is a delivery mechanism, nothing more. Because the camera is
 * orthographic and the plane is exactly the size of the view, there is no
 * perspective, no depth and no 3D happening at all — it exists purely so the
 * fragment shader has every pixel of the screen to write on.
 */

import {
    Clock,
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    SRGBColorSpace,
    Vector2,
    WebGLRenderer,
} from "three";
import vertexShader from "../shaders/background.vert?raw";
import fragmentShader from "../shaders/background.frag?raw";

/**
 * Decide once, at load, how hard we are allowed to push this device.
 *
 * The honest answer is that there is no reliable way to ask a browser how fast
 * its GPU is. These are proxies, and they are wrong sometimes — a cheap phone
 * with eight weak cores reads as capable. They are still far better than
 * assuming every visitor is on the machine this was built on.
 */
function detectQuality() {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // GB, Chrome only
    const coarse = window.matchMedia("(pointer: coarse)").matches; // touch device

    const low = cores <= 4 || memory <= 4 || (coarse && window.innerWidth < 900);

    return {
        low,
        // A 3x phone screen means nine times the pixels for the same physical
        // area. This shader runs per pixel, so the pixel ratio is the single
        // biggest lever we have on its cost.
        pixelRatio: low ? 1 : Math.min(window.devicePixelRatio, 2),
        // Half the frame rate, half the shader cost. 30fps is fine for
        // something this slow — nobody perceives a breathing gradient as
        // stuttering.
        fpsCap: low ? 30 : 0, // 0 = uncapped
        grain: low ? 0.055 : 0.075,
    };
}

export default class Stage {
    constructor(canvas) {
        this.canvas = canvas;
        this.quality = detectQuality();

        this.clock = new Clock();
        this.frameId = null;
        this.lastDraw = 0;

        this.prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.#buildRenderer();
        this.#buildScene();

        this.onResize = this.#onResize.bind(this);
        window.addEventListener("resize", this.onResize);
    }

    #buildRenderer() {
        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            // Nothing here has a hard edge — it is all soft gradient and noise —
            // so there is nothing for anti-aliasing to smooth. Turning it off is
            // free performance.
            antialias: false,
            alpha: false,
            // We never read the canvas back as an image, and telling the browser
            // so lets it skip keeping a copy of every frame around.
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
        });

        this.renderer.setPixelRatio(this.quality.pixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputColorSpace = SRGBColorSpace;
    }

    #buildScene() {
        this.scene = new Scene();

        // An orthographic camera has no perspective — nothing gets smaller with
        // distance. Set to exactly -1..1 on both axes, it maps a 2x2 plane
        // precisely onto the screen, whatever the window size. This is the
        // standard way to run a fragment shader over the whole viewport.
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.geometry = new PlaneGeometry(2, 2);

        // Uniforms: values that are the same for every pixel this frame, set
        // from JavaScript and read inside the shader. The shader cannot reach
        // out and ask for anything — this object is the entire conversation.
        this.uniforms = {
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uResolution: {
                value: new Vector2(
                    window.innerWidth * this.quality.pixelRatio,
                    window.innerHeight * this.quality.pixelRatio
                ),
            },
            uGrainStrength: { value: this.quality.grain },
        };

        this.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            depthTest: false, // nothing is in front of or behind anything else
            depthWrite: false,
        });

        this.mesh = new Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    /**
     * Called from main.js on every scroll update. Takes 0–1, where 1 is the
     * bottom of the page.
     */
    setScroll(progress) {
        this.uniforms.uScroll.value = progress;

        // Under reduced motion there is no loop running, so a scroll would
        // otherwise change nothing on screen. Draw exactly one frame in
        // response to the input the visitor actually gave us.
        if (this.prefersReducedMotion) this.#draw();
    }

    start() {
        if (this.prefersReducedMotion) {
            // A static gradient with static grain. Still a designed background,
            // just not a moving one.
            this.#draw();
            return;
        }
        this.#tick();
    }

    #tick() {
        this.frameId = requestAnimationFrame(() => this.#tick());

        const elapsed = this.clock.getElapsedTime();

        // Frame cap for weak devices. We still get woken every frame — that is
        // the browser's schedule, not ours — but we skip the expensive part,
        // which is the only part that costs anything.
        if (this.quality.fpsCap) {
            if (elapsed - this.lastDraw < 1 / this.quality.fpsCap) return;
            this.lastDraw = elapsed;
        }

        this.uniforms.uTime.value = elapsed;
        this.#draw();
    }

    #draw() {
        this.renderer.render(this.scene, this.camera);
    }

    #onResize() {
        this.renderer.setPixelRatio(this.quality.pixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // The shader divides by this to correct the aspect ratio. Forget to
        // update it and the gradient stretches into an oval after a resize.
        this.uniforms.uResolution.value.set(
            window.innerWidth * this.quality.pixelRatio,
            window.innerHeight * this.quality.pixelRatio
        );

        // The orthographic camera needs no update: it is fixed at -1..1 and the
        // plane is fixed at 2x2, so the mapping is correct at any window size.

        if (this.prefersReducedMotion) this.#draw();
    }

    /**
     * GPU memory is not reachable by JavaScript's garbage collector. Dropping
     * the last reference to a mesh frees the JS object and leaves its data on
     * the graphics card. Every geometry, material and texture has to be
     * released by hand.
     */
    dispose() {
        if (this.frameId !== null) cancelAnimationFrame(this.frameId);
        window.removeEventListener("resize", this.onResize);

        this.scene.remove(this.mesh);
        this.geometry.dispose();
        this.material.dispose();
        this.renderer.dispose();
    }
}
