import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/* Self-hosted through @fontsource rather than linked from Google Fonts, so the
   experiment makes no third-party request and matches how the real site loads
   its type. Only the weights actually used are imported — every extra weight
   is a separate font file over the wire.

   Inter carries all functional text. Sora stands in for Esbuild, which is a
   licensed face we do not have; DESIGN.md names Sora as its substitute. */
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/sora/500.css";

import "./tokens.css";
import "./experiment.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
