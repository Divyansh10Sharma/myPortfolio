import { defineConfig } from "vite";

/**
 * Open Graph and rel=canonical need absolute URLs, which we don't know until
 * Vercel builds. Vercel exposes the production domain as an env var at build
 * time, so we substitute it rather than hardcoding a guess. Set SITE_URL
 * explicitly to pin a custom domain later.
 *
 * Ported from the old site, which solved this the same way.
 */
const siteUrl =
    process.env.SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "");

const htmlSiteUrl = () => ({
    name: "html-site-url",
    transformIndexHtml: {
        order: "pre", // run before Vite's own HTML parsing sees the token
        handler: (html) => {
            // A relative canonical is worse than none, so on local builds the
            // tag is removed entirely instead of emitting a broken URL.
            const out = siteUrl
                ? html
                : html.replace(/^\s*<link rel="canonical"[^>]*>\s*$/m, "");
            return out.replaceAll("__SITE_URL__", siteUrl);
        },
    },
});

export default defineConfig({
    plugins: [htmlSiteUrl()],
});
