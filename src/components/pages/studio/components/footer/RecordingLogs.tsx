import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';

export function RecordingLogs() {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { atomicRecordedActions, collectedRecordedActions } = useAppSelector(state => state.recording);

    return (
        <div className="mt-4 max-w-[1800px] mx-auto">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
                <svg
                    className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Recording Logs
            </button>
            
            {isExpanded && (
                <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-800 p-4 text-slate-200 shadow-sm border border-slate-700">
                        <h3 className="text-sm font-medium mb-2">Atomic Actions</h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(atomicRecordedActions, null, 2)}
                        </pre>
                    </div>
                    <div className="rounded-lg bg-slate-800 p-4 text-slate-200 shadow-sm border border-slate-700">
                        <h3 className="text-sm font-medium mb-2">Collected (Simplified)</h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(collectedRecordedActions, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}