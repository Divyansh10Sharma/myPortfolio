import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Background } from "./Background";
import { PhotoPlane } from "./PhotoPlane";
import { TextPlane } from "./TextPlane";
import { PostProcessing } from "./PostProcessing";
import type { Quality } from "../hooks/useQuality";

interface SceneProps {
    quality: Quality;
    reducedMotion: boolean;
    /** The real DOM elements the planes shadow. Null until React has mounted them. */
    headline: HTMLElement | null;
    portrait: HTMLImageElement | null;
    portraitSrc: string;
}

/**
 * Everything WebGL, in one component.
 *
 * <Canvas> is the whole reason R3F exists. It creates the renderer, the scene,
 * the camera, the resize observer and the requestAnimationFrame loop, and tears
 * all of them down on unmount. In the vanilla build that was Stage.js — roughly
 * 200 lines that had to be written and, more importantly, remembered.
 *
 * `orthographic` with the default camera gives us exactly the setup the vanilla
 * version built by hand: a frustum sized to the viewport, so one world unit is
 * one CSS pixel. That is what makes useDomPlane's arithmetic so simple.
 */
export function Scene({
    quality,
    reducedMotion,
    headline,
    portrait,
    portraitSrc,
}: SceneProps) {
    // A touch screen has no pointer to warp the photograph toward, and a narrow
    // viewport has no room for the headline to bow in. On those devices the
    // real <img> and real <h1> are simply left alone — what remains is the
    // plain, fast, correct page rather than a degraded one with holes in it.
    const showEffects = !reducedMotion && !quality.small;

    // Post-processing costs a second full-screen draw every frame. Worth it on
    // a desktop GPU, not on a mid-range phone — and pointless under reduced
    // motion, where the velocity-driven half of it never fires.
    const usePost = !reducedMotion && !quality.weak && !quality.small;

    return (
        <Canvas
            orthographic
            camera={{ position: [0, 0, 10], near: 0.1, far: 100 }}
            dpr={quality.pixelRatio}
            gl={{
                antialias: false, // nothing here has a hard edge to smooth
                alpha: false,
                powerPreference: "high-performance",
            }}
            // Under reduced motion the loop runs only when something actually
            // changes, instead of sixty times a second forever.
            frameloop={reducedMotion ? "demand" : "always"}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
            }}
            aria-hidden="true"
        >
            {/* When the post pass is running it lays grain over the whole
                image, so the background must stop drawing its own or the two
                stack up and the page looks like static. */}
            <Background quality={quality} grain={usePost ? 0 : quality.grain} />

            {/* Suspense catches the texture load. Until it resolves, nothing
                inside renders — and the real <img> underneath is still visible,
                so there is never a gap where the photograph should be. */}
            {usePost && (
                <PostProcessing grain={quality.grain} aberration={0.006} />
            )}

            <Suspense fallback={null}>
                {showEffects && portrait && (
                    <PhotoPlane element={portrait} src={portraitSrc} />
                )}
                {showEffects && headline && (
                    <TextPlane element={headline} pixelRatio={quality.pixelRatio} />
                )}
            </Suspense>
        </Canvas>
    );
}
