// ============================================================
// App.jsx — Root component with:
//   • BrowserRouter + Routes
//   • ScrollToTop on route change
//   • Cosmic loading screen (Loader)
//   • StarField background
//   • Global Navbar
//   • 404 catch-all route
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home          from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound      from "./pages/NotFound";

import Navbar      from "./components/layout/Navbar";
import StarField   from "./components/ui/StarField";
import ScrollToTop from "./components/ui/ScrollToTop";
import Loader      from "./components/ui/Loader";

const App = () => {
    return (
        <BrowserRouter>
            {/* Cosmic loading screen — fades out after 1.6s */}
            <Loader />

            {/* Fixed star background */}
            <StarField />

            {/* Subtle noise texture overlay */}
            <div
                aria-hidden="true"
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 1,
                    opacity: 0.025,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "256px 256px",
                }}
            />

            {/* Scroll to top on every route change */}
            <ScrollToTop />

            {/* Global navigation */}
            <Navbar />

            {/* Routes */}
            <Routes>
                <Route path="/"            element={<Home />}          />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="*"            element={<NotFound />}      />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
