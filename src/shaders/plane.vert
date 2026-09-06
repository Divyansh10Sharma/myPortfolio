// ============================================================
// Shared vertex shader for the DOM-synced planes.
//
// Both the photograph and the headline are flat rectangles whose
// corners never move — all the interesting work happens per pixel,
// in the fragment shaders. So this file's only job is to hand the
// surface coordinates down and put the rectangle where the JavaScript
// has positioned it.
//
// The rectangle is built 1x1 and then scaled to the size of the DOM
// element it is shadowing, so the same geometry serves both planes.
// ============================================================

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
