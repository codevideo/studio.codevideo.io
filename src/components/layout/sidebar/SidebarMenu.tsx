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
import { isValidActions, isCourse, isLesson } from '@fullstackcraftllc/codevideo-types';
import { ProjectSelector } from './ProjectSelector';
import { MetadataEditor } from './MetadataEditor';
import { ProjectRenderer } from './ProjectRenderer';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setLocationInStudio, setIsSidebarOpen } from '../../../store/editorSlice';
import { firstCharacterUppercase } from '../../../utils/firstCharacterUppercase';
import { TokensButton } from '../../utils/Buttons/TokensButton';
import { TutorialButton } from '../../utils/Buttons/TutorialButton';
import { WhitepaperButton } from '../../utils/Buttons/WhitepaperButton';
import { TokenCountBadge } from '../../utils/TokenCountBadge';
import { AccountButton } from '../../utils/Buttons/AccountButton';
import { useIsDesktop } from '../../../hooks/useIsDesktop';
import { Link } from 'gatsby';

export function SidebarMenu() {
    const { currentProject, isSidebarOpen } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();
    const isDesktop = useIsDesktop();

    const onCreateNewProject = () => {
        dispatch(setLocationInStudio('select'));
        dispatch(setIsSidebarOpen(false));
    }

    if (!currentProject) {
        return null;
    }

    let currentProjectTitle = '';
    if (currentProject && isCourse(currentProject.project)) {
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
                <Dialog.Description>
                    <VisuallyHidden>Various options and settings for your CodeVideo projects.</VisuallyHidden>
                </Dialog.Description>

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
                            {/* Tokens Button - only shown here in sidebar on mobile wen not signed in */}
                            <SignedOut>
                                <Flex direction="column" gap="2">
                                    <Heading size="4" mb="0" mt="5">Get Free Tokens</Heading>
                                    <Flex>
                                        <TokensButton />
                                    </Flex>
                                </Flex>
                            </SignedOut>

                            <SignedIn>
                                <Flex direction="column" gap="2">
                                    <Heading size="4" mb="0" mt="5">Your Tokens</Heading>
                                    <TokenCountBadge />
                                    <TokensButton style={{ display: isDesktop ? 'none' : 'inline-block' }} />
                                </Flex>
                            </SignedIn>

                            {/* Tutorial Button - only shown here in sidebar on mobile */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">Tutorial</Heading>
                                <Flex>
                                    <TutorialButton />
                                </Flex>
                            </Flex>

                            {/* Project Type Section */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">Current Project</Heading>
                                <ProjectRenderer
                                    userProject={currentProject}
                                    isCurrentProject={true}
                                />
                            </Flex>

                            {/* Metadata Section */}
                            {/* {currentProject.projectType !== 'actions' && (
                                <Flex direction="column" gap="2">
                                    <Heading size="4" mb="0" mt="5">
                                        Edit {firstCharacterUppercase(currentProject.projectType)} Metadata
                                    </Heading>
                                    <MetadataEditor />
                                </Flex>
                            )} */}

                            {/* Export Section */}
                            {/* <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">Export Project</Heading>
                                <ExportDropdown />
                            </Flex> */}

                            {/* TODO: Feature after launch */}
                            {/* Convert Section */}
                            {/* <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">Convert Project</Heading>
                                <ProjectTypeConverter />
                            </Flex> */}

                            {/* Select Other Project */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">Your Projects</Heading>
                                <ProjectSelector />
                            </Flex>

                            {/* Other Actions */}
                            <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">Create New Project</Heading>
                                <Box>
                                    <Button
                                        onClick={onCreateNewProject}
                                        size="1"
                                    >
                                        Create new project...
                                    </Button>
                                </Box>
                            </Flex>

                            {/* FAQ Button - only shown here in sidebar on mobile */}
                            {!isDesktop && <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">FAQ</Heading>
                                <Link to="/faq">
                                    <Button size="1" color="mint">
                                        FAQs
                                    </Button>
                                </Link>
                            </Flex>}

                            {/* Blog Button - only shown here in sidebar on mobile */}
                            {!isDesktop && <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">Blog</Heading>
                                <Link to="https://codevideo.substack.com/">
                                    <Button size="1" color="mint">
                                        Blog
                                    </Button>
                                </Link>
                            </Flex>}

                            {/* WhitePaper Button - only shown here in sidebar on mobile */}
                            {!isDesktop && <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">Whitepaper</Heading>
                                <Flex>
                                    <WhitepaperButton />
                                </Flex>
                            </Flex>}

                            {/* GitHub Button - only shown here in sidebar on mobile */}
                            {!isDesktop && <Flex direction="column" gap="2">
                                <Heading size="4" mb="0" mt="5">GitHub</Heading>
                                <a
                                    href="https://github.com/orgs/codevideo/repositories"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Button
                                        style={{ cursor: 'pointer' }}
                                        size="1"
                                        variant="soft"
                                        color="mint"
                                    >
                                        GitHub
                                    </Button>
                                </a>
                            </Flex>}
                        </Flex>
                    </ScrollArea>
                </Box>
            </Dialog.Content>
        </Dialog.Root>
    );
}