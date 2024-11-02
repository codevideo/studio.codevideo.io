import React, { useEffect, useState } from 'react';
import { VirtualCodeBlock } from '@fullstackcraftllc/virtual-code-block';
import { IAction, isSpeakAction } from '@fullstackcraftllc/codevideo-types';
import ToggleEditor from '../../utils/ToggleEditor';

import { defaultExampleProject } from './examples/projectExamples';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { ExampleSelector } from './ExampleSelector';
import AdvancedEditor from '../../utils/AdvancedEditor/AdvancedEditor';
import { setCodeIndex } from '../../../store/editorSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

interface StudioPageProps {
    initialActions: IAction[];
    tokenizerCode: string;
}

export function StudioPage(props: StudioPageProps) {
    const { tokenizerCode } = props;
    const { currentProject, actions, codeIndex } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();

    // Get code states for navigation
    const virtualCodeBlock = new VirtualCodeBlock([]);
    if (actions && Array.isArray(actions)) {
        // type guard to validate each action is truly an IAction before applying
        const filteredActions = actions.filter((action): action is IAction => !!action);
        virtualCodeBlock.applyActions(filteredActions);
    }
    const dataAtEachFrame = virtualCodeBlock.getDataForAnnotatedFrames();
    const currentCode = dataAtEachFrame.length >= codeIndex && dataAtEachFrame[codeIndex]?.code || '';
    const captionText = dataAtEachFrame.length >= codeIndex && dataAtEachFrame[codeIndex]?.speechCaptions.map((speechCaption) => speechCaption.speechValue).join(' ');

    const handleFirst = () => {
        dispatch(setCodeIndex(0));
    }

    const handlePrevious = () => {
        dispatch(setCodeIndex(Math.max(0, codeIndex - 1)));
    };

    const handleNext = () => {
        dispatch(setCodeIndex(Math.min(dataAtEachFrame.length - 1, codeIndex + 1)));
    };

    const handleLast = () => {
        dispatch(setCodeIndex(dataAtEachFrame.length - 1));
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <ExampleSelector />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1800px] mx-auto">
                {/* Left/Top Editor */}
                <div className="w-full col-span-1">
                    <ToggleEditor
                        tokenizerCode={tokenizerCode}
                    />
                </div>

                {/* Right/Bottom Editor */}
                <div className="w-full col-span-2">
                    <div className="rounded-lg bg-slate-800 shadow-sm border border-slate-700">
                        {/* Navigation Controls */}
                        <div className="border-b border-slate-700 p-4 flex items-center justify-between bg-slate-800">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleFirst}
                                    disabled={codeIndex === 0}
                                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {'<<'} First
                                </button>
                                <button
                                    onClick={handlePrevious}
                                    disabled={codeIndex === 0}
                                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {'<'} Previous
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={codeIndex === dataAtEachFrame.length - 1}
                                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next {'>'}
                                </button>
                                <button
                                    onClick={handleLast}
                                    disabled={codeIndex === dataAtEachFrame.length - 1}
                                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Last {'>>'}
                                </button>

                            </div>
                            <span className="text-sm text-slate-400">
                                Step {codeIndex + 1} of {Math.max(1, dataAtEachFrame.length)}
                            </span>
                        </div>

                        {/* Advanced Editor */}
                        <div className="h-[500px]">
                            <AdvancedEditor
                                currentProject={currentProject ?? defaultExampleProject}
                                currentCode={currentCode}
                                readOnly={true}
                                onFileSelect={(filePath) => {
                                    console.log('Selected file:', filePath);
                                    // Handle file selection if needed
                                }}
                                captionText={captionText || ''}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudioPage;