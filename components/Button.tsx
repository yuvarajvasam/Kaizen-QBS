
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105";
    
    const variantClasses = {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg",
        outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 text-gray-700 dark:text-gray-300",
        secondary: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} px-3 sm:px-4 py-2 sm:py-2 ${className || ''}`;

    return <button className={combinedClasses} {...props} />;
};
