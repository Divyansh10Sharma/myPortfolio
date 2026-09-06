/**
 * Preloader.
 *
 * A designed loading state rather than a spinner: the name, a counter, and a
 * hairline that fills. It exists for a specific reason — the headline reveal
 * and the photograph both need their assets before they can play, and without
 * a loading state the visitor watches an empty black page for that time and
 * assumes the site is broken.
 *
 * The progress is honest. It tracks two real things — fonts and the
 * photograph — rather than animating a fake bar to 90% and waiting, which is
 * the usual dishonest version.
 */

import gsap from "gsap";

export default function initPreloader({ onComplete }) {
    const root = document.querySelector(".preloader");
    const counter = root.querySelector(".preloader__count");
    const bar = root.querySelector(".preloader__bar span");

    // If the visitor has asked for less motion, do not make them sit through a
    // loading animation. Show the page.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let displayed = 0; // what the counter currently shows
    let target = 0; // what it should show
    let done = false;

    /** @param {number} value 0–1 */
    function setProgress(value) {
        target = Math.max(target, Math.min(1, value)); // never go backwards
    }

    function finish() {
        if (done) return;
        done = true;

        const timeline = gsap.timeline({
            onComplete: () => {
                root.remove(); // out of the DOM entirely, not just invisible —
                // a full-screen overlay left in place would keep
                // swallowing clicks
                onComplete?.();
            },
        });

        timeline
            .to(counter, { opacity: 0, duration: 0.4, ease: "power2.out" })
            .to(bar, { scaleX: 1, duration: 0.35, ease: "power2.inOut" }, 0)
            // The panel lifts away rather than fading. A fade would show the
            // page arriving through a grey haze; a wipe hands it over cleanly.
            .to(
                root,
                { yPercent: -100, duration: 1.1, ease: "expo.inOut" },
                0.35
            );
    }

    // The counter eases toward the real progress instead of snapping to it, so
    // a resource that arrives instantly still reads as loading rather than
    // flashing past.
    function update() {
        if (done) return;

        displayed += (target - displayed) * 0.08;

        const percent = Math.round(displayed * 100);
        counter.textContent = String(percent).padStart(3, "0");
        bar.style.transform = `scaleX(${displayed})`;

        // 0.99 rather than 1: the eased value approaches its target without
        // ever exactly reaching it, so waiting for equality would wait forever.
        if (target >= 1 && displayed > 0.99) finish();
    }

    if (reduceMotion) {
        root.remove();
        // Deferred by one turn of the event loop, not called straight away:
        // the caller is still inside initPreloader() and has not finished
        // setting up the things startIntro() expects to exist.
        setTimeout(() => onComplete?.(), 0);
        return { setProgress: () => {}, update: () => {}, skipped: true };
    }

    return { setProgress, update, finish };
}
