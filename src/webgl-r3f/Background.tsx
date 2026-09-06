import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial, Vector2 } from "three";
import vertexShader from "../shaders/background.vert?raw";
import fragmentShader from "../shaders/background.frag?raw";
import { scrollState } from "../state/scroll";
import type { Quality } from "../hooks/useQuality";

/**
 * The full-screen shader background: a slow gradient and film grain.
 *
 * Compare this with the vanilla `Stage.js`. That file had to build a renderer,
 * a scene, a camera, a geometry, a material, a mesh, a resize handler and a
 * requestAnimationFrame loop — about 200 lines. Here R3F owns all of it and
 * what is left is the part that was ever actually interesting: which uniforms
 * exist, and what happens each frame.
 *
 * That is the honest trade. Less code, and less visibility into the machine.
 */
export function Background({ quality }: { quality: Quality }) {
    const materialRef = useRef<ShaderMaterial>(null);
    const size = useThree((state) => state.size);
    const lastDraw = useRef(0);

    /**
     * Built once and mutated in place, never rebuilt.
     *
     * useMemo with no dependencies matters here: if this object were recreated
     * on every render, Three would see a new uniforms object each time and
     * re-upload everything. We want one object whose `.value` fields we write
     * to sixty times a second.
     */
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uResolution: { value: new Vector2(1, 1) },
            uGrainStrength: { value: quality.grain },
        }),
        [quality.grain]
    );

    // The shader divides by this to keep the glow circular. Written during
    // render rather than in an effect because it is derived directly from
    // size — no effect needed, and no extra render.
    uniforms.uResolution.value.set(
        size.width * quality.pixelRatio,
        size.height * quality.pixelRatio
    );

    /**
     * useFrame IS the render loop. It is the exact equivalent of the vanilla
     * build's #tick(), except R3F calls it for us and cancels it on unmount.
     *
     * Note what is NOT here: no setState. Everything this function touches is a
     * ref or a uniform, so none of it causes React to render. This is the whole
     * discipline of animating in React.
     */
    useFrame((_, delta) => {
        const material = materialRef.current;
        if (!material) return;

        // Frame cap for weak devices: half the frame rate, half the shader
        // cost. Nobody perceives a breathing gradient as stuttering at 30fps.
        if (quality.fpsCap) {
            lastDraw.current += delta;
            if (lastDraw.current < 1 / quality.fpsCap) return;
            lastDraw.current = 0;
        }

        material.uniforms.uTime.value += delta;
        material.uniforms.uScroll.value = scrollState.progress;
    });

    return (
        // A 1x1 plane scaled to the viewport. renderOrder 0 and depthTest off:
        // this is always behind everything and never occludes anything.
        <mesh scale={[size.width, size.height, 1]} renderOrder={0}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                depthTest={false}
                depthWrite={false}
            />
        </mesh>
    );
}
