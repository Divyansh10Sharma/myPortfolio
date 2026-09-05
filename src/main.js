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

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Only now is it safe for CSS to hide things pre-animation.
document.documentElement.classList.add("js");

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
