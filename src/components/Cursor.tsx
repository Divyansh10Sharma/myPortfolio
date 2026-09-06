import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

const LERP = 0.16; // fraction of the remaining gap covered each frame
const SIZE = 34; // must match .cursor in the stylesheet

/**
 * A ring that chases the real pointer.
 *
 * The lag is the entire effect. A ring locked exactly to the pointer reads as a
 * cheap CSS trick; one trailing very slightly behind feels like a physical
 * object on a short string.
 *
 * Everything here is refs and direct style writes. Putting the cursor position
 * in state would re-render this component sixty times a second for the rest of
 * the session — the classic way to make a React site feel heavy.
 *
 * The real system cursor stays visible on purpose. Hiding it is fashionable and
 * genuinely bad: people lose track of where they are pointing.
 */
export function Cursor() {
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Touch devices have no pointer to follow, and hover means nothing.
        if (window.matchMedia("(pointer: coarse)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ring = ringRef.current;
        if (!ring) return;

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let x = targetX;
        let y = targetY;
        let visible = false;

        const onMove = (event: PointerEvent) => {
            targetX = event.clientX;
            targetY = event.clientY;

            if (!visible) {
                // Jump to the pointer the first time rather than gliding in
                // from the centre of the screen, which looks like a bug.
                x = targetX;
                y = targetY;
                visible = true;
                ring.classList.add("is-visible");
            }

            // closest() walks up the tree, so this still works when the pointer
            // is over a <span> inside a link.
            const target = event.target as Element | null;

            // Three states rather than one, because "you can click this" and
            // "this will take you somewhere else" are different promises and
            // the cursor may as well say which.
            const external = target?.closest?.('a[target="_blank"]');
            const expandable = target?.closest?.("summary");
            const interactive = target?.closest?.("a, button, summary, [role='button']");

            ring.classList.toggle("is-active", Boolean(interactive));
            ring.classList.toggle("is-external", Boolean(external));
            ring.classList.toggle("is-expandable", Boolean(expandable) && !external);
        };

        const onLeave = () => {
            visible = false;
            ring.classList.remove("is-visible");
        };

        const tick = () => {
            x += (targetX - x) * LERP;
            y += (targetY - y) * LERP;
            // translate3d, not left/top: transforms are handled by the
            // compositor and never trigger layout.
            ring.style.transform = `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0)`;
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerleave", onLeave);
        gsap.ticker.add(tick);

        return () => {
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerleave", onLeave);
            gsap.ticker.remove(tick);
        };
    }, []);

    return <div className="cursor" ref={ringRef} aria-hidden="true" />;
}
