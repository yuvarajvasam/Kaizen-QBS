'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        pdfjsLib: any;
    }
}

export const PDFJSLoader: React.FC = () => {
    useEffect(() => {
        // Load PDF.js if not already loaded
        if (typeof window !== 'undefined' && !window.pdfjsLib) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                // Set the worker source
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                }
            };
            document.head.appendChild(script);
        }
    }, []);

    return null; // This component doesn't render anything
};
