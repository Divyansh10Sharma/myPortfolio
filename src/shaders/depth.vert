// ============================================================
// Depth field — vertex shader.
//
// One square mark per point, scattered through a box of space in
// front of the camera. This shader decides where each mark lands on
// screen and, crucially, HOW BIG it is.
//
// That size is the whole effect. Because the camera has perspective,
// a mark twice as far away should be half the size — and gl_PointSize
// is not given that for free, so we work it out from the point's
// distance ourselves. Without that one division, everything comes out
// the same size and the field goes completely flat.
// ============================================================

attribute float aScale; // this mark's base size
attribute float aSeed;  // 0-1, so each mark drifts on its own schedule

uniform float uTime;
uniform float uScroll;      // 0-1 down the page
uniform float uPixelRatio;

varying float vDepth;

void main() {
    vec3 pos = position;

    // A very slow drift, unique per mark. The seed offsets the wave so the
    // field never pulses in unison, which would read as a heartbeat.
    pos.x += sin(uTime * 0.08 + aSeed * 6.2831) * 0.7;
    pos.y += cos(uTime * 0.06 + aSeed * 6.2831) * 0.45;

    // Scrolling pushes the whole field upward. Deliberately much slower than
    // the page itself: things far away should appear to move less, which is
    // the entire basis of parallax.
    pos.y += uScroll * 7.0;

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * viewPosition;

    // -viewPosition.z is how far in front of the camera this point is. Dividing
    // by it is what makes distant marks small. The 60.0 is just a scale that
    // makes the numbers land in a sensible pixel range.
    gl_PointSize = aScale * uPixelRatio * (60.0 / -viewPosition.z);

    // Hand the distance down so the fragment shader can fade the far ones out.
    vDepth = clamp((-viewPosition.z - 3.0) / 28.0, 0.0, 1.0);
}
