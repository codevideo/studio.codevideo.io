import * as React from 'react';
import {
    Box,
    Flex,
    Heading,
    Button,
    ScrollArea,
    Dialog
} from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { ProjectTypeConverter } from './ProjectTypeConverter';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { createNewProject, setIsSidebarOpen } from '../../../../../store/editorSlice';
import { isValidActions, isCourse, isLesson } from '@fullstackcraftllc/codevideo-types';
import { ProjectSelector } from './ProjectSelector';
import { MetadataEditor } from './MetadataEditor';
import { ExportDropdown } from './ExportDropdown';
import { firstCharacterUppercase } from '../../../../../utils/firstCharacterUppercase';
import { ProjectRenderer } from './ProjectRenderer';
import { startTutorial } from '../../../../../store/tutorialSlice';

export function SidebarMenu() {
    const { currentProject, isSidebarOpen } = useAppSelector(state => state.editor);
    const { isTutorialRunning } = useAppSelector(state => state.tutorial);
    const dispatch = useAppDispatch();

    const onCreateNewProject = () => {
        dispatch(createNewProject());
        dispatch(setIsSidebarOpen(false));
    }

    const onClickStartTutorial = () => {
        dispatch(startTutorial());
        dispatch(setIsSidebarOpen(false));
    }

    if (!currentProject) {
        return null;
    }

    let currentProjectTitle = '';
    if (isCourse(currentProject?.project)) {
        currentProjectTitle = currentProject.project.name;
    } else if (isLesson(currentProject?.project)) {
        currentProjectTitle = currentProject.project.name;
    } else if (isValidActions(currentProject?.project)) {
        currentProjectTitle = '';
    }

    return (
        <Dialog.Root open={isSidebarOpen} onOpenChange={(open) => dispatch(setIsSidebarOpen(open))}>

            {/* Sidebar content */}
            <Dialog.Content style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100%',
                width: '320px',
                backgroundColor: 'var(--gray-1)',
                zIndex: 40,
                boxShadow: 'var(--shadow-5)',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
            }}>
                <Dialog.Title >
                    <VisuallyHidden>Project Sidebar</VisuallyHidden>
                </Dialog.Title>

                {/* Close button */}
                <Dialog.Close>
                    <Button
                        onClick={() => dispatch(setIsSidebarOpen(false))}
                        variant="ghost"
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        <Cross2Icon />
                    </Button>
                </Dialog.Close>

                <Box position="relative" height="100%">
                    <ScrollArea style={{ height: '100%' }}>
                        <Flex
                            direction="column"
                            gap="3"
                            mt="6"
                        >
                            {/* Tutorial Button */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="3">Tutorial</Heading>
                                <Flex>
                                <Button disabled={isTutorialRunning} onClick={onClickStartTutorial}>
                                    Start Interactive Tutorial
                                </Button>
                                </Flex>
                            </Flex>

                            {/* Project Type Section */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="3">Current Project</Heading>
                                <ProjectRenderer
                                    userProject={currentProject}
                                    isCurrentProject={true}
                                />
                            </Flex>

                            {/* Metadata Section */}
                            {currentProject.projectType !== 'actions' && (
                                <Flex direction="column" gap="2">
                                    <Heading size="4" mb="3">
                                        Edit {firstCharacterUppercase(currentProject.projectType)} Metadata
                                    </Heading>
                                    <MetadataEditor />
                                </Flex>
                            )}

                            {/* Export Section */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="3">Export Project</Heading>
                                <ExportDropdown />
                            </Flex>

                            {/* Convert Section */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="3">Convert Project</Heading>
                                <ProjectTypeConverter />
                            </Flex>

                            {/* Select Other Project */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="3">Your Projects</Heading>
                                <ProjectSelector />
                            </Flex>

                            {/* Other Actions */}
                            <Box>
                                <Button onClick={onCreateNewProject}>
                                    Create New Project
                                </Button>
                            </Box>
                        </Flex>
                    </ScrollArea>
                </Box>
            </Dialog.Content>
        </Dialog.Root>
    );
}