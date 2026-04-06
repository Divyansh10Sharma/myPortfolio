/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ["'Orbitron'",      "sans-serif"],
                body:    ["'Sora'",           "sans-serif"],
                mono:    ["'JetBrains Mono'", "monospace"],
            },
            colors: {
                cosmic: {
                    bg:      "#050816",
                    surface: "#0d1424",
                    card:    "#111827",
                    nebula:  "#915eff",
                    star:    "#00d4ff",
                    aurora:  "#9ebc80",
                    comet:   "#f97316",
                    white:   "#f3f4f6",
                    muted:   "#8892b0",
                    dim:     "#4a5568",
                },
            },
            animation: {
                "float":      "float 4s ease-in-out infinite",
                "spin-slow":  "spinSlow 20s linear infinite",
                "glow-pulse": "glowPulse 2.4s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%":      { transform: "translateY(-14px)" },
                },
                spinSlow: {
                    from: { transform: "rotate(0deg)" },
                    to:   { transform: "rotate(360deg)" },
                },
                glowPulse: {
                    "0%, 100%": { boxShadow: "0 0 6px #9ebc80, 0 0 18px rgba(158,188,128,0.5)" },
                    "50%":      { boxShadow: "0 0 12px #9ebc80, 0 0 36px rgba(158,188,128,0.8)" },
                },
            },
            backgroundImage: {
                "cosmic-gradient": "linear-gradient(135deg, #050816 0%, #0d1424 50%, #0a0f1e 100%)",
            },
            boxShadow: {
                "nebula":     "0 0 40px rgba(145, 94, 255, 0.25), 0 0 80px rgba(145, 94, 255, 0.1)",
                "star":       "0 0 30px rgba(0, 212, 255, 0.3)",
                "card":       "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
                "card-hover": "0 20px 60px rgba(145,94,255,0.2), 0 0 0 1px rgba(145,94,255,0.3)",
            },
        },
    },
    plugins: [],
};
