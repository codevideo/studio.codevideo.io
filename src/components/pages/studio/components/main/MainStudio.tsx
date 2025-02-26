import * as React from 'react';
import { AdvancedEditor } from '../../../../utils/AdvancedEditor/AdvancedEditor';
import ToggleEditor from '../../../../utils/ToggleEditor/ToggleEditor';
import { StudioNavigation } from './StudioNavigation';
import { SidebarMenu } from '../sidebar/SidebarMenu';
import { RecordingLogs } from '../footer/RecordingLogs';
import { VideoTimeEstimationsAndStats } from '../footer/VideoTimeEstimationsAndStats';

export function MainStudio() {
    return (
        <>
            <SidebarMenu/>
            <div className="min-h-screen bg-slate-50 p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1800px] mx-auto">

                    {/* Left/Top Editor */}
                    <div className="w-full col-span-1">
                        <ToggleEditor />
                    </div>
                    {/* Right/Bottom Editor */}
                    <div className="w-full col-span-2">
                        <div className="rounded-lg bg-slate-800 shadow-sm border border-slate-700">
                            <StudioNavigation />
                            {/* Advanced Editor */}
                            <div className="h-[500px]">
                                <AdvancedEditor
                                    mode="step"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <RecordingLogs />
                    <VideoTimeEstimationsAndStats />
                </div>
            </div>
        </>
    );
}
