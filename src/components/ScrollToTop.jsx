import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Route-change scroll handling.
 *
 * The browser resolves a URL fragment while parsing the HTML — before React
 * has rendered any sections — so a deep link like /#contact would otherwise
 * land at the top of the page. Resolve it ourselves once the DOM exists.
 */
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, behavior: "instant" });
            return;
        }

        // Wait a frame so the target has been laid out.
        const id = requestAnimationFrame(() => {
            const target = document.getElementById(decodeURIComponent(hash.slice(1)));
            target?.scrollIntoView({ behavior: "instant", block: "start" });
        });
        return () => cancelAnimationFrame(id);
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
