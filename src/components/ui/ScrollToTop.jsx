// ============================================================
// ScrollToTop.jsx — Scrolls window to top on every route change.
//                   Place inside <BrowserRouter> in App.jsx.
// ============================================================

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Instant scroll on route change (smooth would fight page load)
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [pathname]);

    return null; // renders nothing
};

export default ScrollToTop;
