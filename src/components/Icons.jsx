// Hand-drawn inline icons — replaces the react-icons dependency entirely.
// All stroke-based, 1.5px, so they sit in the same weight world as the rules.

const base = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
};

export const ArrowRight = ({ size = 14, className = "" }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} {...base}>
        <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
);

export const ArrowUpRight = ({ size = 14, className = "" }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} {...base}>
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
);

export const ArrowDown = ({ size = 14, className = "" }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} {...base}>
        <path d="M8 2v11M4 9l4 4 4-4" />
    </svg>
);

export const Github = ({ size = 16, className = "" }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} {...base}>
        <path d="M6 12.3c-2.6.8-2.6-1.3-3.7-1.6m7.4 3.3v-2.1a1.8 1.8 0 00-.5-1.4c1.7-.2 3.4-.8 3.4-3.7a2.9 2.9 0 00-.8-2 2.7 2.7 0 00-.1-2S11 2.5 9.7 3.4a7 7 0 00-3.7 0C4.7 2.5 4 2.8 4 2.8a2.7 2.7 0 00-.1 2 2.9 2.9 0 00-.8 2c0 2.9 1.7 3.5 3.4 3.7a1.8 1.8 0 00-.5 1.4V14" />
    </svg>
);

export const Linkedin = ({ size = 16, className = "" }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} {...base}>
        <rect x="2" y="2" width="12" height="12" rx="1" />
        <path d="M4.8 7v4M4.8 5v.01M7.6 11V7m0 1.4A1.4 1.4 0 0110.4 9v2" />
    </svg>
);

export const Document = ({ size = 16, className = "" }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} {...base}>
        <path d="M9 2H4.5A1.5 1.5 0 003 3.5v9A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5V6zM9 2v4h4M5.5 9h5M5.5 11.5h3" />
    </svg>
);
