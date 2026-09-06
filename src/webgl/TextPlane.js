/**
 * TextPlane — the headline as a shader surface. Signature effect (B).
 *
 * WebGL cannot render text. It has no idea what a letter is. So the standard
 * technique, and the one every site doing this uses, is to draw the text onto
 * an ordinary 2D canvas — where the browser's text rendering does all the hard
 * work of fonts and shaping — and then hand that canvas to the GPU as a
 * picture.
 *
 * The real <h1> stays in the DOM, readable by search engines and screen
 * readers, and is simply made invisible once this takes over.
 */

import { CanvasTexture, LinearFilter, Mesh, ShaderMaterial } from "three";
import DomPlane from "./DomPlane.js";
import vertexShader from "../shaders/plane.vert?raw";
import fragmentShader from "../shaders/text.frag?raw";

export default class TextPlane extends DomPlane {
    constructor(element) {
        super(element, { segments: 1 });

        this.velocity = 0;
        this.revealProgress = 0;
        this.revealing = false;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.texture = new CanvasTexture(this.canvas);
        // The texture is drawn at very close to its native size, so the cheap
        // linear filter is enough and mipmaps would only cost memory.
        this.texture.minFilter = LinearFilter;
        this.texture.generateMipmaps = false;

        this.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                uTexture: { value: this.texture },
                uVelocity: { value: 0 },
                uReveal: { value: 0 },
                uTime: { value: 0 },
            },
        });

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.renderOrder = 2;
    }

    /**
     * Redraw the text into the canvas. Called on load and on resize, because
     * the font size is in vw units and the line breaks move.
     *
     * Everything here is read from the real element's computed style, so the
     * painted version cannot drift away from the CSS.
     */
    paint(pixelRatio) {
        const rect = this.element.getBoundingClientRect();
        if (rect.width === 0) return;

        const style = getComputedStyle(this.element);

        // Draw at device resolution, not CSS resolution, or the letters are
        // soft on any modern screen. Capped at 2 for the same reason the
        // renderer is: a 3x phone would be drawing nine times the pixels.
        const dpr = Math.min(pixelRatio, 2);

        this.canvas.width = Math.ceil(rect.width * dpr);
        this.canvas.height = Math.ceil(rect.height * dpr);

        const ctx = this.ctx;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // work in CSS pixels from here
        ctx.clearRect(0, 0, rect.width, rect.height);

        const fontSize = parseFloat(style.fontSize);
        const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.08;

        ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
        // Supported in Chrome, Edge and Safari 16+. Where it is missing the
        // headline is a hair wider, which nobody will ever notice.
        ctx.letterSpacing = style.letterSpacing;

        // White, because the fragment shader only reads the alpha channel and
        // supplies the colour itself. Drawing it off-white here would make no
        // difference to the result.
        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = "alphabetic";

        // Wrap exactly the way the browser would: greedily, by word, to the
        // element's own width.
        const words = this.element.textContent.trim().split(/\s+/);
        const lines = [];
        let line = "";

        for (const word of words) {
            const candidate = line ? `${line} ${word}` : word;
            if (ctx.measureText(candidate).width > rect.width && line) {
                lines.push(line);
                line = word;
            } else {
                line = candidate;
            }
        }
        if (line) lines.push(line);

        // Vertically centre the block of lines inside the element's box, the
        // way the browser's own line boxes do.
        const blockHeight = lines.length * lineHeight;
        const top = (rect.height - blockHeight) / 2;

        lines.forEach((text, i) => {
            // 0.78 of the line height puts the baseline roughly where a real
            // line box would — close enough that the swap is invisible.
            ctx.fillText(text, 0, top + i * lineHeight + lineHeight * 0.78);
        });

        this.texture.needsUpdate = true; // the GPU keeps its own copy; this is
        // what tells it to re-upload
    }

    measure(scrollY, pixelRatio) {
        super.measure(scrollY);
        if (pixelRatio) this.paint(pixelRatio);
    }

    startReveal() {
        this.revealing = true;
    }

    /**
     * @param {number} velocity scroll speed, already normalised and smoothed
     */
    setVelocity(velocity) {
        this.velocity = velocity;
    }

    update(scrollY, viewportWidth, viewportHeight, time, delta) {
        super.update(scrollY, viewportWidth, viewportHeight);

        const uniforms = this.material.uniforms;
        uniforms.uTime.value = time;
        uniforms.uVelocity.value = this.velocity;

        if (this.revealing && this.revealProgress < 1) {
            this.revealProgress = Math.min(1, this.revealProgress + delta * 0.75);
            // Ease the raw 0→1 so it decelerates into place instead of stopping
            // dead — the same reasoning as every other curve on this site.
            const t = this.revealProgress;
            uniforms.uReveal.value = 1 - Math.pow(1 - t, 3);
        }
    }

    dispose() {
        this.texture.dispose();
        super.dispose();
    }
}
