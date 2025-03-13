import * as React from 'react';
import {
  Box,
  Flex,
  Grid,
  Card,
  Select,
} from '@radix-ui/themes';
import ToggleEditor from '../../../../utils/ToggleEditor/ToggleEditor';
import { StudioNavigationButtons } from './StudioNavigationButtons';
import { RecordingLogs } from '../footer/RecordingLogs';
import { VideoTimeEstimationsAndStats } from '../footer/VideoTimeEstimationsAndStats';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { GUIMode, isCourse } from '@fullstackcraftllc/codevideo-types';
import { VirtualLayerLogs } from '../footer/VirtualLayerLogs';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { setCurrentActionIndex, setIsPlaying, setIsSoundOn } from '../../../../../store/editorSlice';
import { SoundToggleButton } from './SoundToggleButton';
import { useClerk } from '@clerk/clerk-react';
import { useIsDesktop } from '../../../../../hooks/useIsDesktop';
import { ExportDropdown } from '../../../../layout/sidebar/ExportDropdown';
import { TutorialCSSClassConstants } from '../../../../layout/sidebar/StudioTutorial';
import { ProjectInfoCard } from './ProjectInfoCard';
import { CodeVideoIDE } from '@fullstackcraftllc/codevideo-ide-react'
import mixpanel from 'mixpanel-browser';

// TODO: ReactMediaRecorder works decently, but we will need user to 1. enable screen recording in browser, 2. allow microphone access, 3. go full full screen
// this hook literally just records the entire browser screen, tabs and all
// const ReactMediaRecorder = lazy(() => import('react-media-recorder').then(module => ({ default: module.ReactMediaRecorder })));

export function MainStudio() {
  const { currentProject, currentActions, currentActionIndex, currentLessonIndex, isFullScreen, isPlaying, isSoundOn, allowFocusInEditor } = useAppSelector((state) => state.editor);
  const { isRecording } = useAppSelector(state => state.recording);
  const { theme } = useAppSelector(state => state.theme);
  const dispatch = useAppDispatch();
  // can't render the monaco editor until clerk is loaded - see https://github.com/clerk/javascript/issues/1643
  const clerk = useClerk();
  const [editorMode, setEditorMode] = useState("editor");
  const isDesktop = useIsDesktop();

  const defaultLanguage = currentProject && isCourse(currentProject.project) ? currentProject.project.primaryLanguage : 'javascript';

  // for external browser
  const isExternalBrowserStepUrl = currentActions[currentActionIndex] && currentActions[currentActionIndex].name === 'external-browser' ?
    currentActions[currentActionIndex].value : null;

  const goToNextAction = () => {
    // if we are playing, move to the next action
    if (isPlaying) {
      // if we are at the end of the actions, stop playing
      if (currentActionIndex === currentActions.length - 1) {
        dispatch(setIsPlaying(false))
      } else {
        // otherwise, move to the next action
        dispatch(setCurrentActionIndex(currentActionIndex + 1))
      }
    }
  }

  // on mount track in mixpanel
  useEffect(() => {
    mixpanel.track('MainStudio Page View');
  }, []);

  let mode: GUIMode = 'step'
  if (isPlaying) {
    mode = 'replay'
  }
  if (isRecording) {
    mode = 'record'
  }

  // for fullscreen, render the editor only
  if (isFullScreen) {
    return (
      <Box
        style={{
          height: '95vh',
          width: '95vw',
        }}
      >
        <StudioNavigationButtons />
        {currentProject && clerk.loaded && <CodeVideoIDE
          theme={theme}
          project={currentProject.project}
          mode={mode}
          allowFocusInEditor={true} // no other options in fullscreen so no conflict of focused elements
          defaultLanguage={defaultLanguage}
          isExternalBrowserStepUrl={isExternalBrowserStepUrl}
          currentActionIndex={currentActionIndex}
          currentLessonIndex={currentLessonIndex}
          isSoundOn={isSoundOn}
          withCaptions={true}
          actionFinishedCallback={goToNextAction}
          speakActionAudios={[]}
        />}
      </Box>
    );
  }

  return (
    <Box
      p="1"
      mt="9"
    >
      <Grid 
      columns={{ initial: '1', md: '3' }} 
      gap="3"
      >
        {/* Left Action Editor */}
        <Box style={{ width: '100%', overflowY: 'auto' }}>
          <Flex direction="row" gap="2" justify="between">
            <ProjectInfoCard />
            {/* only show editor selector on desktop - on mobile fixed to GUI mode */}
            <Card mb="3" className={TutorialCSSClassConstants.EDITOR_SELECTOR} style={{ display: isDesktop ? 'block' : 'none' }}>
              <Flex align="center" justify="center" m="2" mx="5">
                <Select.Root
                  value={editorMode}
                  onValueChange={(value) => setEditorMode(value)}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="editor">GUI Editor</Select.Item>
                    <Select.Item value="json">JSON Editor</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Card>
          </Flex>
          <Card mb="3">
            <ToggleEditor editorMode={editorMode} />
          </Card>
          <Card mb="3">
            <ExportDropdown />
          </Card>
          <Card mb="3" style={{ display: isDesktop ? 'block' : 'none' }}>
            <RecordingLogs />
          </Card>
          <Card mb="3" style={{ display: isDesktop ? 'block' : 'none' }}>
            <VideoTimeEstimationsAndStats />
          </Card>
          <Card mb="3" style={{ display: isDesktop ? 'block' : 'none' }}>
            <VirtualLayerLogs />
          </Card>
        </Box>

        {/* Right - Navigation Buttons and  IDE Preview */}
        <Box style={{ width: '100%', gridColumn: 'span 2' }}>
          <Card>
            <StudioNavigationButtons />
            {/* Advanced Editor */}
            <Box style={{ height: '700px' }}>
              {currentProject && clerk.loaded &&
                <CodeVideoIDE
                  theme={theme}
                  project={currentProject.project}
                  mode={mode}
                  allowFocusInEditor={allowFocusInEditor}
                  defaultLanguage={defaultLanguage}
                  isExternalBrowserStepUrl={isExternalBrowserStepUrl}
                  currentActionIndex={currentActionIndex}
                  currentLessonIndex={currentLessonIndex}
                  isSoundOn={isSoundOn}
                  withCaptions={true}
                  actionFinishedCallback={goToNextAction}
                  speakActionAudios={[]}
                />
              }
              {/* Sound Toggle Button */}
              <Box style={{ zIndex: 50, position: 'absolute', bottom: 10, left: 10 }}>
                <SoundToggleButton isSoundOn={isSoundOn} setIsSoundOn={(isSoundOn) => dispatch(setIsSoundOn(isSoundOn))} />
              </Box>
            </Box>
          </Card>
        </Box>
      </Grid >
    </Box >

  );
}