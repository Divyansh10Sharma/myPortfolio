// ============================================================
// Background — fragment shader.
//
// In plain language: this file is one short instruction card, and
// every pixel on the screen reads the same card at the same moment
// and works out its own colour from it. Nobody waits for anybody
// else, and no pixel can see what its neighbours decided.
//
// The card says roughly: "start almost black. If you are near the
// soft glow, lift yourself slightly toward a cool blue-grey. The
// glow moves down the screen as the visitor scrolls, and breathes
// slowly on its own. Then add a tiny random speckle so the page has
// texture and the gradient can't show ugly stripes."
//
// Everything here is deliberately cheap — no loops, no branching on
// varying data, one hash call. This runs on every pixel of every
// frame, so on a 1080p screen at 60fps it executes about 124 million
// times a second. A careless line here costs far more than a
// careless line anywhere else in the project.
// ============================================================

precision highp float;

varying vec2 vUv;

uniform float uTime; // seconds since load — the only reason anything moves
uniform float uScroll; // 0 at the top of the page, 1 at the bottom
uniform vec2 uResolution; // canvas size in real pixels
uniform float uGrainStrength; // lowered on weak devices

// The colours, as 0–1 values rather than hex.
// #0B0B0C, the page background, and a cool lift that never gets bright.
const vec3 BASE = vec3(0.043, 0.043, 0.047);
const vec3 LIFT = vec3(0.094, 0.106, 0.161);
const vec3 ACCENT = vec3(0.055, 0.065, 0.130);

/**
 * A hash: give it a position, get back a repeatable number between 0 and 1
 * that looks random but isn't. There is no rand() in GLSL — shaders have no
 * memory between pixels and no random number generator, so "randomness" is
 * always a deterministic function of where you are.
 *
 * The specific constants are folklore. They are chosen so that neighbouring
 * pixels land on wildly different results, which is what makes it look like
 * noise instead of a pattern.
 */
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    // Screen position, centred on zero and corrected for aspect ratio.
    //
    // vUv runs 0→1 across the plane, but a circle drawn in raw 0→1 space comes
    // out as an oval on a wide monitor, because one unit across is physically
    // wider than one unit up. Dividing both axes by the *height* fixes that:
    // now one unit is the same real distance in both directions, and the extra
    // width simply extends the range of x.
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    // The glow's centre. Two things move it:
    //   uScroll * 1.35  — it slides up and off as the visitor scrolls down, so
    //                     the light appears to stay with the top of the page
    //   sin(uTime …)    — a very slow drift, ~100s per cycle, so the page is
    //                     never perfectly still without ever looking animated
    vec2 centre = vec2(0.0, 0.32 - uScroll * 1.35 + sin(uTime * 0.06) * 0.05);

    // Distance from this pixel to the centre of the glow. Everything below is
    // just "how far away am I", shaped.
    float d = length(p - centre);

    // smoothstep gives a soft edge instead of a hard circle: 1 at the centre,
    // falling to 0 by a distance of 1.15. pow() then bends that falloff so the
    // bright part stays small and the tail stretches out — a linear falloff
    // reads as a flat disc, which looks like a bug rather than a light.
    float glow = 1.0 - smoothstep(0.0, 1.15, d);
    glow = pow(glow, 2.4);

    vec3 col = mix(BASE, LIFT, glow * 0.9);

    // A second, weaker wash low and to the right, which only fades in once the
    // visitor is properly into the page. It stops the lower two thirds from
    // being a flat black field.
    float washMask = 1.0 - smoothstep(0.0, 1.0, length(p - vec2(0.45, -0.35)));
    col += ACCENT * washMask * smoothstep(0.15, 0.9, uScroll) * 0.55;

    // ── grain ─────────────────────────────────────────────────────
    // A speckle that changes every frame. It does two jobs: it unifies the
    // page the way film grain unifies a photograph, and it hides colour
    // banding — without it, a gradient this dark and this gradual shows
    // visible stripes, because 8-bit colour has no values in between.
    //
    // fract(uTime * 60.0) reshuffles the pattern each frame. Feeding raw
    // uTime would make it drift smoothly, which reads as crawling insects
    // rather than grain.
    float grain = hash(gl_FragCoord.xy + fract(uTime * 60.0) * 100.0);
    col += (grain - 0.5) * uGrainStrength;

    gl_FragColor = vec4(col, 1.0);
}
