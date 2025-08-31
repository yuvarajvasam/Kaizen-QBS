
import React from 'react';

interface LoaderProps {
    message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-white/75 dark:bg-gray-900/75 flex flex-col items-center justify-center z-50 transition-colors duration-200 p-4">
            <svg className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 text-center">{message || 'Processing...'}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 text-center">This might take a moment, please wait.</p>
        </div>
    );
};
