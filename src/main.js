/**
 * Entry point and motion layer.
 *
 * Order matters here, and it is roughly: prove JavaScript works, start the
 * shader background, start the smooth scroller, load what the reveals need,
 * then hand over from the preloader and let everything play.
 *
 * Everything is an enhancement on top of a page that already works. The HTML is
 * real text and the CSS lays it out; if this file fails to load, the site still
 * reads and navigates.
 */

import "./style.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Stage from "./webgl/Stage.js";
import initCursor from "./cursor.js";
import initPreloader from "./preloader.js";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Only now is it safe for CSS to hide things pre-animation.
document.documentElement.classList.add("js");

// The browser restores your old scroll position on reload. With a smooth
// scroller running, that restore happens before Lenis exists, so Lenis starts
// out believing it is at the top while the page is actually halfway down — and
// every scroll-triggered reveal below stays hidden. We take it over ourselves.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

/* ── WebGL ─────────────────────────────────────────────────────
   Wrapped because WebGL can be unavailable for reasons that have nothing to do
   with our code: an old device, a blocklisted driver, a hardened browser, or
   too many live contexts in other tabs. Losing it costs a gradient and two
   effects — the photograph and the headline are real DOM underneath. */

let stage = null;
const canvas = document.querySelector("#webgl");

try {
    stage = new Stage(canvas);
} catch (error) {
    console.warn("WebGL unavailable — running without the shader layer.", error);
    canvas.remove();
}

/* ── preloader ─────────────────────────────────────────────────
   Honest progress: it tracks the two things the opening actually waits on, the
   webfonts and the photograph, rather than animating a fake bar. */

let assetsLoaded = 0;
const ASSET_COUNT = 2;

const preloader = initPreloader({
    onComplete: () => startIntro(),
});

function assetReady() {
    assetsLoaded += 1;
    preloader.setProgress(assetsLoaded / ASSET_COUNT);
}

/* ── smooth scroll ─────────────────────────────────────────────
   Lenis intercepts the wheel and animates the scroll position itself, so a
   flick decays over ~1.2s instead of stopping dead. That glide is most of the
   "expensive" feeling, and the same scroll value drives the shaders. */

let lenis = null;

if (!reduceMotion) {
    lenis = new Lenis({
        duration: 1.2, // seconds to settle. Above ~1.6 it feels broken.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch is left alone deliberately: phone browsers already have their
        // own momentum scrolling and fighting it feels laggy and wrong.
        syncTouch: false,
    });

    // One loop for the whole page, not several. GSAP already runs a
    // requestAnimationFrame ticker, so Lenis, the cursor and the preloader are
    // all driven from it rather than each starting a competing loop.
    gsap.ticker.add((time) => lenis.raf(time * 1000)); // GSAP counts seconds,
    // Lenis wants milliseconds
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    // Scroll goes to the shaders as three numbers: how far down as 0–1, the
    // absolute pixel position so the planes can be placed, and how fast we are
    // moving so the headline knows how hard to bend.
    lenis.on("scroll", ({ progress, scroll, velocity }) => {
        stage?.setScroll(progress, scroll, velocity);
    });
} else if (stage) {
    // Reduced motion: no Lenis, so read the native scroll position instead.
    const onNativeScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        stage.setScroll(max > 0 ? window.scrollY / max : 0, window.scrollY, 0);
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    onNativeScroll();
}

/* ── custom cursor ─────────────────────────────────────────── */

const cursor = initCursor();

// Both of these want a frame tick and neither deserves its own loop.
gsap.ticker.add(() => {
    cursor?.update();
    preloader.update();
});

/* ── in-page links ─────────────────────────────────────────────
   Anchor clicks must go through Lenis, otherwise the browser jumps instantly
   and Lenis's idea of the scroll position desyncs from the real one. */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target || !lenis) return; // reduced motion: let the browser do it
        event.preventDefault();
        lenis.scrollTo(target, { offset: -60 }); // clear the fixed nav
    });
});

/* ── the two signature effects ─────────────────────────────────
   Both are WebGL planes drawn exactly over a real DOM element, which stays in
   place owning the layout, the text and the fallback. See DomPlane.js for the
   coordinate translation, which is the only genuinely fiddly part.

   Effect B (headline) is at the top of the page, effect A (photograph) is
   directly below it in the Overview section — deliberately one after the other
   so they can be compared before one of them is cut. */

const headline = document.querySelector("[data-split]");
const portrait = document.querySelector(".portrait img");

/**
 * Should this device run the two signature effects at all?
 *
 * They are the most expensive thing on the site — two extra full-screen-ish
 * shader passes with a texture each — and on a phone one of them is pointless
 * anyway: the photograph warps toward a pointer, and a touch screen has no
 * pointer to warp toward. There is nothing to hover.
 *
 * So on a weak or touch device we keep the shader background, which is cheap
 * and carries the whole mood, and drop the two planes. The real <img> and the
 * real <h1> are already sitting underneath them, so what is left is not a
 * degraded version with holes in it — it is the plain, fast, correct page.
 */
