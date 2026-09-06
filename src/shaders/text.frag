// ============================================================
// Headline — fragment shader. Signature effect (B).
//
// In plain language: the headline is printed on a banner held at its
// top and bottom edges. When the page is still, the banner hangs
// flat. When you scroll, the middle of the banner lags behind the
// held edges — the way a sheet hanging on a line bows when you tug
// the line sideways. Stop scrolling and it settles back.
//
// The faster you scroll, the further the middle drags, and the more
// the red and blue inks smear apart. The whole effect is driven by
// one number: how fast the page is moving right now.
//
// The text arrives here as a picture. JavaScript draws the headline
// onto an invisible 2D canvas and hands that over as a texture, so
// this shader is bending an image and has no idea it is letters.
// ============================================================

precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uVelocity; // signed scroll speed, roughly -1 to 1
uniform float uReveal; // 0–1, plays once on load
uniform float uTime;

// The page's off-white. The texture supplies only the SHAPE of the letters —
// their coverage, in the alpha channel — and the colour comes from here.
const vec3 BONE = vec3(0.914, 0.922, 0.929);

void main() {
    vec2 uv = vUv;

    // ── the bow ───────────────────────────────────────────────────
    // sin(uv.y * PI) is 0 at the top and bottom edges and 1 across the middle.
    // Multiplying the sideways shift by it means the held edges stay put while
    // the middle drags — which is what makes it read as a physical sheet
    // rather than the whole block sliding.
    float bow = sin(vUv.y * 3.14159);

    uv.x += uVelocity * 0.14 * bow;

    // A much smaller vertical squash, so it does not look like a flat shear.
    uv.y += uVelocity * 0.018 * sin(vUv.x * 6.28318);

    // A near-invisible drift so the headline is never perfectly static.
    uv.x += sin(uv.y * 4.0 + uTime * 0.35) * 0.0015;

    // ── reveal ────────────────────────────────────────────────────
    // Rises from below and wipes upward. Also offsets the sampling downward
    // while it plays, so the letters appear to travel up into place rather
    // than simply fading on.
    uv.y += (1.0 - uReveal) * 0.12;
    float wipe = smoothstep(vUv.y - 0.35, vUv.y + 0.05, uReveal * 1.45);

    // ── chromatic aberration ──────────────────────────────────────
    // Scaled by how hard you are scrolling. At rest it is exactly zero, so the
    // headline is perfectly crisp when anyone stops to actually read it — the
    // effect only exists while it is in motion.
    float aberration = abs(uVelocity) * 0.014;

    // Only the alpha channel matters: the canvas was transparent with white
    // letters drawn on it, so alpha is "how much letter is here".
    float aR = texture2D(uTexture, uv + vec2(aberration, 0.0)).a;
    float aG = texture2D(uTexture, uv).a;
    float aB = texture2D(uTexture, uv - vec2(aberration, 0.0)).a;

    // Where the three samples disagree, the edge fringes red on one side and
    // blue on the other. Where they agree — the solid middle of a letter —
    // they cancel out and it stays clean off-white.
    float alpha = max(aR, max(aG, aB));

    // Guard the divide: alpha is zero across most of this plane, and dividing
    // by it unguarded gives NaN, which renders as black confetti.
    vec3 col = BONE * (vec3(aR, aG, aB) / max(alpha, 0.001));

    gl_FragColor = vec4(col, alpha * wipe);
}
