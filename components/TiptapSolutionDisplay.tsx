'use client';

import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { DownloadIcon, FileTextIcon } from './icons';

interface TiptapSolutionDisplayProps {
    markdown: string;
    moduleInfo?: { moduleNumber: number; selectedParts: string[] } | null;
}

export const TiptapSolutionDisplay: React.FC<TiptapSolutionDisplayProps> = ({ markdown, moduleInfo }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentMarkdown, setCurrentMarkdown] = useState<string>('');

    // Update current markdown when markdown prop changes
    useEffect(() => {
        if (markdown) {
            setCurrentMarkdown(markdown);
        } else {
            setCurrentMarkdown('');
        }
    }, [markdown]);

    // Generate title based on module and parts
    const generateTitle = () => {
        if (!moduleInfo) return 'AI Question Bank Solution';
        
        const { moduleNumber, selectedParts } = moduleInfo;
        let title = `Module ${moduleNumber}`;
        
        if (selectedParts.length === 1) {
            title += ` Part ${selectedParts[0]}`;
        } else if (selectedParts.length === 2) {
            title += ` Part ${selectedParts[0]} & ${selectedParts[1]}`;
        } else if (selectedParts.length === 3) {
            title += ` Part ${selectedParts[0]}, ${selectedParts[1]} & ${selectedParts[2]}`;
        }
        
        return `${title} Solutions`;
    };

    // Generate filename based on module and parts
    const generateFilename = () => {
        if (!moduleInfo) return 'ai-question-bank-solution';
        
        const { moduleNumber, selectedParts } = moduleInfo;
        let filename = `module-${moduleNumber}`;
        
        if (selectedParts.length === 1) {
            filename += `-part-${selectedParts[0].toLowerCase()}`;
        } else if (selectedParts.length === 2) {
            filename += `-part-${selectedParts[0].toLowerCase()}-and-${selectedParts[1].toLowerCase()}`;
        } else if (selectedParts.length === 3) {
            filename += `-part-${selectedParts[0].toLowerCase()}-${selectedParts[1].toLowerCase()}-${selectedParts[2].toLowerCase()}`;
        }
        
        return `${filename}-solutions`;
    };

    // Update page title when module info changes
    useEffect(() => {
        if (moduleInfo) {
            document.title = generateTitle();
        }
    }, [moduleInfo]);

    const handlePrintPDF = async () => {
        setIsLoading(true);
        try {
            // Convert markdown to HTML
            const html = marked(currentMarkdown || markdown);
            
            // Create a styled HTML document
            const styledHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${generateTitle()}</title>
                    <meta charset="utf-8">
                    <style>
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6; 
                            margin: 20px; 
                            color: #333;
                            max-width: 800px;
                            margin: 20px auto;
                        }
                        h1, h2, h3 { 
                            color: #2c3e50; 
                            padding-bottom: 10px;
                        }
                        h1 { font-size: 2em; margin-top: 0; }
                        h2 { font-size: 1.5em; }
                        h3 { font-size: 1.2em; }
                        
                        table { 
                            border-collapse: collapse; 
                            width: 100%; 
                            margin: 20px 0;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        th { 
                            background-color: #3498db; 
                            color: white; 
                            padding: 12px 8px; 
                            text-align: left; 
                            font-weight: bold;
                        }
                        td { 
                            border: 1px solid #ddd; 
                            padding: 12px 8px; 
                            text-align: left; 
                        }
                        tr:nth-child(even) { background-color: #f8f9fa; }
                        
                        ul, ol { 
                            margin: 15px 0; 
                            padding-left: 30px; 
                        }
                        ol { 
                            counter-reset: item;
                            list-style-type: decimal;
                        }
                        ol li { 
                            margin: 8px 0; 
                            display: list-item;
                            list-style-position: outside;
                        }
                        ul li { 
                            margin: 8px 0; 
                            display: list-item;
                        }
                        
                        p { margin: 15px 0; }
                        
                        code { 
                            background-color: #f4f4f4; 
                            padding: 2px 6px; 
                            border-radius: 4px; 
                            font-family: 'Courier New', monospace;
                        }
                        
                        pre { 
                            background-color: #f8f9fa; 
                            padding: 15px; 
                            border-radius: 8px; 
                            overflow-x: auto;
                            border-left: 4px solid #3498db;
                        }
                        
                        blockquote { 
                            border-left: 4px solid #3498db; 
                            margin: 20px 0; 
                            padding: 10px 20px; 
                            background-color: #f8f9fa;
                            font-style: italic;
                        }
                        
                        .header { 
                            text-align: center; 
                            margin-bottom: 40px; 
                            border-bottom: 3px solid #3498db; 
                            padding-bottom: 30px; 
                        }
                        .footer { 
                            text-align: center; 
                            margin-top: 40px; 
                            font-size: 14px; 
                            color: #7f8c8d; 
                            border-top: 1px solid #ddd; 
                            padding-top: 20px; 
                        }
                        .content { margin: 0 auto; }
                        
                        @media print {
                            .page-break { page-break-before: always; }
                            body { margin: 15px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${generateTitle()}</h1>
                        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    </div>
                    <div class="content">
                        ${html}
                    </div>
                    <div class="footer">
                        <p>Generated by Kaizen Question Bank Solver</p>
                        <p>This document contains AI-generated content for educational purposes</p>
                        <p>Made with ❤️ by <a href="https://www.linkedin.com/in/yuvarajvasam/" target="_blank" rel="noopener noreferrer">Yuvaraj Vasam</a></p>
                    </div>
                </body>
                </html>
            `;

            // Open a new window with the HTML content
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(styledHtml);
                printWindow.document.close();
                
                // Wait for content to load, then print
                printWindow.onload = () => {
                    printWindow.print();
                    // Close the window after printing
                    setTimeout(() => {
                        printWindow.close();
                    }, 1000);
                };
            } else {
                throw new Error('Popup blocked. Please allow popups for this site.');
            }
            
        } catch (error) {
            console.error('Print failed:', error);
            alert('Failed to open print dialog. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadMarkdown = () => {
        const content = currentMarkdown || markdown;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '${generateFilename()}.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadHTML = () => {
        const html = marked(currentMarkdown || markdown);
        const blob = new Blob([`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${generateTitle()}</title>
                <style>
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6; 
                        margin: 20px; 
                        color: #333;
                        max-width: 800px;
                        margin: 20px auto;
                    }
                    h1, h2, h3 { color: #2c3e50; }
                    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                    th { background-color: #3498db; color: white; padding: 8px; }
                    td { border: 1px solid #ddd; padding: 8px; }
                    ul, ol { margin: 15px 0; padding-left: 30px; }
                    code { background-color: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
                    pre { background-color: #f8f9fa; padding: 15px; border-radius: 8px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${generateTitle()}</h1>
                    <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>

                </div>
                <div class="content">
                    ${html}
                </div>
                <div class="footer">
                    <p>Generated by Kaizen Question Bank Solver</p>
                    <p>This document contains AI-generated content for educational purposes</p>
                    <p>Made with ❤️ by <a href="https://www.linkedin.com/in/yuvarajvasam/" target="_blank" rel="noopener noreferrer">Yuvaraj Vasam</a></p>
                </div>
            </body>
            </html>
        `], { type: 'text/html' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '${generateFilename()}.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!markdown) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-colors duration-200">
                <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white transition-colors duration-200">Step 3: Review Your Solution</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Here is the generated answer sheet. Review it and download as needed.</p>
                </div>
                <div className="p-4 sm:p-6 pt-0">
                    <div className="flex flex-col items-center justify-center h-[50vh] sm:h-[60vh] bg-gray-50 dark:bg-gray-700 rounded-md p-4 sm:p-6 text-center transition-colors duration-200">
                        <FileTextIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-500 mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-200">Your solution will appear here</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Upload a PDF and enter some questions to get started.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-colors duration-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white transition-colors duration-200">
                            {moduleInfo ? generateTitle() : 'Step 3: Review Your Solution'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                            {moduleInfo ? `Module ${moduleInfo.moduleNumber} - Parts ${moduleInfo.selectedParts.join(', ')}` : 'Here is the generated answer sheet. Review it and download as needed.'}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                            onClick={handleDownloadMarkdown}
                            className="px-3 py-2 text-xs sm:text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg w-full sm:w-auto"
                        >
                            <FileTextIcon className="w-4 h-4" />
                            <span className="ml-2">Markdown</span>
                        </button>
                        <button
                            onClick={handleDownloadHTML}
                            className="px-3 py-2 text-xs sm:text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg w-full sm:w-auto"
                        >
                            <FileTextIcon className="w-4 h-4" />
                            <span className="ml-2">HTML</span>
                        </button>
                        <button
                            onClick={handlePrintPDF}
                            disabled={isLoading}
                            className="px-3 py-2 text-xs sm:text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg w-full sm:w-auto"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            <span className="ml-2">{isLoading ? 'Preparing...' : 'Print PDF'}</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="p-4 sm:p-6 pt-0">
                <div 
                    className="prose max-w-none min-h-[400px] sm:min-h-[500px] p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 overflow-auto transition-colors duration-200 dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: marked(currentMarkdown || markdown) }}
                />
            </div>
        </div>
    );
};
