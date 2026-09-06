import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Open Graph and rel=canonical need absolute URLs, which are unknown until
 * Vercel builds. Vercel exposes the production domain as an env var at build
 * time, so we substitute it rather than hardcoding a guess.
 */
const siteUrl =
    process.env.SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "");

const htmlSiteUrl = () => ({
    name: "html-site-url",
    transformIndexHtml: {
        order: "pre" as const,
        handler: (html: string) => {
            // A relative canonical is worse than none, so on local builds the
            // tag is removed entirely rather than emitting a broken URL.
            const out = siteUrl
                ? html
                : html.replace(/^\s*<link rel="canonical"[^>]*>\s*$/m, "");
            return out.replaceAll("__SITE_URL__", siteUrl);
        },
    },
});

export default defineConfig({
    plugins: [react(), htmlSiteUrl()],
    build: {
        rollupOptions: {
            output: {
                // Three and React change far less often than our own code, so
                // splitting them out means a copy change does not invalidate
                // 600KB of vendor bundle in everyone's browser cache.
                //
                // Vite 8 bundles with Rolldown, where manualChunks must be a
                // function rather than the object map older Rollup accepted.
                manualChunks(id: string) {
                    if (id.includes("node_modules/three")) return "three";
                    if (
                        id.includes("node_modules/react") ||
                        id.includes("node_modules/scheduler")
                    ) {
                        return "react";
                    }
                    return undefined;
                },
            },
        },
    },
});
