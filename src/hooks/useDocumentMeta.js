import { useEffect } from "react";

/** Sets the document title and the meta/OG description for a route. */
const useDocumentMeta = (title, description) => {
    useEffect(() => {
        document.title = title;

        const selectors = [
            'meta[name="description"]',
            'meta[property="og:description"]',
            'meta[name="twitter:description"]',
        ];
        for (const selector of selectors) {
            document.querySelector(selector)?.setAttribute("content", description);
        }

        for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
            document.querySelector(selector)?.setAttribute("content", title);
        }
    }, [title, description]);
};

export default useDocumentMeta;
