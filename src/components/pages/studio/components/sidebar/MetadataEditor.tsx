import React from 'react';
import { useState } from "react";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { CourseMetadataForm } from "./CourseMetadataForm";
import { LessonMetadataForm } from "./LessonMetadataForm";

export const MetadataEditor: React.FC = () => {
    const { currentProject } = useAppSelector(state => state.editor);
    const [isOpen, setIsOpen] = useState(false);
    
    const onClickCancel = () => {
        setIsOpen(false);
    }

    return (
        <div>
            {/* Edit Metadata Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Edit Metadata
            </button>

            {/* Metadata Form Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl">
                        {currentProject?.projectType === 'lesson' ? (
                            <LessonMetadataForm forCourse={false} onClickCancel={onClickCancel} />
                        ) : currentProject?.projectType === 'course' ? (
                            <CourseMetadataForm onClickCancel={onClickCancel} />
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                                <div className="text-center text-slate-600 dark:text-slate-300">
                                    Switch to "Lesson" or "Course" mode to edit metadata
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={onClickCancel}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};