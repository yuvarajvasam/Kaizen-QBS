
import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Switch } from './Switch';
import { Checkbox } from './Checkbox';
import { QuestionBank } from '../services/geminiService';

interface ModuleSelectorProps {
    questionBank: QuestionBank;
    onGenerate: (selectedQuestions: string[] | string, group: boolean, moduleInfo: { moduleNumber: number; selectedParts: string[] }) => void;
    onReset: () => void;
    disabled: boolean;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({ questionBank, onGenerate, onReset, disabled }) => {
    const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
    const [selectedParts, setSelectedParts] = useState<Record<string, boolean>>({ A: true, B: true, C: false });
    const [groupQuestions, setGroupQuestions] = useState<boolean>(true);

    const activeModule = questionBank.modules[selectedModuleIndex];

    const questionsToDisplay = useMemo(() => {
        if (!activeModule) return [];
        let questions: string[] = [];
        if (selectedParts.A) questions = questions.concat(activeModule.parts.A);
        if (selectedParts.B) questions = questions.concat(activeModule.parts.B);
        if (selectedParts.C) questions = questions.concat(activeModule.parts.C);
        return questions;
    }, [activeModule, selectedParts]);

    const handlePartChange = (part: 'A' | 'B' | 'C', isChecked: boolean) => {
        setSelectedParts(prev => ({ ...prev, [part]: isChecked }));
    };

    const handleGenerateClick = () => {
        const selectedPartsArray = Object.entries(selectedParts)
            .filter(([_, isSelected]) => isSelected)
            .map(([part, _]) => part);
        
        // Create questions array in the correct order (A → B → C)
        let orderedQuestions: string[] = [];
        
        // Add Part A questions first
        if (selectedParts.A) {
            orderedQuestions = orderedQuestions.concat(activeModule.parts.A);
        }
        
        // Add Part B questions second
        if (selectedParts.B) {
            orderedQuestions = orderedQuestions.concat(activeModule.parts.B);
        }
        
        // Add Part C questions third
        if (selectedParts.C) {
            orderedQuestions = orderedQuestions.concat(activeModule.parts.C);
        }
        
        // Create structured questions string with part information
        let structuredQuestions = '';
        let questionIndex = 1;
        
        if (selectedParts.A && activeModule.parts.A.length > 0) {
            structuredQuestions += `\n--- PART A (${activeModule.parts.A.length} questions) ---\n`;
            activeModule.parts.A.forEach((question, i) => {
                structuredQuestions += `${questionIndex}. ${question}\n`;
                questionIndex++;
            });
        }
        
        if (selectedParts.B && activeModule.parts.B.length > 0) {
            structuredQuestions += `\n--- PART B (${activeModule.parts.B.length} questions) ---\n`;
            activeModule.parts.B.forEach((question, i) => {
                structuredQuestions += `${questionIndex}. ${question}\n`;
                questionIndex++;
            });
        }
        
        if (selectedParts.C && activeModule.parts.C.length > 0) {
            structuredQuestions += `\n--- PART C (${activeModule.parts.C.length} questions) ---\n`;
            activeModule.parts.C.forEach((question, i) => {
                structuredQuestions += `${questionIndex}. ${question}\n`;
                questionIndex++;
            });
        }
        
        onGenerate(structuredQuestions, groupQuestions, {
            moduleNumber: activeModule.module,
            selectedParts: selectedPartsArray
        });
    };

    return (
        <Card>
            <Card.Header>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                    <div>
                        <Card.Title>Step 2: Select Questions & Generate</Card.Title>
                        <Card.Description>Choose a module and parts, then generate your solution. You can return here later to select other modules.</Card.Description>
                    </div>
                     <Button onClick={onReset} variant="outline" disabled={disabled} className="w-full sm:w-auto">
                        Start Over
                    </Button>
                </div>
            </Card.Header>
            <Card.Content className="space-y-4">
                {/* Module Tabs */}
                <div>
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Select Module</span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2">
                        {questionBank.modules.map((module, index) => (
                            <button
                                key={module.module}
                                onClick={() => setSelectedModuleIndex(index)}
                                disabled={disabled}
                                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 disabled:opacity-50 ${
                                    selectedModuleIndex === index
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                Mod {module.module}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Part Selection */}
                <div>
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Select Parts</span>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                        <Checkbox
                            id="partA"
                            label="Part A"
                            checked={selectedParts.A}
                            onChange={(c) => handlePartChange('A', c)}
                            disabled={disabled}
                            count={activeModule?.parts.A.length || 0}
                        />
                         <Checkbox
                            id="partB"
                            label="Part B"
                            checked={selectedParts.B}
                            onChange={(c) => handlePartChange('B', c)}
                            disabled={disabled}
                            count={activeModule?.parts.B.length || 0}
                        />
                         <Checkbox
                            id="partC"
                            label="Part C"
                            checked={selectedParts.C}
                            onChange={(c) => handlePartChange('C', c)}
                            disabled={disabled}
                            count={activeModule?.parts.C.length || 0}
                        />
                    </div>
                </div>

                {/* Questions Preview */}
                <div className="h-32 sm:h-48 p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 overflow-y-auto transition-colors duration-200">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">Selected Questions ({questionsToDisplay.length})</h4>
                    {questionsToDisplay.length > 0 ? (
                        <div className="space-y-2">
                            {selectedParts.A && activeModule.parts.A.length > 0 && (
                                <div>
                                    <h5 className="font-medium text-primary-600 dark:text-primary-400 text-xs sm:text-sm">Part A ({activeModule.parts.A.length} questions)</h5>
                                    <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                                        {activeModule.parts.A.map((q, i) => <li key={`A-${i}`}>{q}</li>)}
                                    </ol>
                                </div>
                            )}
                            {selectedParts.B && activeModule.parts.B.length > 0 && (
                                <div>
                                    <h5 className="font-medium text-primary-600 dark:text-primary-400 text-xs sm:text-sm">Part B ({activeModule.parts.B.length} questions)</h5>
                                    <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                                        {activeModule.parts.B.map((q, i) => <li key={`B-${i}`}>{q}</li>)}
                                    </ol>
                                </div>
                            )}
                            {selectedParts.C && activeModule.parts.C.length > 0 && (
                                <div>
                                    <h5 className="font-medium text-primary-600 dark:text-primary-400 text-xs sm:text-sm">Part C ({activeModule.parts.C.length} questions)</h5>
                                    <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                                        {activeModule.parts.C.map((q, i) => <li key={`C-${i}`}>{q}</li>)}
                                    </ol>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 italic text-center mt-6 sm:mt-8 transition-colors duration-200">Select a part with questions to see a preview.</p>
                    )}
                </div>

                {/* Options and Generate Button */}
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
                <Button onClick={handleGenerateClick} disabled={disabled || questionsToDisplay.length === 0} className="w-full">
                    {disabled ? 'Generating...' : 'Generate Solution'}
                </Button>
            </Card.Content>
        </Card>
    );
};
