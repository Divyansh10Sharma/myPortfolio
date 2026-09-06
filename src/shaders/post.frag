// ============================================================
// Post-processing — the final pass over the whole picture.
//
// In plain language: everything up to now has been painted onto a
// sheet of glass rather than onto the wall. This file is what
// happens when we finally hold that glass up and photograph it
// through a slightly imperfect lens.
//
// Because it runs on the finished image, it does not care what is
// in it. The gradient, the photograph and the headline all get the
// same treatment at the same moment — which is exactly why it makes
// a page feel like one surface instead of several things stacked up.
//
// Three imperfections, all deliberate:
//   1. the lens splits colours slightly toward the edges
//   2. the corners fall darker than the middle
//   3. the whole thing has film grain over it
//
// Every one of these is a flaw in real optics. Adding them back is
// what stops a computer image looking computer-generated.
// ============================================================

precision highp float;

varying vec2 vUv;

uniform sampler2D uScene; // everything drawn so far, as a picture
uniform float uTime;
uniform float uVelocity; // scroll speed, roughly -1 to 1
uniform vec2 uResolution;
uniform float uGrainStrength;
uniform float uAberration; // base strength, lowered on weak devices

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = vUv;

    // Distance from the centre, 0 in the middle and about 0.7 at a corner.
    // Everything below is shaped by this: real lens flaws are always worst at
    // the edges and vanish in the middle, which is why uniform effects across
    // the whole frame read as fake.
    vec2 centred = uv - 0.5;
    float radius = length(centred);

    // ── chromatic aberration ──────────────────────────────────────
    // Push the red and blue channels apart along the line running out from the
    // centre. Squaring the radius keeps the middle of the screen — where the
    // text is — completely clean, so nothing that has to be read is ever
    // smeared.
    //
    // Scroll speed adds to it, so the split only really appears while the page
    // is moving and resolves as soon as you stop to read.
    float amount = uAberration * (radius * radius) * (1.0 + abs(uVelocity) * 6.0);

    vec2 offset = centred * amount;

    float r = texture2D(uScene, uv + offset).r;
    float g = texture2D(uScene, uv).g;
    float b = texture2D(uScene, uv - offset).b;

    vec3 col = vec3(r, g, b);

    // ── vignette ──────────────────────────────────────────────────
    // Darken the corners. smoothstep rather than a linear falloff so there is
    // no visible ring where it begins.
    float vignette = smoothstep(1.05, 0.25, radius);
    col *= mix(0.72, 1.0, vignette);

    // ── grain ─────────────────────────────────────────────────────
    // Moved here from the background shader. That is the whole point of a post
    // pass: previously only the gradient had grain, so the photograph and the
    // headline sat on top of it looking suspiciously clean. Now one layer of
    // film covers everything at once.
    //
    // gl_FragCoord, not uv, so the grain is one screen pixel regardless of how
    // anything underneath is scaled.
    float grain = hash(gl_FragCoord.xy + fract(uTime * 60.0) * 100.0);
    col += (grain - 0.5) * uGrainStrength;

    gl_FragColor = vec4(col, 1.0);
}
