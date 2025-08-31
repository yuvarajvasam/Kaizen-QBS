'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '../components/Header';
import { FileUploader } from '../components/FileUploader';
import { ModuleSelector } from '../components/ModuleSelector';
import { SolutionDisplay } from '../components/SolutionDisplay';
import { Card } from '../components/Card';
import { parseAndStructureQuestions, generateSolution, QuestionBank } from '../services/geminiService';
import { Loader } from '../components/Loader';

export default function HomePage() {
    const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);
    const [solutionMarkdown, setSolutionMarkdown] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<'landing' | 'step1' | 'step2' | 'step3'>('landing');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [selectedModuleInfo, setSelectedModuleInfo] = useState<{ moduleNumber: number; selectedParts: string[] } | null>(null);

    // Debug: Log when component mounts
    useEffect(() => {
        console.log('Kaizen QBS App loaded successfully');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Build time:', new Date().toISOString());
    }, []);

    const handlePdfParsed = useCallback(async (text: string) => {
        setIsLoading(true);
        setLoadingMessage('AI is parsing and structuring the question bank...');
        setError('');
        setQuestionBank(null);
        setSolutionMarkdown('');

        try {
            const structuredData = await parseAndStructureQuestions(text);
            // Basic validation
            if (!structuredData.modules || structuredData.modules.length === 0) {
                 throw new Error("The AI couldn't find any modules or questions in the document.");
            }
            setQuestionBank(structuredData);
            setCurrentStep('step2');
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during parsing.');
            setCurrentStep('step1');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleGenerate = async (selectedQuestions: string[] | string, group: boolean, moduleInfo: { moduleNumber: number; selectedParts: string[] }) => {
        if ((Array.isArray(selectedQuestions) && selectedQuestions.length === 0) || (!Array.isArray(selectedQuestions) && !selectedQuestions.trim())) {
            setError('Please select at least one part containing questions to generate a solution.');
            return;
        }

        setIsLoading(true);
        setLoadingMessage('Generating your detailed solution...');
        setError('');
        setSolutionMarkdown('');
        setSelectedModuleInfo(moduleInfo);

        try {
            const questionsAsString = Array.isArray(selectedQuestions) ? selectedQuestions.join('\n') : selectedQuestions;
            const result = await generateSolution(questionsAsString, group, moduleInfo);
            setSolutionMarkdown(result);
            setCurrentStep('step3');
        } catch (err) {
            console.error(err);
            setError('Failed to generate solution. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setQuestionBank(null);
        setSolutionMarkdown('');
        setCurrentStep('step1');
        setError('');
    };

    const handleBackToModuleSelection = () => {
        setSolutionMarkdown('');
        setCurrentStep('step2');
        setError('');
    };

    const handleStart = () => {
        setCurrentStep('step1');
    };

    // Landing Page
    if (currentStep === 'landing') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
                <Header />
                <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8 sm:mb-12">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors duration-200">
                                Kaizen Question Bank Solver
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 transition-colors duration-200">
                                Transform your question bank PDFs into comprehensive study guides with AI-powered solutions. 
                                Get detailed answers, organize content, and export in multiple formats.
                            </p>
                            <button
                                onClick={handleStart}
                                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                            >
                                Get Started
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 px-4">
                            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Upload PDF</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-200">Simply drag and drop your question bank PDF to get started</p>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">AI Processing</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-200">Our AI analyzes and structures your questions automatically</p>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Export Solutions</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-200">Download your solutions in Markdown, HTML, or PDF format</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Step 1: File Upload
    if (currentStep === 'step1') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-200">
                <Header />
                <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                    {isLoading && <Loader message={loadingMessage} />}
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-200">Step 1: Upload Question Bank</h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200">Upload your college's question bank PDF. The AI will clean and structure it.</p>
                    </div>
                    
                    <Card>
                        <Card.Content>
                            <FileUploader onTextExtracted={handlePdfParsed} disabled={isLoading}/>
                        </Card.Content>
                    </Card>
                    
                    {error && (
                        <div className="mt-4 sm:mt-6 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 rounded-md p-3 sm:p-4 text-center transition-colors duration-200">
                            {error}
                        </div>
                    )}
                </main>
            </div>
        );
    }

    // Step 2: Module Selection (Centered)
    if (currentStep === 'step2') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-200">
                <Header />
                <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                    {isLoading && <Loader message={loadingMessage} />}
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-200">Step 2: Select Questions</h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200">Choose which questions you'd like the AI to solve for you.</p>
                    </div>
                    
                    {questionBank && (
                        <ModuleSelector
                            questionBank={questionBank}
                            onGenerate={handleGenerate}
                            onReset={handleReset}
                            disabled={isLoading}
                        />
                    )}
                    
                    {error && (
                        <div className="mt-4 sm:mt-6 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 rounded-md p-3 sm:p-4 text-center transition-colors duration-200">
                            {error}
                        </div>
                    )}
                </main>
            </div>
        );
    }

    // Step 3: Solution Display (Centered with limited export options)
    if (currentStep === 'step3') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-200">
                <Header />
                <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-200">Step 3: Review Your Solution</h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200">Here is your generated answer sheet. Review it, download as needed, or go back to select other modules.</p>
                    </div>
                    
                    <SolutionDisplay 
                        markdown={solutionMarkdown} 
                        moduleInfo={selectedModuleInfo}
                        onBackToModuleSelection={handleBackToModuleSelection}
                    />
                    
                    <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={handleBackToModuleSelection}
                            className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                        >
                            Back to Module Selection
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                        >
                            Start Over
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return null;
}
