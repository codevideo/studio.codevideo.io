import * as React from 'react';
import { useEffect } from 'react';

export interface IProjectConversionModalProps {
    currentType: 'course' | 'lesson' | 'actions' | '';
    targetType: 'course' | 'lesson' | 'actions' | '';
    onCancel: () => void;
    onConfirm: () => void;
}

export function ProjectConversionModal(props: IProjectConversionModalProps) {
    const { currentType, targetType, onCancel, onConfirm } = props
    // Determine message based on conversion type
    const getMessage = () => {
        // Upgrades
        if (currentType === 'actions' && targetType === 'lesson') {
            return "Your actions will be converted to a lesson with empty metadata. You'll need to fill in details like name and description.";
        }

        if (currentType === 'actions' && targetType === 'course') {
            return "Your actions will be converted to a course with a single lesson. You'll need to fill in the course and lesson metadata.";
        }

        if (currentType === 'lesson' && targetType === 'course') {
            return "Your lesson will be converted to a course containing this lesson. You'll need to fill in the course metadata.";
        }

        // Downgrades (lossy conversions)
        if (currentType === 'course' && targetType === 'actions') {
            return "Warning: All course and lesson metadata will be lost. Your course will be converted to a single array of all actions compiled from each lesson.";
        }

        if (currentType === 'course' && targetType === 'lesson') {
            return "Warning: Course metadata will be lost. All actions from all lessons will be combined into a single lesson, and the metadata from the first lesson will be used.";
        }

        if (currentType === 'lesson' && targetType === 'actions') {
            return "Warning: Lesson metadata will be lost. Only the actions within the lesson will be preserved.";
        }

        return "Are you sure you want to convert your project?";
    };

    useEffect(() => {
        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Confirm Conversion
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {getMessage()}
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Convert
                    </button>
                </div>
            </div>
        </div>
    );
}
