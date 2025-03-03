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
import { ICourse } from '@fullstackcraftllc/codevideo-types';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { VirtualIDELogs } from '../footer/VirtualIDELogs';
import { LessonAdder } from '../../../../utils/LessonAdder';

export function MainStudio() {
  const { currentProject, isFullScreen } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [editorMode, setEditorMode] = useState("editor");

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
        <AdvancedEditor
          mode="step"
        />
      </Box>
    );
  }

  return (
    <>
      <SidebarMenu />
      <Box
        style={{
          minHeight: '100vh',
          padding: '1rem'
        }}
        mt="9"
      >
        <Grid columns={{ initial: '1', md: '3' }} gap="3">
          {/* Left Action Editor */}
          <Box style={{ width: '100%', height: '650px' }}>
            <Card mb="3">
              <Flex gap="2" align="center" justify="between">
                <Flex direction="column">
                  <Text size="1" mb="1">{(currentProject?.project as ICourse).name}</Text>
                  <Flex align="center" gap="2">
                    <Code size="1">{currentProject?.projectType}</Code>
                    <LessonCounter />
                    <LessonAdder/>
                  </Flex>
                </Flex>
                {/* <LessonCounter />
                <Button color='mint'>Add Lesson</Button> */}
                <Flex gap="2" align="center" justify="between">
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
              </Flex>
            </Card>
            <Card>
              <ToggleEditor editorMode={editorMode} />
            </Card>
          </Box>

          {/* Right IDE Preview */}
          <Box style={{ width: '100%', gridColumn: 'span 2' }}>
            <Card>
              <StudioNavigationButtons />
              {/* Advanced Editor */}
              <Box style={{ height: '700px' }}>
                <AdvancedEditor
                  mode="step"
                />
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Under both additional details */}
        <Flex direction="column" justify="start" align="start" gap="2" mt="4" style={{ width: '100%', gridColumn: 'span 2' }}>
          <RecordingLogs />
          <VideoTimeEstimationsAndStats />
          <VirtualIDELogs />
        </Flex>

      </Box>
    </>
  );
}