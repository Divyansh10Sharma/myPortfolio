/**
 * PhotoPlane — the photograph as a shader surface. Signature effect (A).
 *
 * The <img> stays in the DOM and stays the source of truth for layout and for
 * accessibility. This plane is drawn exactly on top of it, and the <img> is
 * then made transparent. If WebGL never starts, the image is simply visible as
 * a normal image and nothing looks broken.
 */

import { Mesh, ShaderMaterial, TextureLoader, SRGBColorSpace, Vector2 } from "three";
import DomPlane from "./DomPlane.js";
import vertexShader from "../shaders/plane.vert?raw";
import fragmentShader from "../shaders/photo.frag?raw";

export default class PhotoPlane extends DomPlane {
    constructor(element, { onLoad } = {}) {
        super(element, { segments: 1 }); // flat image: the corners never move,
        // so subdividing would cost vertices for nothing

        this.hover = 0; // where the effect actually is
        this.hoverTarget = 0; // where it is heading
        this.mouse = new Vector2(0.5, 0.5);
        this.revealed = false;

        this.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                uTexture: { value: null },
                uHover: { value: 0 },
                uMouse: { value: this.mouse },
                uTime: { value: 0 },
                uReveal: { value: 0 },
            },
        });

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.renderOrder = 1; // above the background

        // Nothing is drawn until the picture actually arrives. Until then the
        // plane is fully transparent, so the real <img> underneath shows
        // through and there is no gap.
        this.ready = false;

        new TextureLoader().load(element.currentSrc || element.src, (texture) => {
            // Tells Three the file's colours are already sRGB-encoded. Without
            // it the photograph renders noticeably washed out.
            texture.colorSpace = SRGBColorSpace;
            this.material.uniforms.uTexture.value = texture;
            this.texture = texture;
            this.ready = true;
            onLoad?.();
        });

        this.#bindPointer();
    }

    #bindPointer() {
        // Listening on the element, not the window: the browser does the
        // hit-testing for us, and it stays correct however the page reflows.
        this.element.addEventListener("pointerenter", () => (this.hoverTarget = 1));
        this.element.addEventListener("pointerleave", () => (this.hoverTarget = 0));

        this.element.addEventListener("pointermove", (event) => {
            const rect = this.element.getBoundingClientRect();

            // Pointer position as 0–1 within the element. The y is flipped
            // because DOM y grows downward and texture coordinates grow upward.
            this.mouse.set(
                (event.clientX - rect.left) / rect.width,
                1 - (event.clientY - rect.top) / rect.height
            );
        });
    }

    /** Called once, when the plane first scrolls into view. */
    reveal() {
        this.revealed = true;
    }

    update(scrollY, viewportWidth, viewportHeight, time, delta) {
        super.update(scrollY, viewportWidth, viewportHeight);

        // Chase the target rather than jumping to it — the same walk-a-fraction
        // -of-the-way-there idea as the smooth scroll. The hover fades in over
        // roughly a third of a second instead of snapping, which is the whole
        // difference between "expensive" and "a CSS hover state".
        //
        // Scaled by delta so the speed is the same at 30fps and 120fps.
        const ease = 1 - Math.pow(0.001, delta);
        this.hover += (this.hoverTarget - this.hover) * ease;

        const uniforms = this.material.uniforms;
        uniforms.uHover.value = this.hover;
        uniforms.uTime.value = time;

        if (this.revealed && uniforms.uReveal.value < 1) {
            uniforms.uReveal.value = Math.min(1, uniforms.uReveal.value + delta * 0.8);
        }
    }

    dispose() {
        this.texture?.dispose(); // textures are the biggest thing we put on the
        // GPU — a 1022x1022 image is about 4MB there
        super.dispose();
    }
}
