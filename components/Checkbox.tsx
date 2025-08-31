
import React from 'react';

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    count: number;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange, disabled, count }) => {
    const hasQuestions = count > 0;
    const isDisabled = disabled || !hasQuestions;

    return (
        <div className="flex items-center">
            <input
                id={id}
                type="checkbox"
                checked={checked && hasQuestions}
                onChange={(e) => onChange(e.target.checked)}
                disabled={isDisabled}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 transition-colors duration-200"
            />
            <label htmlFor={id} className={`ml-2 block text-xs sm:text-sm transition-colors duration-200 ${isDisabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {label} ({count} questions)
            </label>
        </div>
    );
};
