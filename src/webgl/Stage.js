/**
 * Stage — one renderer, one scene, one camera, for the whole site.
 *
 * Holds three things:
 *   1. the full-screen shader background (Sprint 2)
 *   2. the headline plane          — signature effect (B)
 *   3. the photograph plane        — signature effect (A)
 *
 * The camera is orthographic and measured in CSS pixels, which is the single
 * decision that makes everything else easy: one world unit is one pixel, so a
 * DOM element 400px wide becomes a plane 400 units wide, and its position can
 * be worked out with arithmetic instead of guesswork. See DomPlane.js.
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

import PhotoPlane from "./PhotoPlane.js";
import TextPlane from "./TextPlane.js";
import backgroundVert from "../shaders/background.vert?raw";
import backgroundFrag from "../shaders/background.frag?raw";

/**
 * Decide once, at load, how hard we are allowed to push this device.
 *
 * There is no reliable way to ask a browser how fast its GPU is. These are
 * proxies and they are wrong sometimes — a cheap phone with eight weak cores
 * reads as capable. They are still far better than assuming every visitor is on
 * the machine this was built on.
 */
function detectQuality() {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // GB, Chrome only
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const low = cores <= 4 || memory <= 4 || (coarse && window.innerWidth < 900);

    return {
        low,
        pixelRatio: low ? 1 : Math.min(window.devicePixelRatio, 2),
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

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scrollY = 0;
        this.velocity = 0; // smoothed, normalised scroll speed
        this.velocityTarget = 0;

        this.planes = [];

        this.prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.#buildRenderer();
        this.#buildScene();
        this.#buildBackground();

        this.onResize = this.#onResize.bind(this);
        window.addEventListener("resize", this.onResize);
    }

    #buildRenderer() {
        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: false, // nothing here has a hard edge to smooth
            alpha: false,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
        });

        this.renderer.setPixelRatio(this.quality.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.outputColorSpace = SRGBColorSpace;
    }

    #buildScene() {
        this.scene = new Scene();

        // Orthographic, in pixel units: left edge at -width/2, right at
        // +width/2. No perspective, so nothing gets smaller with distance and a
        // plane's on-screen size is exactly its world size.
        this.camera = new OrthographicCamera(
            -this.width / 2,
            this.width / 2,
            this.height / 2,
            -this.height / 2,
            0.1,
            100
        );
        this.camera.position.z = 10;
    }

    #buildBackground() {
        this.backgroundGeometry = new PlaneGeometry(1, 1);

        this.backgroundUniforms = {
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uResolution: {
                value: new Vector2(
                    this.width * this.quality.pixelRatio,
                    this.height * this.quality.pixelRatio
                ),
            },
            uGrainStrength: { value: this.quality.grain },
        };

        this.backgroundMaterial = new ShaderMaterial({
            vertexShader: backgroundVert,
            fragmentShader: backgroundFrag,
            uniforms: this.backgroundUniforms,
            depthTest: false,
            depthWrite: false,
        });

        this.background = new Mesh(this.backgroundGeometry, this.backgroundMaterial);
        this.background.scale.set(this.width, this.height, 1);
        this.background.renderOrder = 0; // drawn first, everything else on top
        this.scene.add(this.background);
    }

    /* ── planes ────────────────────────────────────────────────── */

    /**
     * @param {HTMLImageElement} img the real <img> to shadow
     */
    addPhoto(img) {
        const plane = new PhotoPlane(img, {
            // Only hide the real image once the texture has actually arrived,
            // so there is never a moment with no picture at all.
            onLoad: () => img.classList.add("is-webgl"),
        });
        plane.measure(this.scrollY);
        this.scene.add(plane.mesh);
        this.planes.push(plane);
        this.photo = plane;
        return plane;
    }

    /**
     * @param {HTMLElement} heading the real <h1> to shadow
     */
    addText(heading) {
        const plane = new TextPlane(heading);
        plane.measure(this.scrollY, this.quality.pixelRatio);
        this.scene.add(plane.mesh);
        this.planes.push(plane);
        this.text = plane;
        heading.classList.add("is-webgl");
        return plane;
    }

    /* ── input ─────────────────────────────────────────────────── */

    /**
     * @param {number} progress 0–1 down the page
     * @param {number} pixels absolute scroll position
     * @param {number} velocity raw pixels-per-frame from the scroller
     */
    setScroll(progress, pixels, velocity = 0) {
        this.backgroundUniforms.uScroll.value = progress;
        this.scrollY = pixels;

        // Normalise into roughly -1..1 and clamp. Raw velocity is unbounded —
        // a trackpad flick can spike to hundreds of pixels a frame, which would
        // tear the headline in half.
        this.velocityTarget = Math.max(-1, Math.min(1, velocity / 55));

        if (this.prefersReducedMotion) {
            this.#syncPlanes(this.clock.getElapsedTime(), 0);
            this.#draw();
        }
    }

    /** Re-measure everything. On load, and on resize. */
    refresh() {
        this.planes.forEach((plane) =>
            plane.measure(this.scrollY, this.quality.pixelRatio)
        );
    }

    /* ── loop ──────────────────────────────────────────────────── */

    start() {
        if (this.prefersReducedMotion) {
            // Static: no movement, no distortion, no hover. The planes are
            // still drawn, so the photograph and headline look right — they
            // simply do not react.
            this.text?.startReveal();
            this.text && (this.text.material.uniforms.uReveal.value = 1);
            this.photo && (this.photo.material.uniforms.uReveal.value = 1);
            this.#syncPlanes(0, 0);
            this.#draw();
            return;
        }
        this.#tick();
    }

    #tick() {
        this.frameId = requestAnimationFrame(() => this.#tick());

        const elapsed = this.clock.getElapsedTime();
        const delta = Math.min(elapsed - this.lastDraw, 0.1); // clamped: a
        // background tab can hand us a delta of several seconds

        if (this.quality.fpsCap && delta < 1 / this.quality.fpsCap) return;
        this.lastDraw = elapsed;

        // Ease the velocity toward its target and then back to zero. This is
        // what makes the headline settle after you stop scrolling rather than
        // freezing mid-bend.
        const ease = 1 - Math.pow(0.0008, delta);
        this.velocity += (this.velocityTarget - this.velocity) * ease;
        this.velocityTarget *= 0.9; // decay, so a scroll that stops decays out

        this.backgroundUniforms.uTime.value = elapsed;

        this.#syncPlanes(elapsed, delta);
        this.#draw();
    }

    #syncPlanes(elapsed, delta) {
        this.text?.setVelocity(this.velocity);

        for (const plane of this.planes) {
            const visible = plane.isVisible(this.scrollY, this.height);

            // Skipping off-screen planes is the cheapest optimisation there is:
            // a plane nobody can see costs nothing at all.
            plane.mesh.visible = visible;
            if (!visible) continue;

            plane.update(this.scrollY, this.width, this.height, elapsed, delta);

            // Trigger the photograph's one-shot reveal the first time it is
            // properly on screen rather than the instant its top edge appears.
            if (plane === this.photo && !plane.revealed) {
                const screenTop = plane.bounds.docTop - this.scrollY;
                if (screenTop < this.height * 0.85) plane.reveal();
            }
        }
    }

    #draw() {
        this.renderer.render(this.scene, this.camera);
    }

    #onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer.setPixelRatio(this.quality.pixelRatio);
        this.renderer.setSize(this.width, this.height);

        // An orthographic camera's frustum is set in world units, and our world
        // units are pixels — so a resize changes it and it must be rebuilt.
        this.camera.left = -this.width / 2;
        this.camera.right = this.width / 2;
        this.camera.top = this.height / 2;
        this.camera.bottom = -this.height / 2;
        this.camera.updateProjectionMatrix();

        this.background.scale.set(this.width, this.height, 1);
        this.backgroundUniforms.uResolution.value.set(
            this.width * this.quality.pixelRatio,
            this.height * this.quality.pixelRatio
        );

        // Layout has changed, so every measurement we cached is now wrong.
        this.refresh();

        if (this.prefersReducedMotion) {
            this.#syncPlanes(0, 0);
            this.#draw();
        }
    }

    /**
     * GPU memory is not reachable by JavaScript's garbage collector. Dropping
     * the last reference to a mesh frees the JS object and leaves its data on
     * the graphics card. Textures are the expensive ones — the photograph alone
     * is about 4MB there.
     */
    dispose() {
        if (this.frameId !== null) cancelAnimationFrame(this.frameId);
        window.removeEventListener("resize", this.onResize);

        this.planes.forEach((plane) => {
            this.scene.remove(plane.mesh);
            plane.dispose();
        });

        this.scene.remove(this.background);
        this.backgroundGeometry.dispose();
        this.backgroundMaterial.dispose();
        this.renderer.dispose();
    }
}
