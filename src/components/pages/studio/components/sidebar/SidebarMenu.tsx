import * as React from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Code,
    ScrollArea,
    Dialog
} from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { ProjectTypeConverter } from './ProjectTypeConverter';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { createNewProject, setIsSidebarOpen } from '../../../../../store/editorSlice';
import { isActions, isCourse, isLesson } from '@fullstackcraftllc/codevideo-types';
import { ProjectSelector } from './ProjectSelector';
import { MetadataEditor } from './MetadataEditor';
import { ExportDropdown } from './ExportDropdown';
import { firstCharacterUppercase } from '../../../../../utils/firstCharacterUppercase';

export function SidebarMenu() {
    const { currentProject, isSidebarOpen } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();

    const onCreateNewProject = () => {
        dispatch(createNewProject());
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
    } else if (isActions(currentProject?.project)) {
        currentProjectTitle = '<no name>';
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
                boxShadow: 'var(--shadow-5)'
            }}>
                <Dialog.Title >
                    <VisuallyHidden>Project Sidebar</VisuallyHidden>
                </Dialog.Title>

                <Box position="relative" height="100%">
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

                    <ScrollArea style={{ height: '100%' }}>
                        <Flex
                            direction="column"
                            gap="6"
                            style={{ paddingTop: '5rem' }}
                        >
                            {/* Project Type Section */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="3">Project Info</Heading>
                                <Text mb="2">
                                    Current Project: 
                                </Text>
                                <Code>{currentProjectTitle}</Code>
                                <Text mb="2">
                                    Project type: 
                                </Text>
                                <Code>{currentProject?.projectType}</Code>
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
                                <Button
                                    onClick={onCreateNewProject}
                                                                >
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