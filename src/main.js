/**
 * Sprint 1 motion layer: smooth scroll, headline reveal, scroll reveals.
 *
 * Everything here is an enhancement on top of a page that already works. The
 * HTML is real text and the CSS lays it out; if this file fails to load, the
 * site still reads and navigates. That is why the `js` class below is added
 * from JavaScript rather than sitting in the markup — the rules that hide
 * elements before they animate only exist once we know we can un-hide them.
 */

import "./style.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import Lenis from "lenis";
import Stage from "./webgl/Stage.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Only now is it safe for CSS to hide things pre-animation.
document.documentElement.classList.add("js");

// The browser restores your old scroll position on reload. With a smooth
// scroller running, that restore happens before Lenis exists, so Lenis starts
// out believing it is at the top while the page is actually halfway down — and
// every scroll-triggered reveal below stays hidden forever. We take the scroll
// position over and restore it ourselves once everything is running.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

/* ── shader background ─────────────────────────────────────────
   Started before anything else so it is painting from the first frame, and
   wrapped because WebGL can be unavailable for reasons that have nothing to do
   with our code: an old device, a blocklisted driver, a hardened browser, or
   simply too many live WebGL contexts open in other tabs. The page underneath
   is the same near-black, so losing this costs a gradient and nothing else. */

let stage = null;
const canvas = document.querySelector("#webgl");

try {
    stage = new Stage(canvas);
    stage.start();
    if (import.meta.env.DEV) window.stage = stage; // poke it from the console
} catch (error) {
    console.warn("WebGL unavailable — running without the shader background.", error);
    canvas.remove();
}

/* ── smooth scroll ─────────────────────────────────────────────
   Lenis intercepts the wheel and animates the scroll position itself, so a
   flick of the wheel decays over ~1.2s instead of stopping dead. That glide is
   most of the "expensive" feeling, and in Sprint 2 the same scroll value gets
   handed to the shader. */

let lenis = null;

if (!reduceMotion) {
    lenis = new Lenis({
        duration: 1.2, // seconds for the scroll to settle. Above ~1.6 it starts
        // feeling broken rather than smooth.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential
        // out: fast start, long tail
        smoothWheel: true,

        // Touch is left alone deliberately. Phone browsers already have their
        // own momentum scrolling and fighting it feels laggy and wrong.
        syncTouch: false,
    });

    // One loop for the whole page, not two. GSAP already runs a
    // requestAnimationFrame ticker, so Lenis is driven from it rather than
    // starting a second loop that competes for the same frame.
    gsap.ticker.add((time) => lenis.raf(time * 1000)); // GSAP counts seconds,
    // Lenis wants milliseconds
    gsap.ticker.lagSmoothing(0);

    // Lenis moves the page without firing native scroll events the way
    // ScrollTrigger expects, so it has to be told when the position changed.
    lenis.on("scroll", ScrollTrigger.update);

    // The same scroll value goes into the shader. Note what is being handed
    // over: a single number between 0 and 1, not pixels. The shader has no idea
    // how tall the page is, and does not need to.
    lenis.on("scroll", ({ progress }) => stage?.setScroll(progress));
} else if (stage) {
    // Reduced motion: no Lenis, so read the native scroll position instead. The
    // background still responds to where the visitor is on the page — it just
    // does not animate on its own.
    const onNativeScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        stage.setScroll(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    onNativeScroll();
}

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

/* ── headline ──────────────────────────────────────────────────
   SplitText chops the h1 into lines, each wrapped in a mask with
   overflow:hidden. Animating the line up from below its own mask makes it look
   like the text is rising out from behind the page rather than fading in.

   Fonts first: splitting before the webfont loads measures the fallback font
   and puts the line breaks in the wrong places. */

document.fonts.ready.then(() => {
    const headline = document.querySelector("[data-split]");

    if (reduceMotion || !headline) {
        gsap.set(".reveal", { opacity: 1 });
        return;
    }

    const split = new SplitText(headline, {
        type: "lines",
        linesClass: "line",
        mask: "lines", // SplitText builds the overflow-hidden wrapper for us
    });

    const intro = gsap.timeline();

    intro
        .from(split.lines, {
            yPercent: 115, // just past 100 so no descender peeks out of the mask
            duration: 1.4, // CLAUDE.md's 0.8–1.6s band, at the slow end because
            // this is the first thing anyone sees
            ease: "expo.out",
            stagger: 0.09,
        })
        .fromTo(
            ".hero .reveal",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.12 },
            0.35 // overlap with the headline rather than waiting for it to finish
        );
});

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
                    start: "top 88%", // fire slightly before it reaches the fold
                    once: true, // never replay: re-animating on scroll-up is
                    // the cheapest way to make a site feel restless
                },
            }
        );
    });
} else {
    gsap.set(".reveal", { opacity: 1 });
}

/* ── landing part-way down the page ────────────────────────────
   Someone opens a link ending in #systems, or reloads after scrolling. The
   reveals below are all still at opacity 0, and their triggers will never fire
   because the scroll event that would have fired them already happened before
   any of this code existed.

   So: jump to the target with the scroller that owns scrolling, then tell
   ScrollTrigger to re-measure. On refresh it fires every trigger already past
   its start point, which reveals everything above the current position. */

function restoreScrollPosition() {
    const hash = location.hash;
    const target = hash && hash.length > 1 ? document.querySelector(hash) : null;

    if (target) {
        if (lenis) lenis.scrollTo(target, { offset: -60, immediate: true });
        else target.scrollIntoView();
    }

    ScrollTrigger.refresh();
}

// After load, not before: images and fonts change element positions, and
// measuring first means measuring the wrong thing.
window.addEventListener("load", restoreScrollPosition);

/* A last-resort guarantee. If anything above goes wrong — a thrown error, a
   browser we did not anticipate, a trigger that never fires — content must
   never stay invisible. The animation is decoration; the words are not.

   Scoped deliberately: only elements the visitor can already see, and only
   after killing the trigger that owns them. Revealing an element without
   killing its trigger would leave the trigger free to fire later and animate it
   from zero again, which is a flicker rather than a fix. */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelectorAll(".reveal").forEach((el) => {
            if (getComputedStyle(el).opacity !== "0") return;
            if (el.getBoundingClientRect().top > window.innerHeight) return; // still below the fold, fine

            ScrollTrigger.getAll().forEach((t) => t.trigger === el && t.kill());
            gsap.set(el, { opacity: 1, y: 0 });
        });
    }, 2500);
});

/* ── nav active state ──────────────────────────────────────────
   Highlights the section currently under the nav. IntersectionObserver rather
   than a scroll handler, so the browser does the work off the main thread. */

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
        // A band across the upper third of the viewport: a section is "current"
        // once its top passes the nav, not when it is fully on screen.
        rootMargin: "-60px 0px -66% 0px",
    }
);

sections.forEach((section) => section && observer.observe(section));
