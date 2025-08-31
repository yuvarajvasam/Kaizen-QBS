'use client';

import React, { useState } from 'react';
import { FileUploader } from '../../components/FileUploader';

export default function DebugPage() {
    const [extractedText, setExtractedText] = useState<string>('');
    const [textLength, setTextLength] = useState<number>(0);

    const handleTextExtracted = (text: string) => {
        setExtractedText(text);
        setTextLength(text.length);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">PDF Debug Page</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>
                        <FileUploader 
                            onTextExtracted={handleTextExtracted}
                            disabled={false}
                        />
                        
                        {textLength > 0 && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-green-800">
                                    <strong>Success!</strong> Extracted {textLength} characters from PDF.
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Extracted Text Preview</h2>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 h-96 overflow-auto">
                            {extractedText ? (
                                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                                    {extractedText}
                                </pre>
                            ) : (
                                <div className="text-gray-500 text-center py-8">
                                    Upload a PDF to see extracted text here
                                </div>
                            )}
                        </div>
                        
                        {extractedText && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <h3 className="font-semibold text-blue-800 mb-2">Text Analysis:</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Total characters: {textLength}</li>
                                    <li>• Total words: {extractedText.split(/\s+/).filter(word => word.length > 0).length}</li>
                                    <li>• Total lines: {extractedText.split('\n').filter(line => line.trim().length > 0).length}</li>
                                    <li>• Contains numbers: {/\d/.test(extractedText) ? 'Yes' : 'No'}</li>
                                    <li>• Contains questions: {/\?/.test(extractedText) ? 'Yes' : 'No'}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Tips:</h3>
                    <ul className="text-sm text-yellow-700 space-y-2">
                        <li>• Make sure your PDF contains selectable text (not just images)</li>
                        <li>• Try with a simple text-based PDF first</li>
                        <li>• Check if the PDF is password-protected</li>
                        <li>• Ensure the PDF file size is under 5MB</li>
                        <li>• If text extraction fails, the PDF might be image-based and require OCR</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
