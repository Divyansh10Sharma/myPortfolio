import { useEffect, useState } from "react";
import { DefaultLoadingManager } from "three";

export interface LoadingProgress {
    /** 0–100. */
    progress: number;
    /** Is anything still in flight? */
    active: boolean;
}

/**
 * How much of the scene's assets have loaded.
 *
 * drei ships a `useProgress` that does this, but pulling in the whole of drei
 * for one hook cost about 100KB gzipped — on a site whose audience is on
 * patchy 4G, that is a bad trade for twenty lines.
 *
 * Three keeps a global loading manager that every loader reports to by default,
 * so this is really just a subscription to something that already exists.
 */
export function useLoadingProgress(): LoadingProgress {
    const [state, setState] = useState<LoadingProgress>({
        progress: 0,
        active: false,
    });

    useEffect(() => {
        const manager = DefaultLoadingManager;

        // Keep whatever handlers are already attached rather than clobbering
        // them — the manager is global, and stamping on it is how you break
        // something else's loading screen.
        const previousStart = manager.onStart;
        const previousProgress = manager.onProgress;
        const previousLoad = manager.onLoad;
        const previousError = manager.onError;

        manager.onStart = (url, loaded, total) => {
            setState({ progress: total > 0 ? (loaded / total) * 100 : 0, active: true });
            previousStart?.(url, loaded, total);
        };

        manager.onProgress = (url, loaded, total) => {
            setState({ progress: total > 0 ? (loaded / total) * 100 : 0, active: true });
            previousProgress?.(url, loaded, total);
        };

        manager.onLoad = () => {
            setState({ progress: 100, active: false });
            previousLoad?.();
        };

        // A failed texture must still end the loading screen. Reporting 100 on
        // error is deliberate: the visitor should get the page, not a counter
        // stuck at 40 forever.
        manager.onError = (url) => {
            setState({ progress: 100, active: false });
            previousError?.(url);
        };

        return () => {
            manager.onStart = previousStart;
            manager.onProgress = previousProgress;
            manager.onLoad = previousLoad;
            manager.onError = previousError;
        };
    }, []);

    return state;
}
