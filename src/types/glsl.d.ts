/**
 * Vite's `?raw` suffix returns a file's contents as a string. TypeScript has no
 * idea that is possible, so we tell it: any import ending in `?raw` is a string.
 *
 * Without this, every shader import is a red squiggle.
 */
declare module "*.glsl?raw" {
    const contents: string;
    export default contents;
}

declare module "*.vert?raw" {
    const contents: string;
    export default contents;
}

declare module "*.frag?raw" {
    const contents: string;
    export default contents;
}
