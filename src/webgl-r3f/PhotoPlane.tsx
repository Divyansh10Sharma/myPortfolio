import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2 } from "three";
import vertexShader from "../shaders/plane.vert?raw";
import fragmentShader from "../shaders/photo.frag?raw";
import { useDomPlane } from "../hooks/useDomPlane";

interface PhotoPlaneProps {
    /** The real <img> this plane shadows. It owns the layout and the alt text. */
    element: HTMLImageElement;
    src: string;
}

/**
 * Signature effect A — the photograph as a shader surface.
 *
 * Distortion is a lie about where to look: no pixel moves, each one simply
 * samples the texture from slightly the wrong place, pulled toward the pointer.
 *
 * The `element` prop is the React equivalent of what the vanilla version took
 * in its constructor. Same input, same job — this is what "props are
 * constructor arguments" means in practice.
 */
export function PhotoPlane({ element, src }: PhotoPlaneProps) {
    const materialRef = useRef<ShaderMaterial>(null);
    const { meshRef, measure, position } = useDomPlane(element);

    // Suspends until the image is decoded and uploaded. The <Suspense> boundary
    // in Scene.tsx catches that. useLoader reports to Three's global loading
    // manager, which is exactly what the preloader is subscribed to.
    const texture = useLoader(TextureLoader, src);
    texture.colorSpace = SRGBColorSpace; // the file is already sRGB-encoded;
    // without this it renders washed out

    // Refs, not state: these change on every pointer move and every frame.
    const hover = useRef(0); // where the effect actually is
    const hoverTarget = useRef(0); // where it is heading
    const mouse = useRef(new Vector2(0.5, 0.5));
    const revealed = useRef(false);

    const uniforms = useMemo(
        () => ({
            uTexture: { value: texture },
            uHover: { value: 0 },
            uMouse: { value: mouse.current },
            uTime: { value: 0 },
            uReveal: { value: 0 },
        }),
        [texture]
    );

    /**
     * Pointer listeners on the real DOM element, not on the mesh.
     *
     * R3F can raycast pointer events onto meshes, and it is tempting to use
     * that. Listening on the element is better here: the browser does the
     * hit-testing, it stays correct however the page reflows, and it costs no
     * per-frame raycasting at all.
     */
    useEffect(() => {
        const onEnter = () => (hoverTarget.current = 1);
        const onLeave = () => (hoverTarget.current = 0);
        const onMove = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect();
            mouse.current.set(
                (event.clientX - rect.left) / rect.width,
                // Flipped: DOM y grows down, texture coordinates grow up.
                1 - (event.clientY - rect.top) / rect.height
            );
        };

        element.addEventListener("pointerenter", onEnter);
        element.addEventListener("pointerleave", onLeave);
        element.addEventListener("pointermove", onMove);

        // Cleanup — the vanilla dispose(), in its React shape.
        return () => {
            element.removeEventListener("pointerenter", onEnter);
            element.removeEventListener("pointerleave", onLeave);
            element.removeEventListener("pointermove", onMove);
        };
    }, [element]);

    // Measure once the texture is in and the layout has settled, then on every
    // resize. Never per frame.
    useEffect(() => {
        measure();
        // The real image can stop painting now that we are drawing it.
        element.classList.add("is-webgl");

        window.addEventListener("resize", measure);
        return () => {
            window.removeEventListener("resize", measure);
            element.classList.remove("is-webgl");
        };
    }, [measure, element, texture]);

    useFrame((_, delta) => {
        const material = materialRef.current;
        const mesh = meshRef.current;
        if (!material || !mesh) return;

        const visible = position();
        mesh.visible = visible;
        if (!visible) return;

        // Chase the target rather than jumping to it — the same lerp as the
        // smooth scroll. Scaled by delta so the speed is identical at 30fps and
        // 120fps, which a raw per-frame lerp would not be.
        const ease = 1 - Math.pow(0.001, delta);
        hover.current += (hoverTarget.current - hover.current) * ease;

        material.uniforms.uHover.value = hover.current;
        material.uniforms.uTime.value += delta;

        if (!revealed.current) revealed.current = true;
        if (material.uniforms.uReveal.value < 1) {
            material.uniforms.uReveal.value = Math.min(
                1,
                material.uniforms.uReveal.value + delta * 0.8
            );
        }
    });

    return (
        <mesh ref={meshRef} renderOrder={1}>
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
