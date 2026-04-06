// ============================================================
// Home.jsx — Main page, stitches all sections together
// ============================================================

import Hero         from "../components/sections/Hero";
import About        from "../components/sections/About";
import Experience   from "../components/sections/Experience";
import Skills       from "../components/sections/Skills";
import Projects     from "../components/sections/Projects";
import Testimonials from "../components/sections/Testimonials";
import Contact      from "../components/sections/Contact";
import Footer       from "../components/layout/Footer";

const Home = () => {
    return (
        <main className="relative z-10">
            <Hero         />
            <About        />
            <Experience   />
            <Skills       />
            <Projects     />
            <Testimonials />
            <Contact      />
            <Footer       />
        </main>
    );
};

export default Home;