const canRunEffects = Boolean(
    !reduceMotion &&
        stage &&
        // A touch screen has no pointer to warp the photograph toward, and a
        // narrow viewport has no room for the headline to bow in.
        !stage.quality.small
);

// Fonts first. The headline is painted into a canvas at its computed font size,
// and measuring before the webfont arrives puts the line breaks in the wrong
// places and paints the fallback face.
document.fonts.ready.then(() => {
    // Under reduced motion the planes are never created at all: the CSS keeps
    // the plain <h1> and the plain <img> visible, and drawing a second copy
    // underneath them would be waste.
    if (canRunEffects && headline) stage.addText(headline);
    assetReady();
});

if (canRunEffects && portrait) {
    const photo = stage.addPhoto(portrait);

    // The texture load is the other half of the progress bar.
    const check = setInterval(() => {
        if (photo.ready) {
            clearInterval(check);
            assetReady();
        }
    }, 60);
} else {
    assetReady(); // nothing to wait for
}

/* ── the opening ───────────────────────────────────────────────
   Runs once the preloader has lifted away. */

function startIntro() {
    stage?.refresh();
    stage?.start();
    stage?.text?.startReveal();

    if (reduceMotion) {
        gsap.set(".reveal", { opacity: 1 });
        return;
    }

    gsap.fromTo(
        ".hero .reveal",
        { opacity: 0, y: 24 },
        {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            stagger: 0.12,
            delay: 0.25, // let the headline start rising first
        }
    );
}

// A hard ceiling on the loading screen. If a font or the photograph never
// arrives — a dead CDN, a flaky connection — the visitor must not be left
// staring at a counter. Four seconds, then we go regardless.
setTimeout(() => preloader.setProgress(1), 4000);

/* ── scroll reveals ────────────────────────────────────────────
   Everything below the hero fades up once, when it first arrives. */

if (!reduceMotion) {
    gsap.utils.toArray(".section .reveal, .foot").forEach((el) => {
        gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    once: true, // re-animating on scroll-up makes a site restless
                },
            }
        );
    });
} else {
    gsap.set(".reveal", { opacity: 1 });
}

/* ── landing part-way down the page ────────────────────────────
   Someone opens a link ending in #systems, or reloads after scrolling. Jump to
   the target with the scroller that owns scrolling, then re-measure: on refresh
   ScrollTrigger fires every trigger already past its start point. */

function restoreScrollPosition() {
    const hash = location.hash;
    const target = hash && hash.length > 1 ? document.querySelector(hash) : null;

    if (target) {
        if (lenis) lenis.scrollTo(target, { offset: -60, immediate: true });
        else target.scrollIntoView();
    }

    ScrollTrigger.refresh();
    stage?.refresh(); // the planes cached measurements that may now be wrong
}

// After load, not before: images and fonts change element positions, and
// measuring first means measuring the wrong thing.
window.addEventListener("load", restoreScrollPosition);

/* A last-resort guarantee. If anything above goes wrong — a thrown error, a
   browser we did not anticipate, a trigger that never fires — content must
   never stay invisible. The animation is decoration; the words are not.

   Scoped deliberately: only elements the visitor can already see, and only
   after killing the trigger that owns them, so nothing can animate it from
   zero again afterwards and produce a flicker. */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelectorAll(".reveal").forEach((el) => {
            if (getComputedStyle(el).opacity !== "0") return;
            if (el.getBoundingClientRect().top > window.innerHeight) return;

            ScrollTrigger.getAll().forEach((t) => t.trigger === el && t.kill());
            gsap.set(el, { opacity: 1, y: 0 });
        });

        // The same principle applied to the two signature effects. Both hide a
        // real DOM element and draw a shader over the top. If the shader never
        // got as far as revealing itself — a stalled loop, a texture that never
        // decoded, a device we did not anticipate — the visitor would be left
        // looking at a hole where the headline or the photograph should be.
        // So: if the plane is not actually showing anything by now, give the
        // DOM element back.
        if (stage?.text && stage.text.material.uniforms.uReveal.value < 0.05) {
            headline?.classList.remove("is-webgl");
        }
        if (stage?.photo && stage.photo.material.uniforms.uReveal.value < 0.05) {
            portrait?.classList.remove("is-webgl");
        }
    }, 2500);
});

/* ── nav active state ──────────────────────────────────────────
   IntersectionObserver rather than a scroll handler, so the browser does the
   work off the main thread. */

const navLinks = document.querySelectorAll(".nav__links a");
const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href")));

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = `#${entry.target.id}`;
            navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
        });
    },
    {
        // A band across the upper third: a section is "current" once its top
        // passes the nav, not when it is fully on screen.
        rootMargin: "-60px 0px -66% 0px",
    }
);

sections.forEach((section) => section && observer.observe(section));

if (import.meta.env.DEV) window.stage = stage; // poke it from the console
