import { SpineColumn } from "../components/Spine";
import useDocumentMeta from "../hooks/useDocumentMeta";
import Hero from "../sections/Hero";
import Overview from "../sections/Overview";
import Systems from "../sections/Systems";
import Work from "../sections/Work";
import Projects from "../sections/Projects";
import Testimonials from "../sections/Testimonials";
import Contact from "../sections/Contact";

const Home = () => {
    useDocumentMeta(
        "Divyansh Sharma — Backend & AI Engineer",
        "Backend and AI engineer building production systems in healthtech: AI features, a hand-written asyncio WebSocket layer, native health-sensor integration, and an in-flight Firestore-to-PostgreSQL migration."
    );

    return (
        <main>
            <SpineColumn>
                <Hero />
                <Overview />
                <Systems />
                <Work />
                <Projects />
                <Testimonials />
                <Contact />
            </SpineColumn>
        </main>
    );
};

export default Home;
