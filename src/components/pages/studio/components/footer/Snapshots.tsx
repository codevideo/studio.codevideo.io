import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { Box, Button, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import Editor, { Monaco } from "@monaco-editor/react";
import { extractActionsFromProject, getBlankInitialSnapshot, ILesson, isCourse, isLesson } from '@fullstackcraftllc/codevideo-types';
import { VirtualIDE } from '@fullstackcraftllc/codevideo-virtual-ide';

const monacoOptions: any = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontFamily: "Fira Code",
    fontSize: 13,
    fontLigatures: true,
    lineNumbers: "off",
    folding: true,
    automaticLayout: true,
    autoIndent: "full",
    wordWrap: "on",
    wrappingIndent: "same",
    wrappingStrategy: "advanced",
}

export function Snapshots() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { currentProject, currentLessonIndex, currentActionIndex } = useAppSelector(state => state.editor);
    const { theme } = useAppSelector((state) => state.theme);
    // can't render the monaco editor until clerk is loaded - see https://github.com/clerk/javascript/issues/1643
    const clerk = useClerk();
    const currentActions = extractActionsFromProject(currentProject?.project || [], currentLessonIndex);

    if (currentProject === undefined) {
        return <Text>No project selected.</Text>;
    }

    if (currentProject.projectType === "actions") {
        return <Text>Action only projects have no snapshots.</Text>
    }

    let lesson: ILesson | null = null;
    if (isCourse(currentProject.project)) {
        lesson = currentProject.project.lessons[currentLessonIndex] || null;
    }
    if (isLesson(currentProject.project)) {
        lesson = currentProject.project
    }

    if (!lesson) {
        return <Text>No lesson selected.</Text>;
    }

    // the only 'guaranteed' snapshot is the initial snapshot
    const initialSnapshotToUse = lesson.initialSnapshot || getBlankInitialSnapshot()
    const initialSnapshotString = JSON.stringify(initialSnapshotToUse, null, 2);

    // the current and final snapshots need to be derived from the current actions
    const projectCopy = JSON.parse(JSON.stringify(currentProject.project));
    const currentVirtualIDE = new VirtualIDE(projectCopy, currentActionIndex)
    const currentSnapshotString = JSON.stringify(currentVirtualIDE.getCourseSnapshot(), null, 2);
    const finalSnapshotIDE = new VirtualIDE(currentProject.project, currentActions.length - 1);
    const finalSnapshotString = JSON.stringify(finalSnapshotIDE.getCourseSnapshot(), null, 2);

    return (
        <Box>
            <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                color="mint"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                <svg
                    style={{
                        width: '16px',
                        height: '16px',
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Snapshots
            </Button>

            {isExpanded && (
                <Box style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                    <Box>
                        {/* Initial snapshot */}
                        {clerk.loaded && <Editor
                            theme={theme === "light" ? "vs" : "vs-dark"}
                            path={"initial-snapshot.json"}
                            width="100%"
                            height="100%"
                            defaultLanguage={"json"}
                            language={"json"}
                            value={initialSnapshotString}
                            options={monacoOptions}
                        />}
                    </Box>
                    <Box>
                        {/* Current snapshot */}
                        {clerk.loaded && <Editor
                            theme={theme === "light" ? "vs" : "vs-dark"}
                            path={"current-snapshot.json"}
                            width="100%"
                            height="100%"
                            defaultLanguage={"json"}
                            language={"json"}
                            value={currentSnapshotString}
                            options={monacoOptions}
                        />}
                    </Box>
                    <Box>
                        {/* Final snapshot */}
                        {clerk.loaded && <Editor
                            theme={theme === "light" ? "vs" : "vs-dark"}
                            path={"final-snapshot.json"}
                            width="100%"
                            height="100%"
                            defaultLanguage={"json"}
                            language={"json"}
                            value={finalSnapshotString}
                            options={monacoOptions}
                        />}
                    </Box>
                </Box>
            )}
        </Box>
    );
}