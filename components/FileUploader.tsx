'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadIcon } from './icons';

interface FileUploaderProps {
    onTextExtracted: (text: string) => void;
    disabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onTextExtracted, disabled }) => {
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            setFileName('');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File size must be less than 5MB.');
            setFileName('');
            return;
        }

        setError('');
        setFileName(file.name);
        setIsProcessing(true);

        try {
            // Use the browser's built-in PDF.js if available, or fallback to text extraction
            const text = await extractTextFromPDF(file);
            if (text.trim()) {
                onTextExtracted(text);
            } else {
                setError('No text content found in the PDF. It might be an image-based PDF or protected.');
                onTextExtracted('');
            }
        } catch (err) {
            console.error('Error parsing PDF:', err);
            setError('Failed to parse the PDF file. It might be corrupted, protected, or image-based.');
            onTextExtracted('');
        } finally {
            setIsProcessing(false);
        }
    }, [onTextExtracted, disabled]);

    const extractTextFromPDF = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    
                    // Try to use PDF.js if available
                    if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
                        const pdfjsLib = (window as any).pdfjsLib;
                        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                        let fullText = '';
                        
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items
                                .map((item: any) => item.str)
                                .join(' ');
                            fullText += pageText + '\n\n';
                        }
                        
                        resolve(fullText);
                    } else {
                        // Fallback: try to extract text using a different approach
                        const text = await extractTextFallback(arrayBuffer);
                        resolve(text);
                    }
                } catch (err) {
                    reject(err);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    };

    const extractTextFallback = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        // Simple fallback - try to find text patterns in the binary data
        const uint8Array = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(uint8Array);
        
        // Extract text that looks like actual content (not binary data)
        const lines = text.split('\n')
            .map(line => line.trim())
            .filter(line => {
                // Filter out binary data and keep readable text
                return line.length > 0 && 
                       line.length < 200 && 
                       /^[a-zA-Z0-9\s.,!?;:'"()-]+$/.test(line);
            })
            .join('\n');
        
        return lines;
    };

    const handleAreaClick = () => {
        if (!disabled && !isProcessing) {
            fileInputRef.current?.click();
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled && !isProcessing) {
            e.currentTarget.classList.add('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
        
        if (disabled || isProcessing) return;
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                // Process the dropped file directly
                setError('');
                setFileName(file.name);
                setIsProcessing(true);

                extractTextFromPDF(file)
                    .then((text) => {
                        if (text.trim()) {
                            onTextExtracted(text);
                        } else {
                            setError('No text content found in the PDF. It might be an image-based PDF or protected.');
                            onTextExtracted('');
                        }
                    })
                    .catch((err) => {
                        console.error('Error parsing PDF:', err);
                        setError('Failed to parse the PDF file. It might be corrupted, protected, or image-based.');
                        onTextExtracted('');
                    })
                    .finally(() => {
                        setIsProcessing(false);
                    });
            } else {
                setError('Please drop a valid PDF file.');
            }
        }
    };

    return (
        <div className="flex flex-col p-4 sm:p-6 items-center">
            <div
                onClick={handleAreaClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full p-6 sm:p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center transition-all duration-200 ${
                    disabled || isProcessing 
                        ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
                        : 'cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                    disabled={disabled || isProcessing}
                />
                <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-gray-600 dark:text-gray-400">
                    <UploadIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
                    <span className="font-semibold text-sm sm:text-base">
                        {isProcessing ? 'Processing PDF...' : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-xs sm:text-sm">PDF (max 5MB)</span>
                </div>
            </div>
            {fileName && <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">File: {fileName}</p>}
            {error && <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{error}</p>}
            {isProcessing && (
                <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-primary-600 dark:text-primary-400 transition-colors duration-200">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-primary-600 dark:border-primary-400"></div>
                    Processing PDF...
                </div>
            )}
        </div>
    );
};
