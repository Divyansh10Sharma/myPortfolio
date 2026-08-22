import { useEffect, useRef } from "react";

// ============================================================
// A sparse drifting field behind the hero.
//
// Deliberately not a glowing constellation: square marks in --rule,
// hairline links, no colour. It reads as dust on a technical drawing.
//
// Costs nothing it doesn't have to — the loop stops when the hero is
// scrolled away, and the whole thing is skipped on small screens and
// under prefers-reduced-motion.
// ============================================================

const MIN_WIDTH = 768; // below this, not worth the battery
const LINK_DIST = 128; // px between marks before a hairline is drawn
const CURSOR_DIST = 170; // px around the pointer that links to it

const ParticleField = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const reduced =
            typeof matchMedia === "function" &&
            matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced || window.innerWidth < MIN_WIDTH) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        // Pull the palette from the design tokens rather than hardcoding.
        const styles = getComputedStyle(document.documentElement);
        const RULE = styles.getPropertyValue("--rule").trim() || "#C6CBD1";
        const GRAPHITE = styles.getPropertyValue("--graphite").trim() || "#5A626D";

        let width = 0;
        let height = 0;
        let dpr = 1;
        let marks = [];
        let frame = 0;
        let running = false;
        const pointer = { x: -9999, y: -9999, active: false };

        const resize = () => {
            // Deliberately 1x. This is dust and hairlines; rendering it at
            // 2x quadruples the fill rate for no perceptible gain, and the
            // clear-and-repaint dominates this component's cost.
            dpr = 1;
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.round(
                Math.min(58, Math.max(24, (width * height) / 30000))
            );
            marks = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.16,
                vy: (Math.random() - 0.5) * 0.16,
                size: Math.random() < 0.18 ? 2.5 : 1.5,
            }));
        };

        // Links are bucketed by strength and stroked as three paths rather
        // than one path per link — ~3 draw calls a frame instead of ~100.
        const BUCKETS = [0.18, 0.32, 0.5];
        const LINK_D2 = LINK_DIST * LINK_DIST;
        const CURSOR_D2 = CURSOR_DIST * CURSOR_DIST;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            for (const m of marks) {
                m.x += m.vx;
                m.y += m.vy;
                // Wrap, so the field never thins out at the edges.
                if (m.x < -10) m.x = width + 10;
                else if (m.x > width + 10) m.x = -10;
                if (m.y < -10) m.y = height + 10;
                else if (m.y > height + 10) m.y = -10;
            }

            const paths = [new Path2D(), new Path2D(), new Path2D()];
            for (let i = 0; i < marks.length; i++) {
                const a = marks[i];
                for (let j = i + 1; j < marks.length; j++) {
                    const b2 = marks[j];
                    const dx = a.x - b2.x;
                    const dy = a.y - b2.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 > LINK_D2) continue;
                    // Bucket on the squared distance — no sqrt needed.
                    const t = d2 / LINK_D2;
                    const bucket = t < 0.25 ? 2 : t < 0.6 ? 1 : 0;
                    paths[bucket].moveTo(a.x, a.y);
                    paths[bucket].lineTo(b2.x, b2.y);
                }
            }

            ctx.strokeStyle = RULE;
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                ctx.globalAlpha = BUCKETS[i];
                ctx.stroke(paths[i]);
            }

            // The pointer is just another node — links to whatever is close.
            if (pointer.active) {
                const near = new Path2D();
                for (const m of marks) {
                    const dx = m.x - pointer.x;
                    const dy = m.y - pointer.y;
                    if (dx * dx + dy * dy > CURSOR_D2) continue;
                    near.moveTo(m.x, m.y);
                    near.lineTo(pointer.x, pointer.y);
                }
                ctx.strokeStyle = GRAPHITE;
                ctx.globalAlpha = 0.32;
                ctx.stroke(near);
            }

            // Square marks, to match a page with no round corners.
            ctx.fillStyle = GRAPHITE;
            ctx.globalAlpha = 0.38;
            for (const m of marks) {
                if (m.size > 2) continue;
                ctx.fillRect(m.x - 0.75, m.y - 0.75, 1.5, 1.5);
            }
            ctx.globalAlpha = 0.6;
            for (const m of marks) {
                if (m.size <= 2) continue;
                ctx.fillRect(m.x - 1.25, m.y - 1.25, 2.5, 2.5);
            }

            ctx.globalAlpha = 1;
        };

        // The drift is slow enough that 30fps is indistinguishable from 60,
        // and it halves the work.
        const FRAME_MS = 1000 / 30;
        let last = 0;
        const loop = (now) => {
            frame = requestAnimationFrame(loop);
            if (now - last < FRAME_MS) return;
            last = now;
            draw();
        };
        const start = () => {
            if (running) return;
            running = true;
            frame = requestAnimationFrame(loop);
        };
        const stop = () => {
            running = false;
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
        };

        // Fade out over the first screen, and stop working once it's gone.
        let scrollFrame = 0;
        const applyScroll = () => {
            scrollFrame = 0;
            const opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.7));
            canvas.style.opacity = String(opacity);
            if (opacity <= 0.01) stop();
            else start();
        };
        const onScroll = () => {
            if (!scrollFrame) scrollFrame = requestAnimationFrame(applyScroll);
        };

        const onPointerMove = (e) => {
            if (e.pointerType === "touch") return;
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.active = true;
        };
        const onPointerLeave = () => {
            pointer.active = false;
        };

        const onResize = () => {
            if (window.innerWidth < MIN_WIDTH) {
                stop();
                ctx.clearRect(0, 0, width, height);
                return;
            }
            resize();
            applyScroll();
        };

        // Stay off the main thread through first paint and hydration —
        // starting immediately costs real blocking time for decoration.
        let idleHandle = 0;
        const begin = () => {
            resize();
            applyScroll();
        };
        const scheduleBegin = () => {
            if (typeof requestIdleCallback === "function") {
                idleHandle = requestIdleCallback(begin, { timeout: 1200 });
            } else {
                idleHandle = setTimeout(begin, 600);
            }
        };
        // Wait for load, then for the main thread to go quiet.
        if (document.readyState === "complete") scheduleBegin();
        else window.addEventListener("load", scheduleBegin, { once: true });

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.addEventListener("pointerleave", onPointerLeave);

        return () => {
            stop();
            if (typeof cancelIdleCallback === "function") cancelIdleCallback(idleHandle);
            clearTimeout(idleHandle);
            if (scrollFrame) cancelAnimationFrame(scrollFrame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerleave", onPointerLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            // Size gate in CSS so resizing is handled for free; the reduced-
            // motion gate is in the effect, which simply never paints.
            className="pointer-events-none fixed inset-x-0 top-0 z-0 hidden h-screen w-full md:block"
        />
    );
};

export default ParticleField;
