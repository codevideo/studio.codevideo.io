import * as React from 'react';
import {
  Box,
  Flex,
  Grid,
  Card,
  Text,
  Code,
  Select,
} from '@radix-ui/themes';
import { AdvancedEditor } from '../../../../utils/AdvancedEditor/AdvancedEditor';
import ToggleEditor from '../../../../utils/ToggleEditor/ToggleEditor';
import { StudioNavigationButtons } from './StudioNavigationButtons';
import { SidebarMenu } from '../sidebar/SidebarMenu';
import { RecordingLogs } from '../footer/RecordingLogs';
import { VideoTimeEstimationsAndStats } from '../footer/VideoTimeEstimationsAndStats';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { LessonCounter } from '../../../../utils/LessonCounter';
import { useState } from 'react';
import { GUIMode, ICourse, isCourse } from '@fullstackcraftllc/codevideo-types';
import { VirtualLayerLogs } from '../footer/VirtualLayerLogs';
import { LessonAdder } from '../../../../utils/LessonAdder';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { setCurrentActionIndex, setIsPlaying, setIsSoundOn } from '../../../../../store/editorSlice';
import { TutorialCSSClassConstants } from '../sidebar/StudioTutorial';
import { ExportDropdown } from '../sidebar/ExportDropdown';
import { SoundToggleButton } from './SoundToggleButton';

export function MainStudio() {
  const { currentProject, currentActions, currentActionIndex, currentLessonIndex, isFullScreen, isPlaying, isSoundOn } = useAppSelector((state) => state.editor);
  const { isRecording } = useAppSelector(state => state.recording);
  const dispatch = useAppDispatch();
  const [editorMode, setEditorMode] = useState("editor");

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
        {currentProject && <AdvancedEditor
          project={currentProject.project}
          mode={mode}
          defaultLanguage={defaultLanguage}
          isExternalBrowserStepUrl={isExternalBrowserStepUrl}
          actions={currentActions}
          currentActionIndex={currentActionIndex}
          currentLessonIndex={currentLessonIndex}
          isSoundOn={isSoundOn}
          actionFinishedCallback={goToNextAction}
        />}
      </Box>
    );
  }

  return (
    <>
      <SidebarMenu />
      <Box

        p="1"
        mt="9"
      >
        <Grid columns={{ initial: '1', md: '3' }} gap="3">
          {/* Left Action Editor */}
          <Box style={{ width: '100%', height: '760px', overflowY: 'auto' }}>
            <Flex direction="row" gap="2" justify="between">
              <Card mb="3" className={TutorialCSSClassConstants.PROJECT_INFO_BOX}>
                <Flex gap="2" align="center" justify="between">
                  <Flex direction="column">
                    <Text size="1" mb="1">{(currentProject?.project as ICourse).name}</Text>
                    <Flex align="center" gap="2">
                      <Code size="1" className={TutorialCSSClassConstants.PROJECT_INFO_PROJECT_TYPE}>{currentProject?.projectType}</Code>
                      <LessonCounter />
                      <LessonAdder />
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
              <Card mb="3" className={TutorialCSSClassConstants.EDITOR_SELECTOR}>
                <Flex align="center" justify="center" mt="1">
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
            <Card mb="3">
              <RecordingLogs />
            </Card>
            <Card mb="3">
              <VideoTimeEstimationsAndStats />
            </Card>
            <Card mb="3">
              <VirtualLayerLogs />
            </Card>
          </Box>

          {/* Right - Navigation Buttons and  IDE Preview */}
          <Box style={{ width: '100%', gridColumn: 'span 2' }}>
            <Card>
              <StudioNavigationButtons />
              {/* Advanced Editor */}
              <Box style={{ height: '700px' }}>
                {currentProject && <AdvancedEditor
                  project={currentProject.project}
                  mode={mode}
                  defaultLanguage={defaultLanguage}
                  isExternalBrowserStepUrl={isExternalBrowserStepUrl}
                  actions={currentActions}
                  currentActionIndex={currentActionIndex}
                  currentLessonIndex={currentLessonIndex}
                  isSoundOn={isSoundOn}
                  actionFinishedCallback={goToNextAction}
                />}
                {/* Sound Toggle Button */}
                <Box style={{ zIndex: 50, position: 'absolute', bottom: 10, left: 10 }}>
                  <SoundToggleButton isSoundOn={isSoundOn} setIsSoundOn={(isSoundOn) => dispatch(setIsSoundOn(isSoundOn))} />
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid >
      </Box >
    </>
  );
}