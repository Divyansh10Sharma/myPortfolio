import { useMemo } from "react";

export interface Quality {
    /** Slow machine: governs how hard we push the shader. */
    weak: boolean;
    /** Touch screen: governs whether hover effects mean anything at all. */
    coarse: boolean;
    /** Touch, or too narrow for the effects to have room. */
    small: boolean;
    pixelRatio: number;
    /** 0 means uncapped. */
    fpsCap: number;
    grain: number;
}

/**
 * Decide once how hard we are allowed to push this device.
 *
 * useMemo with an empty dependency array, so it runs on mount and never again.
 * These values cannot change without a reload, and re-deriving them every
 * render would be waste.
 *
 * There is no reliable way to ask a browser how fast its GPU is. Everything
 * here is a proxy and every proxy is wrong sometimes.
 */
export function useQuality(): Quality {
    return useMemo(() => {
        const cores = navigator.hardwareConcurrency || 8;

        // deviceMemory is Chrome-only. Absent is UNKNOWN, not low — defaulting
        // it to a small number would quietly mark every Firefox and Safari
        // desktop as a weak device and switch the effects off for them.
        const memory = (navigator as Navigator & { deviceMemory?: number })
            .deviceMemory;
        const knownLowMemory = typeof memory === "number" && memory <= 4;

        const coarse = window.matchMedia("(pointer: coarse)").matches;

        const weak = cores <= 4 || knownLowMemory;
        const small = coarse || window.innerWidth < 800;
        const degraded = weak || small;

        return {
            weak,
            coarse,
            small,
            // A 3x phone screen is nine times the pixels for the same physical
            // area, and these shaders run per pixel. This is the single biggest
            // performance lever available.
            pixelRatio: degraded ? 1 : Math.min(window.devicePixelRatio, 2),
            fpsCap: degraded ? 30 : 0,
            grain: degraded ? 0.055 : 0.075,
        };
    }, []);
}
