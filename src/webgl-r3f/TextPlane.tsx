import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, LinearFilter, ShaderMaterial } from "three";
import vertexShader from "../shaders/plane.vert?raw";
import fragmentShader from "../shaders/text.frag?raw";
import { useDomPlane } from "../hooks/useDomPlane";
import { scrollState } from "../state/scroll";

interface TextPlaneProps {
    /** The real <h1>. It stays the readable heading for search and screen readers. */
    element: HTMLElement;
    pixelRatio: number;
}

/**
 * Signature effect B — the headline as a shader surface.
 *
 * WebGL cannot render text; it has no concept of a letter. So the words are
 * painted onto an ordinary 2D canvas, where the browser's text engine does the
 * hard work, and that canvas is handed to the GPU as a picture. The shader is
 * bending an image and has no idea it is words.
 *
 * It bows as you scroll: held at the top and bottom edges, dragging in the
 * middle, the way a sheet on a line bows when you tug the line sideways.
 */
export function TextPlane({ element, pixelRatio }: TextPlaneProps) {
    const materialRef = useRef<ShaderMaterial>(null);
    const { meshRef, measure, position } = useDomPlane(element);

    const velocity = useRef(0);
    const revealProgress = useRef(0);

    // The canvas and its texture are created once and reused. Rebuilding them
    // on every resize would leak GPU memory, one texture at a time.
    const { canvas, texture } = useMemo(() => {
        const canvas = document.createElement("canvas");
        const texture = new CanvasTexture(canvas);
        // Drawn at close to native size, so the cheap filter is enough and
        // mipmaps would only cost memory.
        texture.minFilter = LinearFilter;
        texture.generateMipmaps = false;
        return { canvas, texture };
    }, []);

    const uniforms = useMemo(
        () => ({
            uTexture: { value: texture },
            uVelocity: { value: 0 },
            uReveal: { value: 0 },
            uTime: { value: 0 },
        }),
        [texture]
    );

    /**
     * Redraw the words into the canvas.
     *
     * Every value is read from the real element's computed style, so the
     * painted copy cannot drift away from the CSS. Hardcoding the font here
     * would mean two sources of truth that quietly disagree.
     */
    const paint = useCallback(() => {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0) return;

        const style = getComputedStyle(element);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw at device resolution or the letters are soft on any modern
        // screen. Capped for the same reason the renderer is.
        const dpr = Math.min(pixelRatio, 2);
        const width = Math.ceil(rect.width * dpr);
        const height = Math.ceil(rect.height * dpr);

        // Changing a canvas's dimensions is what makes the GPU copy invalid.
        // Three allocated the texture at whatever size the canvas was when it
        // was created — 300x150, the default, before we had measured anything —
        // and afterwards tries to update it in place. Uploading a larger image
        // into that smaller allocation fails with
        // "GL_INVALID_VALUE: Offset overflows texture dimensions", and the
        // headline silently never appears.
        //
        // Disposing forces Three to allocate again at the new size on the next
        // frame. Only when the size actually changed: disposing every repaint
        // would throw away a perfectly good texture on every resize event.
        const resized = canvas.width !== width || canvas.height !== height;

        canvas.width = width;
        canvas.height = height;

        if (resized) texture.dispose();

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // work in CSS pixels from here
        ctx.clearRect(0, 0, rect.width, rect.height);

        const fontSize = parseFloat(style.fontSize);
        const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.08;

        ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
        ctx.letterSpacing = style.letterSpacing; // Chrome, Edge, Safari 16+
        // White: the shader reads only the alpha channel and supplies the
        // colour itself, so what is drawn here only has to be opaque.
        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = "alphabetic";

        // Wrap greedily by word, to the element's own width — the same way the
        // browser would.
        const words = (element.textContent ?? "").trim().split(/\s+/);
        const lines: string[] = [];
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

        const top = (rect.height - lines.length * lineHeight) / 2;
        lines.forEach((text, i) => {
            ctx.fillText(text, 0, top + i * lineHeight + lineHeight * 0.78);
        });

        texture.needsUpdate = true; // the GPU holds its own copy; this is what
        // tells it to re-upload
    }, [element, canvas, texture, pixelRatio]);

    useEffect(() => {
        // Fonts first: measuring before the webfont arrives puts the line
        // breaks in the wrong places and paints the fallback face.
        let cancelled = false;

        document.fonts.ready.then(() => {
            if (cancelled) return;
            paint();
            measure();
            element.classList.add("is-webgl");
        });

        const onResize = () => {
            paint();
            measure();
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelled = true;
            window.removeEventListener("resize", onResize);
            element.classList.remove("is-webgl");
            // Textures are the expensive thing on the GPU and are not garbage
            // collected. Releasing it here is the whole lesson of dispose().
            texture.dispose();
        };
    }, [paint, measure, element, texture]);

    useFrame((_, delta) => {
        const material = materialRef.current;
        const mesh = meshRef.current;
        if (!material || !mesh) return;

        const visible = position();
        mesh.visible = visible;
        if (!visible) return;

        // Normalise the raw scroll speed into roughly -1..1 and clamp it. A
        // trackpad flick can spike to hundreds of pixels a frame, which would
        // tear the headline in half.
        const target = Math.max(-1, Math.min(1, scrollState.velocity / 55));

        // Ease toward it, then let it decay back to zero, so the headline
        // settles after you stop scrolling rather than freezing mid-bend.
        const ease = 1 - Math.pow(0.0008, delta);
        velocity.current += (target - velocity.current) * ease;

        material.uniforms.uVelocity.value = velocity.current;
        material.uniforms.uTime.value += delta;

        if (revealProgress.current < 1) {
            revealProgress.current = Math.min(1, revealProgress.current + delta * 0.75);
            // Eased so it decelerates into place instead of stopping dead.
            const t = revealProgress.current;
            material.uniforms.uReveal.value = 1 - Math.pow(1 - t, 3);
        }
    });

    return (
        <mesh ref={meshRef} renderOrder={2}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthTest={false}
                depthWrite={false}
            />
        </mesh>
    );
}
