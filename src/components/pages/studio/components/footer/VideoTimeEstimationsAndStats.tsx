import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { estimateVideoDurationInSeconds } from '../../../../../utils/estimateVideoDurationInSeconds';
import { formatDuration } from '../../../../../utils/formatDuration';


export function VideoTimeEstimationsAndStats() {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { currentActions } = useAppSelector(state => state.editor);

    const { totalDuration, longestSpeakActionDuration, longestSpeakActionIndex, longestCodeActionDuration, longestCodeActionIndex } = estimateVideoDurationInSeconds(currentActions);
    const numClips = Math.ceil(totalDuration / 4);
    const avgClipDuration = Math.ceil(totalDuration / numClips);
    const generationTimeM4 = Math.ceil(numClips / 18);
    const generationTimeDigitalOcean = Math.ceil(numClips / 4);

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
                Video Time Estimations & Stats
            </button>

            {isExpanded && (
                <div className="mt-2 rounded-lg bg-slate-800 p-4 text-slate-200 shadow-sm border border-slate-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-sm">Total Actions: <span className="font-medium">{currentActions.length}</span></p>
                            <p className="text-sm">Estimated Video Length: <span className="font-medium">{formatDuration(totalDuration)} ({numClips} clips at {formatDuration(avgClipDuration)})</span></p>
                            <p className="text-sm">Estimated Video Generation Times: </p>
                                <p className='text-xs'>- Parallel cloud arch: <span className="font-medium">{formatDuration(longestSpeakActionDuration)}</span> (never longer than longest action)</p>
                                <p className='text-xs'>- 64 GB Apple Silicon: <span className="font-medium">{formatDuration(generationTimeM4)}</span></p>
                                <p className='text-xs'>- 4 GB Intel: <span className="font-medium">{formatDuration(generationTimeDigitalOcean)}</span></p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm mb-1">Longest Estimated Speak Action: <span className="font-medium">{formatDuration(longestSpeakActionDuration)}</span> (Step {longestSpeakActionIndex + 1})</p>
                                <pre className="text-xs bg-slate-900 p-2 rounded overflow-auto">
                                    {JSON.stringify(currentActions[longestSpeakActionIndex], null, 2)}
                                </pre>
                            </div>
                            <div>
                                <p className="text-sm mb-1">Longest Estimated Code Action: <span className="font-medium">{formatDuration(longestCodeActionDuration)}</span> (Step {longestCodeActionIndex + 1})</p>
                                <pre className="text-xs bg-slate-900 p-2 rounded overflow-auto">
                                    {JSON.stringify(currentActions[longestCodeActionIndex], null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}