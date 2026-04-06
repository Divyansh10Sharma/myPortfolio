// ============================================================
// vite.config.js — Vite + React configuration
// ============================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Allows @/components/... style imports
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        // Increase chunk warning threshold (three.js etc. are large)
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // Split vendor chunks for better caching
                manualChunks: {
                    "vendor-react":  ["react", "react-dom", "react-router-dom"],
                    "vendor-motion": ["framer-motion"],
                    "vendor-ui":     ["react-icons", "react-parallax-tilt", "react-type-animation"],
                },
            },
        },
    },
    // Dev server config
    server: {
        port: 3000,
        open: true,
    },
});
