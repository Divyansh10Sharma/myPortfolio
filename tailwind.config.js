/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        // Palette is REPLACED, not extended — Tailwind's default colors are
        // removed so `slate-800` / `blue-500` cannot be used by accident.
        colors: {
            transparent: "transparent",
            current: "currentColor",
            paper: "var(--paper)",
            ink: "var(--ink)",
            graphite: "var(--graphite)",
            rule: "var(--rule)",
            signal: "var(--signal)",
            warn: "var(--warn)",
            "warn-ink": "var(--warn-ink)",
        },
        fontFamily: {
            display: ["Archivo", "system-ui", "sans-serif"],
            mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
            sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        },
        fontSize: {
            xs: ["0.75rem", { lineHeight: "1.5" }],
            sm: ["0.875rem", { lineHeight: "1.6" }],
            base: ["1rem", { lineHeight: "1.6" }],
            lg: ["1.25rem", { lineHeight: "1.5" }],
            xl: ["1.5rem", { lineHeight: "1.25" }],
            "2xl": ["2rem", { lineHeight: "1.15" }],
            "3xl": ["3rem", { lineHeight: "1.1" }],
            "4xl": ["4.5rem", { lineHeight: "1.05" }],
        },
        borderRadius: {
            none: "0",
            DEFAULT: "2px",
            sm: "1px",
            full: "9999px",
        },
        boxShadow: {
            none: "none",
        },
        extend: {
            maxWidth: {
                content: "1280px",
                measure: "68ch",
                short: "60ch",
            },
            letterSpacing: {
                tight: "-0.02em",
                label: "0.08em",
            },
            spacing: {
                // Wide enough for the longest section label ("TESTIMONIALS")
                // to clear the content column.
                spine: "8.75rem",
                section: "7.5rem",
            },
        },
    },
    plugins: [],
};
