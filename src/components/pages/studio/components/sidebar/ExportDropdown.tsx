import React, { useState } from 'react';
import { ExportType, Project } from '@fullstackcraftllc/codevideo-types';
import { exportProject } from '@fullstackcraftllc/codevideo-doc-gen';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { 
  Flex, 
  Box, 
  Button, 
  Select,
  Text
} from '@radix-ui/themes';

export const ExportDropdown = () => {
  const { projects, currentProjectIndex } = useAppSelector(state => state.editor);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<ExportType | ''>('');
  const [exportComplete, setExportComplete] = useState(false);
  const project = projects[currentProjectIndex]?.project;
  
  const handleExportChange = (value: string) => {
    setExportType(value as ExportType | '');
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
    
    setIsExporting(true);
    setExportComplete(false);
    
    try {
      console.log('exporting project:', project, 'as', exportType);
      await exportProject(project, exportType);
      setExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Flex align="center" justify="between" gap="2">
      <Box>
        <Text size="1" mr="2">Export project to...</Text>
        <Select.Root
          value={exportType}
          onValueChange={handleExportChange}
          disabled={isExporting}
        >
          <Select.Trigger 
            variant="surface" 
            placeholder="Select..."
          />
          <Select.Content>
            <Select.Item value="markdown">Markdown</Select.Item>
            <Select.Item value="html">HTML</Select.Item>
            <Select.Item value="pdf">PDF</Select.Item>
            <Select.Item value="zip">ZIP</Select.Item>
            <Select.Item value="json">JSON</Select.Item>
            <Select.Item value="pptx">PPTX (Beta)</Select.Item>
          </Select.Content>
        </Select.Root>
      </Box>
      
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