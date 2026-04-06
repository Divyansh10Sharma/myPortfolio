// ============================================================
// SectionWrapper.jsx — Higher-Order Component that wraps
//                      any section with a fade+slide entrance
//                      animation triggered on scroll.
//
// Usage:
//   export default SectionWrapper(MySection, "my-section-id");
// ============================================================

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Stagger container variant
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
        },
    },
};

// Child item variant
const itemVariants = {
    hidden:  { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

/**
 * Wraps a component with scroll-triggered entrance animation.
 * @param {React.Component} Component - The section component to wrap
 * @param {string} idName             - Optional id for the wrapping div
 */
const SectionWrapper = (Component, idName) => {
    const WrappedComponent = (props) => {
        const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

        return (
            <motion.section
                id={idName}
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="relative z-10"
            >
                {/* Passes itemVariants down via context so children can use motion.div variants */}
                <Component {...props} itemVariants={itemVariants} inView={inView} />
            </motion.section>
        );
    };

    // Preserve display name for React DevTools
    WrappedComponent.displayName = `SectionWrapper(${Component.displayName || Component.name || "Component"})`;

    return WrappedComponent;
};

export { itemVariants, containerVariants };
export default SectionWrapper;
