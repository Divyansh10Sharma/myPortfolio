const Footer = () => (
    <footer className="mt-[72px] border-t border-rule md:mt-section">
        <div className="mx-auto flex w-full max-w-content flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs text-graphite">
                2026 · Built with React and Tailwind · Deployed on Vercel
            </p>
            <a href="#top" className="link self-start font-mono text-xs text-graphite hover:text-ink">
                Back to top ↑
            </a>
        </div>
    </footer>
);

export default Footer;
