import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const App = () => (
    <BrowserRouter>
        <ScrollToTop />
        <a
            href="#top"
            className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-[60] focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-paper"
        >
            Skip to content
        </a>
        <Nav />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
    </BrowserRouter>
);

export default App;
