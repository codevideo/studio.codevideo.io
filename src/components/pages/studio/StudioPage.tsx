import React, { useState } from 'react';
import { VirtualCodeBlock } from '@fullstackcraftllc/virtual-code-block';
import { IAction, isSpeakAction } from '@fullstackcraftllc/codevideo-types';
import ToggleEditor from '../../utils/ToggleEditor';
import AdvancedEditor from '../../utils/AdvancedEditor';
import { defaultExampleProject } from './examples/projectExamples';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { ExampleSelector } from './ExampleSelector';

interface StudioPageProps {
    initialActions: IAction[];
    tokenizerCode: string;
}

export function StudioPage(props: StudioPageProps) {
    const { tokenizerCode } = props;
    const { currentProject, actions } = useAppSelector(state => state.editor);
    const [stepsJson, setStepsJson] = useState('');
    const [codeIndex, setCodeIndex] = useState(0);

    // Get code states for navigation
    const virtualCodeBlock = new VirtualCodeBlock([]);
    console.log(actions)
    virtualCodeBlock.applyActions(actions);
    const dataAtEachFrame = virtualCodeBlock.getDataForAnnotatedFrames();
    const currentCode = dataAtEachFrame[codeIndex]?.code || '';
    console.log(dataAtEachFrame[codeIndex]?.speechCaptions)
    const captionText = dataAtEachFrame[codeIndex]?.speechCaptions.map((speechCaption) => speechCaption.speechValue).join(' ');

    const handleFirst = () => {
        setCodeIndex(0);
    }

    const handlePrevious = () => {
        setCodeIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCodeIndex(prev => Math.min(dataAtEachFrame.length - 1, prev + 1));
    };

    const handleLast = () => {
        setCodeIndex(dataAtEachFrame.length - 1)
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <ExampleSelector />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1800px] mx-auto">
                {/* Left/Top Editor */}
                <div className="w-full">
                    <ToggleEditor
                        stepsJson={stepsJson}
                        setStepsJson={setStepsJson}
                        tokenizerCode={tokenizerCode}
                    />
                </div>

                {/* Right/Bottom Editor */}
                <div className="w-full">
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
                            <>
                                {(typeof window !== 'undefined') && <AdvancedEditor
                                    currentProject={currentProject ?? defaultExampleProject}
                                    currentCode={currentCode}
                                    readOnly={true}
                                    onFileSelect={(filePath) => {
                                        console.log('Selected file:', filePath);
                                        // Handle file selection if needed
                                    }}
                                    captionText={captionText}
                                />}
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}