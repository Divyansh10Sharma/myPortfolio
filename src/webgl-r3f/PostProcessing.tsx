import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    Vector2,
    WebGLRenderTarget,
} from "three";

import vertexShader from "../shaders/plane.vert?raw";
import fragmentShader from "../shaders/post.frag?raw";
import { scrollState } from "../state/scroll";
import { backgroundLayer } from "../state/layers";

interface PostProcessingProps {
    grain: number;
    aberration: number;
}

/**
 * Draws the scene into a picture, then draws the picture.
 *
 * THE IDEA: until now the renderer painted straight onto the screen, and once a
 * pixel is on the screen it is gone — there is nothing left to adjust. So
 * instead we hand it a blank sheet nobody can see. When the scene is finished we
 * are holding the whole image as a texture, and we can do one thing to all of it
 * at once: split the colours, darken the corners, lay grain over the lot. Then
 * we paste the adjusted version onto the screen as one flat rectangle.
 *
 * This is what makes the page feel like a single surface. Before, only the
 * gradient had grain, so the photograph and the headline sat on top of it
 * looking suspiciously clean.
 *
 * Two paintings per frame instead of one — which is why it is switched off on
 * weak devices.
 *
 * This component renders no JSX. It exists to take over the render loop, which
 * is a genuinely unusual thing for a React component to do and worth
 * understanding: `useFrame` with a priority above 0 tells R3F to stop
 * automatically rendering the scene and hand control here instead.
 */
export function PostProcessing({ grain, aberration }: PostProcessingProps) {
    const { gl, scene, camera, size, viewport } = useThree();

    // Built once. Rebuilding a render target every render would allocate a
    // full-screen texture each time and abandon the last one — about 8MB a go
    // at 1440p, climbing until the tab dies.
    const post = useMemo(() => {
        const target = new WebGLRenderTarget(1, 1, {
            // Everything here is flat and ordered by renderOrder, so neither
            // buffer is needed. Leaving them out saves memory on every device.
            depthBuffer: false,
            stencilBuffer: false,
        });

        const uniforms = {
            uScene: { value: target.texture },
            uTime: { value: 0 },
            uVelocity: { value: 0 },
            uResolution: { value: new Vector2(1, 1) },
            uGrainStrength: { value: grain },
            uAberration: { value: aberration },
        };

        const material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            depthTest: false,
            depthWrite: false,
        });

        const geometry = new PlaneGeometry(2, 2);

        // A second, tiny scene whose only inhabitant is one rectangle. Kept
        // separate from the real scene on purpose: if the quad lived in the
        // main scene, the first pass would draw the quad into the picture that
        // the quad is about to display — a hall of mirrors, one frame behind.
        const postScene = new Scene();
        // -1..1 with a 2x2 plane covers the viewport exactly, at any size, so
        // this camera never needs touching on resize.
        const postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        postScene.add(new Mesh(geometry, material));

        return { target, uniforms, material, geometry, postScene, postCamera };
    }, [grain, aberration]);

    // Keep the sheet the same size as the screen. In real device pixels, not
    // CSS pixels, or the final image is soft on any modern display.
    useEffect(() => {
        const width = size.width * viewport.dpr;
        const height = size.height * viewport.dpr;

        post.target.setSize(width, height);
        post.uniforms.uResolution.value.set(width, height);
    }, [post, size.width, size.height, viewport.dpr]);

    // Release the GPU memory when this unmounts. The render target is the
    // single largest thing this site allocates.
    useEffect(() => {
        return () => {
            post.target.dispose();
            post.material.dispose();
            post.geometry.dispose();
        };
    }, [post]);

    /**
     * Priority 1. This is the line that matters: any priority above zero stops
     * R3F rendering the scene for us, and makes this function responsible for
     * putting something on the screen. Get it wrong and the canvas is black.
     */
    useFrame((_, delta) => {
        post.uniforms.uTime.value += delta;
        post.uniforms.uVelocity.value = scrollState.velocity / 55;

        gl.setRenderTarget(post.target);

        // Pass one, part one: anything that registered itself as a background
        // layer. The depth field lives here — it has its own perspective
        // camera, which the main orthographic one could never provide.
        if (backgroundLayer.render) {
            gl.clear();
            backgroundLayer.render(gl);

            // The main scene must now draw ON TOP of that rather than wiping
            // it. Restored immediately after, because leaving autoClear off
            // globally makes every later frame smear over the last.
            gl.autoClear = false;
            gl.render(scene, camera);
            gl.autoClear = true;
        } else {
            gl.render(scene, camera);
        }

        // Pass two: the sheet, onto the screen, through the post shader.
        //
        // Forgetting to set the target back to null is the classic mistake:
        // everything keeps rendering into the texture, the screen stays black,
        // and nothing errors anywhere.
        gl.setRenderTarget(null);
        gl.render(post.postScene, post.postCamera);
    }, 1);

    return null;
}
