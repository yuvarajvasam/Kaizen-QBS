import React from 'react';

interface CardComponent extends React.FC<{ children: React.ReactNode; className?: string }> {
    Header: React.FC<{ children: React.ReactNode; className?: string }>;
    Title: React.FC<{ children: React.ReactNode; className?: string }>;
    Description: React.FC<{ children: React.ReactNode; className?: string }>;
    Content: React.FC<{ children: React.ReactNode; className?: string }>;
}

export const Card: CardComponent = ({ children, className }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-colors duration-200 ${className}`}>
            {children}
        </div>
    );
};

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`p-4 sm:p-6 ${className}`}>{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <h3 className={`text-base sm:text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white transition-colors duration-200 ${className}`}>{children}</h3>
);

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <p className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200 ${className}`}>{children}</p>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`p-4 sm:p-6  ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
