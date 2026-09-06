import { useEffect, useRef, useState } from "react";
import { useLoadingProgress } from "../hooks/useLoadingProgress";
import { gsap } from "../lib/gsap";
import { profile } from "../data/content";

/**
 * The designed loading state.
 *
 * In the vanilla build, tracking progress meant counting assets by hand: a
 * counter, a total, a callback on the texture loader, a promise on the fonts.
 * Here it subscribes to Three's global loading manager instead, so it knows
 * about every texture the scene asks for without being told about any of them.
 *
 * The progress stays honest — it reflects real downloads, not an animation
 * pretending to be one.
 */
interface PreloaderProps {
    /**
     * Fired the instant the panel begins to lift, NOT when it finishes.
     *
     * This is the whole handoff. If the hero only starts once the loader is
     * gone, the two are separate events and the page reads as "loading screen,
     * then site". Starting the hero while the panel is still travelling makes
     * it look like the panel is pulling the page up behind it — one movement
     * instead of two.
     */
    onReveal: () => void;
    /** Fired when the panel is gone and can be unmounted. */
    onDone: () => void;
}

export function Preloader({ onReveal, onDone }: PreloaderProps) {
    const { progress, active } = useLoadingProgress();

    const rootRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLParagraphElement>(null);
    const barRef = useRef<HTMLSpanElement>(null);

    // The eased value lives in a ref, not state: it changes every frame while
    // loading. Only the displayed integer is state, because only that needs to
    // cause a re-render — and it changes at most 100 times, not 60 times a
    // second.
    const eased = useRef(0);
    const [shown, setShown] = useState(0);
    const [finished, setFinished] = useState(false);

    // Track the latest progress without making the animation effect depend on
    // it — otherwise the effect would tear down and restart on every update.
    const targetRef = useRef(0);
    targetRef.current = Math.max(targetRef.current, progress / 100);

    useEffect(() => {
        if (finished) return;

        let done = false;

        const finish = () => {
            if (done) return;
            done = true;
            setFinished(true);

            gsap.timeline({
                // Unmounted entirely, not just faded. A transparent full-screen
                // overlay left in place keeps swallowing every click on the
                // page, and that bug is invisible until someone reports that
                // nothing works.
                onComplete: onDone,
            })
                .to(countRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" })
                .to(barRef.current, { scaleX: 1, duration: 0.35, ease: "power2.inOut" }, 0)
                .to(
                    rootRef.current,
                    {
                        yPercent: -100,
                        duration: 1.1,
                        ease: "expo.inOut",
                        // The handoff. Everything below the panel starts moving
                        // now, while the panel is still on its way out.
                        onStart: onReveal,
                    },
                    0.35
                );
        };

        const tick = () => {
            eased.current += (targetRef.current - eased.current) * 0.08;
            setShown(Math.round(eased.current * 100));

            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${eased.current})`;
            }

            // 0.99 rather than 1: an eased value approaches its target without
            // ever exactly reaching it, so waiting for equality waits forever.
            if (targetRef.current >= 1 && eased.current > 0.99) finish();
        };

        gsap.ticker.add(tick);

        // A hard ceiling. If a texture never arrives — dead CDN, flaky
        // connection — the visitor must not be left staring at a counter.
        const ceiling = window.setTimeout(() => {
            targetRef.current = 1;
        }, 4000);

        return () => {
            gsap.ticker.remove(tick);
            window.clearTimeout(ceiling);
        };
    }, [finished, onDone, onReveal]);

    // Nothing is loading and nothing ever was — no textures on this device, for
    // instance. Let the ceiling handle it rather than hanging at zero.
    useEffect(() => {
        if (!active && progress === 0) {
            const id = window.setTimeout(() => (targetRef.current = 1), 600);
            return () => window.clearTimeout(id);
        }
    }, [active, progress]);

    return (
        <div className="preloader" ref={rootRef}>
            <p className="preloader__name">{profile.name}</p>
            <p className="preloader__count" ref={countRef}>
                {String(shown).padStart(3, "0")}
            </p>
            <div className="preloader__bar">
                <span ref={barRef} />
            </div>
        </div>
    );
}
