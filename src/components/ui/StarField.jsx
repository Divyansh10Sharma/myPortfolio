// ============================================================
// StarField.jsx — Fixed cosmic star background
// Generates random star positions as CSS for performance
// ============================================================

import { useMemo } from "react";

// Generate a random star object
const randomStar = (id) => ({
    id,
    top:     `${Math.random() * 100}%`,
    left:    `${Math.random() * 100}%`,
    size:    Math.random() * 2.5 + 0.5,              // 0.5px – 3px
    opacity: Math.random() * 0.7 + 0.2,              // 0.2 – 0.9
    delay:   `${(Math.random() * 6).toFixed(2)}s`,   // staggered twinkle
    duration:`${(Math.random() * 4 + 2).toFixed(2)}s`,
});

// Shooting meteor config
const randomMeteor = (id) => ({
    id,
    top:      `${Math.random() * 50}%`,
    left:     `${Math.random() * 80 + 10}%`,
    delay:    `${(Math.random() * 12).toFixed(2)}s`,
    duration: `${(Math.random() * 2 + 1).toFixed(2)}s`,
    angle:    Math.random() * 30 + 20,   // 20°–50° downward
});

const StarField = () => {
    // Memoize so stars don't re-randomize on every render
    const stars   = useMemo(() => Array.from({ length: 250 }, (_, i) => randomStar(i)),   []);
    const meteors = useMemo(() => Array.from({ length: 6   }, (_, i) => randomMeteor(i)), []);

    return (
        <div
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        >
            {/* ── Deep space gradient ─────────────────────── */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse at 20% 50%, rgba(145,94,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.06) 0%, transparent 60%), linear-gradient(180deg, #050816 0%, #0a0d1e 100%)",
                }}
            />

            {/* ── Aurora nebula blobs ──────────────────────── */}
            <div
                className="absolute"
                style={{
                    top: "10%", left: "5%", width: "40%", height: "40%",
                    background: "radial-gradient(ellipse, rgba(145,94,255,0.07) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }}
            />
            <div
                className="absolute"
                style={{
                    bottom: "15%", right: "5%", width: "35%", height: "35%",
                    background: "radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }}
            />
            <div
                className="absolute"
                style={{
                    top: "50%", left: "40%", width: "30%", height: "30%",
                    background: "radial-gradient(ellipse, rgba(158,188,128,0.04) 0%, transparent 70%)",
                    filter: "blur(80px)",
                }}
            />

            {/* ── Stars ───────────────────────────────────── */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full"
                    style={{
                        top:      star.top,
                        left:     star.left,
                        width:    `${star.size}px`,
                        height:   `${star.size}px`,
                        opacity:  star.opacity,
                        background: star.size > 2 ? "#00d4ff" : "#ffffff",
                        boxShadow: star.size > 1.8
                            ? `0 0 ${star.size * 3}px rgba(0, 212, 255, 0.8)`
                            : "none",
                        animation: `starTwinkle ${star.duration} ${star.delay} ease-in-out infinite alternate`,
                    }}
                />
            ))}

            {/* ── Shooting meteors ─────────────────────────── */}
            {meteors.map((m) => (
                <div
                    key={m.id}
                    className="absolute"
                    style={{
                        top:    m.top,
                        left:   m.left,
                        width:  "120px",
                        height: "1px",
                        background: "linear-gradient(90deg, rgba(145,94,255,0), rgba(145,94,255,0.9))",
                        transform: `rotate(${m.angle}deg)`,
                        animation: `meteorShoot ${m.duration} ${m.delay} linear infinite`,
                        boxShadow: "0 0 6px rgba(145,94,255,0.8)",
                    }}
                />
            ))}

            {/* Inline keyframes for star & meteor animations */}
            <style>{`
                @keyframes starTwinkle {
                    from { opacity: var(--from-op, 0.2); transform: scale(1); }
                    to   { opacity: var(--to-op, 0.9);   transform: scale(1.3); }
                }
                @keyframes meteorShoot {
                    0%   { transform: rotate(var(--angle)) translateX(0);     opacity: 1; }
                    70%  { opacity: 1; }
                    100% { transform: rotate(var(--angle)) translateX(-400px); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default StarField;
