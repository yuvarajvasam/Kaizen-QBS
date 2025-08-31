
import React from 'react';
import { Button } from './Button';
import { Switch } from './Switch';
import { Card } from './Card';

interface OptionsSelectorProps {
    questions: string;
    setQuestions: (value: string) => void;
    groupQuestions: boolean;
    setGroupQuestions: (value:boolean) => void;
    onGenerate: () => void;
    disabled: boolean;
}

export const OptionsSelector: React.FC<OptionsSelectorProps> = ({
    questions,
    setQuestions,
    groupQuestions,
    setGroupQuestions,
    onGenerate,
    disabled
}) => {
    return (
        <Card>
            <Card.Header>
                <Card.Title>Step 2: Configure & Generate</Card.Title>
                <Card.Description>Paste the questions, choose your options, and let the AI work its magic.</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
                <div>
                    <label htmlFor="questions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                        Questions for Selected Module
                    </label>
                    <textarea
                        id="questions"
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                        placeholder="Paste the questions you want solutions for here. For example:
1. Explain the architecture of a transformer model.
2. What are the main differences between BERT and GPT?"
                        className="w-full h-32 sm:h-40 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                        disabled={disabled}
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md transition-colors duration-200 gap-3 sm:gap-0">
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">Group Related Questions</span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Organize questions into logical topics.</span>
                    </div>
                    <Switch
                        checked={groupQuestions}
                        onCheckedChange={setGroupQuestions}
                        disabled={disabled}
                    />
                </div>
                <Button onClick={onGenerate} disabled={disabled || !questions.trim()} className="w-full">
                    {disabled ? 'Generating...' : 'Generate Solution'}
                </Button>
            </Card.Content>
        </Card>
    );
};
