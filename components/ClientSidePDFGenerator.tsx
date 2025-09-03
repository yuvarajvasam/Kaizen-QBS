import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { marked } from 'marked';

interface ClientSidePDFGeneratorProps {
    markdown: string;
    title: string;
    filename: string;
    onComplete?: () => void;
    onError?: (error: string) => void;
}

// Create styles for the PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
        fontSize: 12,
        lineHeight: 1.6,
        fontFamily: 'Helvetica',
    },
    header: {
        textAlign: 'center',
        marginBottom: 30,
        borderBottom: '3px solid #3498db',
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#2c3e50',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 0,
    },
    content: {
        flex: 1,
        marginBottom: 20,
    },
    footer: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 12,
        color: '#7f8c8d',
        borderTop: '1px solid #ddd',
        paddingTop: 20,
    },
    paragraph: {
        marginBottom: 10,
        textAlign: 'justify',
    },
    heading1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginTop: 20,
        marginBottom: 10,
    },
    heading2: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginTop: 16,
        marginBottom: 8,
    },
    heading3: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginTop: 12,
        marginBottom: 6,
    },
    listItem: {
        marginBottom: 4,
        paddingLeft: 10,
    },
    code: {
        backgroundColor: '#f4f4f4',
        padding: 4,
        fontFamily: 'Courier',
        fontSize: 10,
    },
});

// Function to convert markdown to PDF-compatible content
const convertMarkdownToPDFContent = (markdown: string) => {
    const tokens = marked.lexer(markdown);
    const elements: React.ReactElement[] = [];

    tokens.forEach((token) => {
        switch (token.type) {
            case 'heading':
                const headingStyle = token.depth === 1 ? styles.heading1 : 
                                   token.depth === 2 ? styles.heading2 : styles.heading3;
                elements.push(
                    <Text key={`heading-${elements.length}`} style={headingStyle}>
                        {token.text}
                    </Text>
                );
                break;
            
            case 'paragraph':
                elements.push(
                    <Text key={`paragraph-${elements.length}`} style={styles.paragraph}>
                        {token.text}
                    </Text>
                );
                break;
            
            case 'list':
                token.items?.forEach((item: { text: string }, index: number) => {
                    elements.push(
                        <Text key={`list-${elements.length}-${index}`} style={styles.listItem}>
                            {token.ordered ? `${index + 1}. ` : '• '}{item.text}
                        </Text>
                    );
                });
                break;
            
            case 'code':
                elements.push(
                    <Text key={`code-${elements.length}`} style={styles.code}>
                        {token.text}
                    </Text>
                );
                break;
            
            case 'table':
                // For tables, we'll create a simple text representation
                if (token.header) {
                    (token.header as { text: string }[]).forEach((header: { text: string }, index: number) => {
                        elements.push(
                            <Text key={`table-header-${elements.length}-${index}`} style={styles.heading3}>
                                {header.text}
                            </Text>
                        );
                    });
                }
                (token.rows as { text: string }[][])?.forEach((row: { text: string }[], rowIndex: number) => {
                    row.forEach((cell: { text: string }, cellIndex: number) => {
                        elements.push(
                            <Text key={`table-cell-${elements.length}-${rowIndex}-${cellIndex}`} style={styles.paragraph}>
                                {cell.text}
                            </Text>
                        );
                    });
                });
                break;
            
            default:
                // For other token types, just add as text
                if ('text' in token && token.text) {
                    elements.push(
                        <Text key={`text-${elements.length}`} style={styles.paragraph}>
                            {(token as { text: string }).text}
                        </Text>
                    );
                }
                break;
        }
    });

    return elements;
};

export const ClientSidePDFGenerator: React.FC<ClientSidePDFGeneratorProps> = ({
    markdown,
    title,
    filename,
    onComplete,
    onError
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfError, setPdfError] = useState<string>('');

    const generatePDF = async () => {
        setIsGenerating(true);
        setPdfError('');

        try {
            // Create PDF document
            const MyDocument = () => (
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.subtitle}>
                                Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                            </Text>
                        </View>
                        
                        <View style={styles.content}>
                            {convertMarkdownToPDFContent(markdown)}
                        </View>
                        
                        <View style={styles.footer}>
                            <Text>Generated by Kaizen Question Bank Solver</Text>
                            <Text>This document contains AI-generated content for educational purposes</Text>
                            <Text>Made with ❤️ by Yuvaraj Vasam</Text>
                        </View>
                    </Page>
                </Document>
            );

            // Generate PDF blob
            const blob = await pdf(<MyDocument />).toBlob();
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            onComplete?.();
        } catch (error) {
            console.error('PDF generation failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
            onError?.(errorMessage);
            setPdfError(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
                {isGenerating ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating PDF...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                    </>
                )}
            </button>
            
            {pdfError && (
                <div className="mt-2 text-red-600 text-sm">
                    {pdfError}
                </div>
            )}
        </div>
    );
};
