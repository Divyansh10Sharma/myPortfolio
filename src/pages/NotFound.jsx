// ============================================================
// NotFound.jsx — 404 page for unmatched routes
// ============================================================

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6 text-center">
            {/* Glowing 404 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <h1
                    className="font-display font-black select-none"
                    style={{
                        fontSize: "clamp(6rem, 20vw, 14rem)",
                        lineHeight: 1,
                        background: "linear-gradient(135deg, #915eff 0%, #00d4ff 60%, #9ebc80 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 60px rgba(145,94,255,0.35))",
                    }}
                >
                    404
                </h1>
            </motion.div>

            {/* Floating orb decoration */}
            <div
                className="absolute w-64 h-64 rounded-full pointer-events-none opacity-20 animate-float"
                style={{
                    background: "radial-gradient(circle, rgba(145,94,255,0.6) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    top: "30%",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col items-center gap-4 relative z-10"
            >
                <p className="text-gray-300 text-xl font-semibold">
                    Page lost in space
                </p>
                <p className="text-gray-500 text-sm font-mono max-w-xs">
                    The page you're looking for drifted into a black hole.
                    Let's get you back.
                </p>

                <div className="flex gap-4 mt-6">
                    {/* Go back */}
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-300 transition-all duration-200"
                        style={{
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.04)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(145,94,255,0.4)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    >
                        <FiArrowLeft size={15} />
                        Go Back
                    </button>

                    {/* Home */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                        style={{
                            background: "linear-gradient(135deg, #915eff, #00d4ff)",
                            boxShadow: "0 0 20px rgba(145,94,255,0.4)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(145,94,255,0.6)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 20px rgba(145,94,255,0.4)"; }}
                    >
                        <FiHome size={15} />
                        Go Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
