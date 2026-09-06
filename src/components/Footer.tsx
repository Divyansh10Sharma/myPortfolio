import { footerLine } from "../data/content";

export function Footer() {
    return (
        <footer className="foot">
            <p>{footerLine}</p>
            <a href="#top">Back to top ↑</a>
        </footer>
    );
}
