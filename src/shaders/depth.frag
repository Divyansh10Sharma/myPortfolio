// ============================================================
// Depth field — fragment shader.
//
// Each mark is a tiny square. Squares, not circles, because the old
// site's hero had a sparse field of square marks and hairline rules,
// and this is the same motif rebuilt with real depth.
//
// Two jobs: cut a square out of the point, and fade it with distance
// so the far ones sink into the background instead of forming a wall
// of identical dots.
// ============================================================

precision highp float;

varying float vDepth;

uniform vec3 uColor;

void main() {
    // gl_PointCoord is 0-1 across the point the GPU is drawing, which makes it
    // the point's own local UV. Centre it so 0,0 is the middle.
    vec2 coord = gl_PointCoord - 0.5;

    // Chebyshev distance — the larger of the two axes — is a square, where
    // length() would give a circle. One function call is the whole shape.
    float square = max(abs(coord.x), abs(coord.y));

    // A soft edge rather than a hard one. At these sizes a hard-edged square
    // aliases badly as it drifts.
    float mask = 1.0 - smoothstep(0.36, 0.5, square);

    // Near marks are brightest. Nothing is ever very bright: this sits behind
    // body text and must never compete with it.
    float alpha = mask * (1.0 - vDepth) * 0.42;

    // Nothing to draw. Discarding early saves blending work on a shader that
    // runs across a lot of mostly-empty points.
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(uColor, alpha);
}
