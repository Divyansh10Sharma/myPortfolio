// ============================================================
// useScrollAnimation.js — Custom hook wrapping
//                         react-intersection-observer for
//                         consistent scroll-trigger animations
//
// Usage:
//   const { ref, controls } = useScrollAnimation();
//   <motion.div ref={ref} animate={controls} variants={myVariants} />
// ============================================================

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";

/**
 * @param {number} threshold  — 0–1, fraction of element visible before trigger
 * @param {boolean} once      — if true, only triggers animation once
 * @returns {{ ref, controls, inView }}
 */
const useScrollAnimation = (threshold = 0.15, once = true) => {
    const controls        = useAnimation();
    const [ref, inView]   = useInView({ threshold, triggerOnce: once });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        } else if (!once) {
            controls.start("hidden");
        }
    }, [inView, controls, once]);

    return { ref, controls, inView };
};

export default useScrollAnimation;
