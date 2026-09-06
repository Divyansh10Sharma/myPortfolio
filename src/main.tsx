/**
 * Mount point.
 *
 * The vanilla build's main.js was 250 lines: it started WebGL, wired Lenis,
 * built animations, handled anchors, ran failsafes. All of that has moved into
 * the components and hooks that own it, which is the real argument for the
 * port — nothing here needs to know what the site contains.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";

// Only now is it safe for CSS to hide things before they animate: the class is
// added by JavaScript, so a bundle that never loads cannot leave the page
// permanently invisible.
document.documentElement.classList.add("js");

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
