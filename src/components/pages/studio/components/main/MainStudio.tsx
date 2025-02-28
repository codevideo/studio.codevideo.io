import * as React from 'react';
import {
  Box,
  Flex,
  Grid,
  Card,
  Container
} from '@radix-ui/themes';
import { AdvancedEditor } from '../../../../utils/AdvancedEditor/AdvancedEditor';
import ToggleEditor from '../../../../utils/ToggleEditor/ToggleEditor';
import { StudioNavigationButtons } from './StudioNavigationButtons';
import { SidebarMenu } from '../sidebar/SidebarMenu';
import { RecordingLogs } from '../footer/RecordingLogs';
import { VideoTimeEstimationsAndStats } from '../footer/VideoTimeEstimationsAndStats';

export function MainStudio() {
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
            <Card>
              <ToggleEditor />
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
        </Flex>

      </Box>
    </>
  );
}