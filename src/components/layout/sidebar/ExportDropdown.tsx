import React, { useEffect, useState } from 'react';
import { ExportType, extractActionsFromProject } from '@fullstackcraftllc/codevideo-types';
import { exportProject, generatePngsFromActions } from '@fullstackcraftllc/codevideo-exporters';
import { 
  Flex, 
  Box, 
  Button, 
  Select,
  Text
} from '@radix-ui/themes';
import mixpanel from "mixpanel-browser";
import { useAuth, useUser } from '@clerk/clerk-react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useGifRecorder } from '../../../hooks/useGifRecorder';
import { setCurrentActionIndex, setIsPlaying } from '../../../store/editorSlice';
import { decrementTokens } from '../../../utils/api/decrementTokens';
import { setShowSignUpOverlay } from '../../../store/authSlice';
import { addToast } from '../../../store/toastSlice';
import { TokenCosts } from '../../../constants/TokenCosts';
import { CODEVIDEO_IDE_ID } from '@fullstackcraftllc/codevideo-ide-react';
import { renderCodeVideoIDEToHtmlStringAtActionIndex } from '../../../utils/renderCodeVideoIDEToHtmlStringAtActionIndex';

export const ExportDropdown = () => {
  const { projects, currentProjectIndex, currentLessonIndex, isPlaying } = useAppSelector(state => state.editor);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<ExportType | 'gif'>('json');
  const [exportComplete, setExportComplete] = useState(false);
  const dispatch = useAppDispatch();
  const { getToken } = useAuth()
  const { user } = useUser();

  // if they just finished exporting, refresh the user (need to refresh to get new token count)
  useEffect(() => {
    if (exportComplete) {
      user?.reload();
    }
  }, [exportComplete]);

  // if we are in gifmode, start recording
  const { progress } = useGifRecorder(CODEVIDEO_IDE_ID, exportType === 'gif' && isPlaying, 100)

  useEffect(() => {
    if (progress === 100) {
      setExportComplete(true);
      setIsExporting(false);
    }
  }, [progress])

  const project = projects[currentProjectIndex]?.project;
  
  const handleExportChange = (value: string) => {
    setExportType(value as ExportType);
    setExportComplete(false);
  };
  
  const handleExport = async () => {
    if (!exportType) {
      console.error('No export type selected');
      return;
    }

    if (!project) {
      console.error('No project to export');
      return;
    }

    mixpanel.track(`Export Type ${exportType.toUpperCase()} Clicked Studio`);

    // if the export is json or markdown, we can export it
    // without a clerk token or being logged in
    if (exportType === 'json' || exportType === 'markdown') {
      setIsExporting(true);
      setExportComplete(false);
      try {
        console.log('exporting project:', project, 'as', exportType);
        await exportProject(project, exportType);
        mixpanel.track(`Export Type ${exportType.toUpperCase()} Completed Studio`);
        setExportComplete(true);
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        setIsExporting(false);
      }
      return;
    }

    // all other types require a clerk token and thus a login
    const token = await getToken();
    if (token === null) {
      // show signup
      dispatch(setShowSignUpOverlay(true));
      return;
    }

    // if they have no tokens, show toast
    if (user?.publicMetadata.tokens as number < TokenCosts[exportType]) {
      dispatch(addToast(`Not enough tokens for a ${exportType} export. Please purchase more tokens.`));
      return;
    }

    if (exportType === 'gif') {
      // handled by hook
      dispatch(setCurrentActionIndex(0));
      dispatch(setIsPlaying(true));
      setIsExporting(true);
      return;
    }

    if (exportType === 'png') {
      // png export is also slightly different, generate an html string for CodeVideo at every action
      const htmlStrings = [];
      const actions = extractActionsFromProject(project, currentLessonIndex);
      for (let i = 0; i < actions.length; i++) {
        const htmlString = renderCodeVideoIDEToHtmlStringAtActionIndex(project, i);
        htmlStrings.push(htmlString);
      }
      await generatePngsFromActions(htmlStrings);
    }

    setIsExporting(true);
    setExportComplete(false);
    
    try {
      console.log('exporting project:', project, 'as', exportType);
      await exportProject(project, exportType);
      mixpanel.track(`Export Type ${exportType.toUpperCase()} Completed Studio`);
      setExportComplete(true);

      // decrement tokens
      await decrementTokens(token, TokenCosts[exportType], dispatch);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Flex align="center" justify="between" gap="2">
      <Box>
        <Text size="1" mr="2">Export to...</Text>
        <Select.Root
          value={exportType}
          onValueChange={handleExportChange}
          disabled={isExporting}
        >
          <Select.Trigger 
            variant="surface" 
          />
          <Select.Content>
            <Select.Item value="json">JSON</Select.Item>
            <Select.Item value="markdown">Markdown</Select.Item>
            <Select.Item value="gif">GIF (Slow)</Select.Item>
            <Select.Item value="zip">ZIP</Select.Item>
            <Select.Item value="html">HTML</Select.Item>
            <Select.Item value="pdf">PDF</Select.Item>
            <Select.Item value="tsx">TSX</Select.Item>
            <Select.Item value="jsx">JSX</Select.Item>
            <Select.Item value="pptx">PPTX (Beta)</Select.Item>
            {/* TODO: finish that damn API and activate! */}
            {/* <Select.Item value="mp4">Video (Beta)</Select.Item> */}
          </Select.Content>
        </Select.Root>
        <Text color="amber" size="1" ml="2">Cost: {(TokenCosts)[exportType] === 0 ? 'FREE' : `${(TokenCosts)[exportType]} tokens`}</Text>
      </Box>
      {exportType === 'gif' && isExporting && (
        <Text color='mint' size="1" ml="2">{progress === 0 ? 'Recording playback...' : `Building gif ... ${progress}% done`}</Text>
      )}
      <Button
        onClick={handleExport}
        disabled={!exportType || isExporting || !project}
        variant="solid"
        color="mint"
      >
        {isExporting ? (
          <Flex align="center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </Flex>
        ) : exportComplete ? (
          <Flex align="center">
            <svg className="h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Exported!
          </Flex>
        ) : (
          'Export!'
        )}
      </Button>
    </Flex>
  );
};