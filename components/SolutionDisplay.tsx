import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import { Card } from './Card';
import { Button } from './Button';
import { DownloadIcon, BotIcon, FileTextIcon } from './icons';

// Dynamic imports for client-side PDF generation
const generatePDF = async (html: string, filename: string) => {
    const { jsPDF } = await import('jspdf');
    const html2canvas = await import('html2canvas');
    
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20px';
    document.body.appendChild(tempDiv);

    try {
        // Convert HTML to canvas
        const canvas = await html2canvas.default(tempDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Download the PDF
        pdf.save(filename);
    } finally {
        // Clean up
        document.body.removeChild(tempDiv);
    }
};


interface SolutionDisplayProps {
    markdown: string;
    moduleInfo?: { moduleNumber: number; selectedParts: string[] } | null;
    onBackToModuleSelection?: () => void;
}

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ markdown, moduleInfo, onBackToModuleSelection }) => {
    const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);

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
    React.useEffect(() => {
        if (moduleInfo) {
            document.title = generateTitle();
        }
    }, [moduleInfo]);

    const handleDownloadPdf = async () => {
        setIsPdfLoading(true);
        try {
            // Convert markdown to HTML with proper styling
            const html = marked(markdown);
            
            // Create a complete HTML document with styling
            const fullHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${generateTitle()}</title>
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
                        li { margin: 8px 0; }
                        
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

            // Call the Puppeteer API endpoint
            await generatePDF(fullHtml, `${generateFilename()}.pdf`);

        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsPdfLoading(false);
        }
    };

    const handleDownloadMarkdown = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generateFilename()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadHTML = () => {
        const html = marked(markdown);
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
                    h1, h2, h3, h5, h6 { 
                        color: #2c3e50; 
                        padding-bottom: 10px;
                    }
                    h1 { font-size: 2em; margin-top: 0; margin-bottom: 20px; }
                    h2 { font-size: 1.5em; margin-top: 20px; margin-bottom: 15px; }
                    h3 { font-size: 1.2em; margin-top: 24px; margin-bottom: 12px; }
                    h5, h6 { font-size: 1.1em; margin-top: 16px; margin-bottom: 12px; }
                    
                    /* Better spacing for question-answer pairs */
                    h3 + p, h5 + p, h6 + p {
                        margin-top: 8px;
                    }
                    
                    h3 + ul, h5 + ul, h6 + ul {
                        margin-top: 12px;
                    }
                    
                    h3 + table, h5 + table, h6 + table {
                        margin-top: 12px;
                    }
                    
                    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                    th { background-color: #3498db; color: white; padding: 8px; }
                    td { border: 1px solid #ddd; padding: 8px; }
                    ul, ol { margin: 16px 0; padding-left: 30px; }
                    li { margin: 4px 0; }
                    code { background-color: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
                    pre { background-color: #f8f9fa; padding: 15px; border-radius: 8px; }
                    
                    /* Question-answer separation */
                    h3, h5, h6 {
                        border-bottom: 1px solid #e1e8ed;
                        padding-bottom: 8px;
                    }
                    
                    /* Answer section styling */
                    strong {
                        font-weight: 600;
                        color: #2c3e50;
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
        a.download = `${generateFilename()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    return (
        <Card>
            <Card.Header>
                <div className="flex justify-between items-center">
                    <div>
                        <Card.Title>
                            {moduleInfo ? generateTitle() : 'Step 3: Review Your Solution'}
                        </Card.Title>
                        <Card.Description>
                            {moduleInfo ? `Module ${moduleInfo.moduleNumber} - Parts ${moduleInfo.selectedParts.join(', ')}` : 'Here is the generated answer sheet. Review it and download as needed.'}
                        </Card.Description>
                    </div>
                </div>
            </Card.Header>
            <Card.Content>
                {markdown ? (
                    <>
                        <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            {onBackToModuleSelection && (
                                <Button onClick={onBackToModuleSelection} variant="outline" className="w-full sm:w-auto order-first">
                                    ← Back to Module Selection
                                </Button>
                            )}
                            <div className="flex flex-col sm:flex-row gap-2 flex-1">
                                <Button onClick={handleDownloadMarkdown} variant="outline" className="w-full sm:w-auto">
                                    <FileTextIcon className="w-4 h-4 mr-2" />
                                    Markdown
                                </Button>
                                <Button onClick={handleDownloadHTML} variant="outline" className="w-full sm:w-auto">
                                    <FileTextIcon className="w-4 h-4 mr-2" />
                                    HTML
                                </Button>
                                <Button 
                                    onClick={handleDownloadPdf} 
                                    variant="outline" 
                                    className="w-full sm:w-auto"
                                    disabled={isPdfLoading}
                                >
                                    <DownloadIcon className="w-4 h-4 mr-2" />
                                    {isPdfLoading ? 'Generating...' : 'PDF'}
                                </Button>
                            </div>
                        </div>
                        <div className="prose prose-sm max-w-none p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-md h-[50vh] sm:h-[60vh] overflow-y-auto markdown-body bg-white dark:bg-gray-800 transition-colors duration-200 dark:prose-invert">
                           <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[50vh] sm:h-[60vh] bg-gray-50 dark:bg-gray-700 rounded-md p-4 sm:p-6 text-center transition-colors duration-200">
                        <BotIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-500 mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-200">Your solution will appear here</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Upload a PDF and enter some questions to get started.</p>
                    </div>
                )}
            </Card.Content>
        </Card>
    );
};