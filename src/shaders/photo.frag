// ============================================================
// Photograph — fragment shader. Signature effect (A).
//
// In plain language: the photograph is printed on a sheet of very
// slightly stretchy rubber. Normally it lies flat and colourless.
// When the pointer comes near, the sheet is pulled gently toward
// wherever the pointer is, the colour comes back into it, and the
// red and blue inks separate a little at the edges the way a cheap
// lens splits light.
//
// The trick to understand: we never move a single pixel. We change
// WHERE EACH PIXEL LOOKS in the photograph. Asking for the colour
// slightly to the left of where you actually are makes the image
// appear to slide right. Distortion is always a lie about where to
// look, never an actual movement.
// ============================================================

precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uHover; // 0 at rest, 1 fully hovered — eased in JS
uniform vec2 uMouse; // pointer position, 0–1 within the plane
uniform float uTime;
uniform float uReveal; // 0–1, plays once when it scrolls into view

// The page's off-white, for the reveal wipe.
const vec3 BONE = vec3(0.914, 0.922, 0.929);

void main() {
    vec2 uv = vUv;

    // How far is this pixel from the pointer? Everything below is shaped by
    // this one number.
    float dist = distance(uv, uMouse);

    // smoothstep reversed (0.55 → 0.0) gives 1 at the pointer falling to 0 by
    // just over half the plane away. Multiplied by uHover so the whole effect
    // switches off when the pointer leaves.
    float pull = smoothstep(0.55, 0.0, dist) * uHover;

    // Direction from the pointer to this pixel. The tiny epsilon avoids
    // normalising a zero-length vector at the exact pointer position, which
    // produces NaN and shows up as a black speck that follows your cursor.
    vec2 dir = normalize(uv - uMouse + vec2(0.0001));

    // Look TOWARD the pointer — sampling from nearer the pointer makes the
    // image appear to swell out from under it.
    uv -= dir * pull * 0.09;

    // A slow ripple, only while hovered. Very small: 0.004 of the width.
    uv.x += sin(uv.y * 9.0 + uTime * 0.8) * 0.004 * uHover;

    // ── chromatic aberration ──────────────────────────────────────
    // Sample the three colour channels from three slightly different places.
    // Real lenses do this because glass bends red and blue by different
    // amounts. Here it is a deliberate imperfection — it stops the image
    // looking like a flat rectangle pasted onto the page.
    float aberration = pull * 0.008;

    float r = texture2D(uTexture, uv + dir * aberration).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - dir * aberration).b;

    vec3 col = vec3(r, g, b);

    // Desaturated at rest, full colour under the pointer. The weights are the
    // standard perceptual ones — the eye is far more sensitive to green than
    // to blue, so an even average would look wrong.
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, 0.3 + 0.7 * pull);

    // Lift the shadows slightly toward the page background so the photograph
    // sits in the page rather than punching a hole in it.
    col = mix(vec3(0.043, 0.043, 0.047), col, 0.92);

    // ── reveal ────────────────────────────────────────────────────
    // A soft wipe upward the first time it scrolls into view.
    float wipe = smoothstep(vUv.y - 0.3, vUv.y + 0.1, uReveal * 1.4);

    gl_FragColor = vec4(col, wipe);
}
