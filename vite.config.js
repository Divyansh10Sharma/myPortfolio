import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Open Graph and rel=canonical need absolute URLs. Vercel exposes the
 * production domain at build time, so substitute it rather than hardcoding a
 * guess. Set SITE_URL explicitly to override (e.g. for a custom domain).
 */
const siteUrl =
    process.env.SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "");

const htmlSiteUrl = () => ({
    name: "html-site-url",
    // "pre" so the token is gone before Vite's HTML plugin parses URLs.
    transformIndexHtml: {
        order: "pre",
        handler: (html) => {
            // A relative canonical is worse than none, so drop the tag
            // entirely when the domain isn't known at build time.
            const out = siteUrl
                ? html
                : html.replace(/^\s*<link rel="canonical"[^>]*>\s*$/m, "");
            return out.replaceAll("__SITE_URL__", siteUrl);
        },
    },
});

export default defineConfig({
    plugins: [react(), htmlSiteUrl()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "vendor-react": ["react", "react-dom", "react-router-dom"],
                },
            },
        },
    },
    server: {
        port: 3000,
    },
});
