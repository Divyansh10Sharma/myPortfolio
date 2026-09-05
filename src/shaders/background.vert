// ============================================================
// Background — vertex shader.
//
// This one does almost nothing, on purpose.
//
// Our background is a single flat rectangle stretched across the
// whole screen. It has four corners and they never move. So the
// only job here is to hand each corner's "position on the sheet"
// down to the fragment shader, which is where all the real work
// happens.
//
// Every shader pair needs one of these even when there is nothing
// interesting to say — nothing can be drawn until something has
// decided where the corners go.
// ============================================================

// Passed down to the fragment shader. "varying" means: give this a
// value at each corner, and the GPU will smoothly blend between
// them for every pixel in between, for free.
varying vec2 vUv;

void main() {
    // uv is supplied by Three.js for each corner of the plane:
    // (0,0) bottom-left, (1,1) top-right. It is the rectangle's own
    // coordinate system, independent of how many pixels wide the
    // screen happens to be.
    vUv = uv;

    // The standard "where does this corner land on screen" line.
    // projectionMatrix, modelViewMatrix and position are all provided
    // by Three.js. Because our camera is orthographic and the plane is
    // exactly 2x2, this maps the rectangle precisely onto the viewport.
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
