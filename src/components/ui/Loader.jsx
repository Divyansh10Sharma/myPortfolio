// ============================================================
// Loader.jsx — Full-screen cosmic loading screen.
//              Fades out after 1.6s, then unmounts.
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Loader = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Show loader briefly, then fade out
        const timer = setTimeout(() => setVisible(false), 1600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{ background: "#050816" }}
                >
                    {/* Animated orbit rings */}
                    <div className="relative w-20 h-20 mb-8">
                        {/* Outer ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full"
                            style={{ border: "2px solid transparent", borderTopColor: "#915eff", borderRightColor: "#00d4ff" }}
                        />
                        {/* Middle ring */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-3 rounded-full"
                            style={{ border: "1.5px solid transparent", borderTopColor: "#9ebc80", borderLeftColor: "#00d4ff" }}
                        />
                        {/* Core glow */}
                        <div
                            className="absolute inset-6 rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(145,94,255,0.8) 0%, rgba(0,212,255,0.4) 100%)",
                                boxShadow: "0 0 20px rgba(145,94,255,0.6), 0 0 40px rgba(145,94,255,0.2)",
                            }}
                        />
                    </div>

                    {/* Name */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="font-display font-bold text-xl tracking-widest"
                        style={{
                            background: "linear-gradient(135deg, #915eff, #00d4ff)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        DIVYANSH SHARMA
                    </motion.p>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-gray-600 text-xs font-mono tracking-[0.25em] mt-2"
                    >
                        FULL STACK ENGINEER
                    </motion.p>

                    {/* Loading bar */}
                    <motion.div
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-40 h-px overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
                            className="absolute inset-y-0 w-full"
                            style={{ background: "linear-gradient(90deg, transparent, #915eff, #00d4ff, transparent)" }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;
