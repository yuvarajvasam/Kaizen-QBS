
import React from 'react';
// import { BrainCircuitIcon } from './icons';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="bg-primary-600 p-1 rounded-lg">
                        {/* <BrainCircuitIcon className="w-8 h-8 text-white" /> */}
                        <img src="/logo5.png" alt="logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200 truncate">
                         Question Bank Solver
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 hidden sm:block">
                            Generate detailed answers for your semester exams.
                        </p>
                    </div>
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
};
