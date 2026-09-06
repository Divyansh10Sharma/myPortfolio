import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Color,
    Mesh,
    OrthographicCamera,
    PerspectiveCamera,
    PlaneGeometry,
    Points,
    Scene,
    ShaderMaterial,
    Vector2,
} from "three";

import backgroundVert from "../shaders/background.vert?raw";
import backgroundFrag from "../shaders/background.frag?raw";
import depthVert from "../shaders/depth.vert?raw";
import depthFrag from "../shaders/depth.frag?raw";

import { scrollState } from "../state/scroll";
import { backgroundLayer } from "../state/layers";

const COUNT = 260;
/** How far the camera drifts toward the pointer, in world units. */
const PARALLAX = 0.9;

interface DepthFieldProps {
    grain: number;
}

/**
 * The background, with actual depth.
 *
 * THE IDEA: until now the background was a painted backdrop — a flat picture of
 * atmosphere. This is a room instead. Marks are scattered through a volume in
 * front of the camera, and because the camera has real perspective, the near
 * ones are large and move a lot while the far ones are small and barely move.
 *
 * That difference in how much things move is the entire perception of depth.
 * It is why leaning your head sideways tells you which of two trees is closer,
 * and it is doing exactly the same job here.
 *
 * WHY IT HAS ITS OWN CAMERA: the canvas camera is orthographic and must stay
 * that way — `useDomPlane` depends on one world unit being one CSS pixel to
 * line the photograph and headline up with their DOM elements. Perspective
 * would break that. So this brings its own scene and camera and registers
 * itself to be drawn first, underneath everything else.
 */
export function DepthField({ grain }: DepthFieldProps) {
    const size = useThree((state) => state.size);
    const viewport = useThree((state) => state.viewport);

    const field = useMemo(() => {
        /* ── the flat gradient, still the backdrop ────────────────────
           Drawn first, with an orthographic camera, exactly as before. The
           depth marks are then drawn in front of it. It has to live here rather
           than in the main scene: the main scene is drawn last, and an opaque
           full-screen quad there would paint straight over this whole layer. */
        const backdropScene = new Scene();
        const backdropCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const backdropUniforms = {
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uResolution: { value: new Vector2(1, 1) },
            uGrainStrength: { value: grain },
        };

        const backdropMaterial = new ShaderMaterial({
            vertexShader: backgroundVert,
            fragmentShader: backgroundFrag,
            uniforms: backdropUniforms,
            depthTest: false,
            depthWrite: false,
        });

        const backdropGeometry = new PlaneGeometry(2, 2);
        backdropScene.add(new Mesh(backdropGeometry, backdropMaterial));

        /* ── the marks ────────────────────────────────────────────── */
        const depthScene = new Scene();
        const depthCamera = new PerspectiveCamera(50, 1, 0.1, 100);
        depthCamera.position.z = 10;

        const positions = new Float32Array(COUNT * 3);
        const scales = new Float32Array(COUNT);
        const seeds = new Float32Array(COUNT);

        for (let i = 0; i < COUNT; i++) {
            // A wide, shallow box. Wider than it is tall because the viewport
            // is, and deep enough that near and far marks differ obviously.
            positions[i * 3 + 0] = (Math.random() - 0.5) * 34;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
            // Never closer than z = 2 to the camera at z = 10: a mark right in
            // front of the lens becomes a huge grey square across the page.
            positions[i * 3 + 2] = -Math.random() * 24 + 2;

            scales[i] = 0.6 + Math.random() * 1.6;
            seeds[i] = Math.random();
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(positions, 3));
        geometry.setAttribute("aScale", new BufferAttribute(scales, 1));
        geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));

        const depthUniforms = {
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uPixelRatio: { value: 1 },
            // --graphite. No colour at all in this layer: the accent is spent
            // elsewhere and a tinted background would cheapen it.
            uColor: { value: new Color(0x8a929e) },
        };

        const depthMaterial = new ShaderMaterial({
            vertexShader: depthVert,
            fragmentShader: depthFrag,
            uniforms: depthUniforms,
            transparent: true,
            // Additive so overlapping marks brighten rather than occlude. On a
            // near-black page that reads as light rather than as paint.
            blending: AdditiveBlending,
            // No depth writing: the marks are transparent, and letting them
            // write depth makes whichever drew first punch holes in the rest.
            depthWrite: false,
        });

        const points = new Points(geometry, depthMaterial);
        depthScene.add(points);

        return {
            backdropScene,
            backdropCamera,
            backdropUniforms,
            backdropMaterial,
            backdropGeometry,
            depthScene,
            depthCamera,
            depthUniforms,
            depthMaterial,
            geometry,
        };
    }, [grain]);

    /* ── pointer parallax ─────────────────────────────────────────
       The camera leans a little toward the pointer. Moving the CAMERA rather
       than the marks is what makes it genuine parallax: near marks slide
       further than far ones automatically, because that is what perspective
       does. Moving the marks themselves would slide them all equally and the
       depth would collapse. */
    const pointer = useMemo(() => ({ x: 0, y: 0, tx: 0, ty: 0 }), []);

    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const onMove = (event: PointerEvent) => {
            pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
            pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [pointer]);

    /* ── keep both cameras and the backdrop sized to the canvas ── */
    useEffect(() => {
        field.depthCamera.aspect = size.width / size.height;
        field.depthCamera.updateProjectionMatrix(); // cached matrix; changing
        // aspect without this does nothing at all

        field.backdropUniforms.uResolution.value.set(
            size.width * viewport.dpr,
            size.height * viewport.dpr
        );
        field.depthUniforms.uPixelRatio.value = viewport.dpr;
    }, [field, size.width, size.height, viewport.dpr]);

    /* ── register to be drawn before the main scene ─────────────── */
    useEffect(() => {
        backgroundLayer.render = (gl) => {
            gl.render(field.backdropScene, field.backdropCamera);
            // autoClear off, or the marks wipe the backdrop we just drew.
            const previousAutoClear = gl.autoClear;
            gl.autoClear = false;
            gl.render(field.depthScene, field.depthCamera);
            gl.autoClear = previousAutoClear;
        };

        return () => {
            backgroundLayer.render = null;
        };
    }, [field]);

    /* ── release GPU memory ─────────────────────────────────────── */
    useEffect(() => {
        return () => {
            field.geometry.dispose();
            field.depthMaterial.dispose();
            field.backdropGeometry.dispose();
            field.backdropMaterial.dispose();
        };
    }, [field]);

    useFrame((_, delta) => {
        field.backdropUniforms.uTime.value += delta;
        field.backdropUniforms.uScroll.value = scrollState.progress;

        field.depthUniforms.uTime.value += delta;
        field.depthUniforms.uScroll.value = scrollState.progress;

        // Ease toward the pointer rather than tracking it. Frame-rate corrected
        // so the lag is the same at 30fps and 120fps.
        const ease = 1 - Math.pow(0.004, delta);
        pointer.x += (pointer.tx - pointer.x) * ease;
        pointer.y += (pointer.ty - pointer.y) * ease;

        field.depthCamera.position.x = pointer.x * PARALLAX;
        // Negated: pointer y grows downward, world y grows upward.
        field.depthCamera.position.y = -pointer.y * PARALLAX;
        // Keep looking at the middle of the field, so leaning the camera turns
        // it slightly rather than sliding it flat sideways.
        field.depthCamera.lookAt(0, 0, -8);
    });

    // Draws nothing into the main scene. Everything it owns is rendered by
    // PostProcessing, through the registry above.
    return null;
}
