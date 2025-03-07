import * as React from 'react';
import { 
  Flex, 
  Card, 
  Text, 
  ScrollArea,
} from '@radix-ui/themes';
import { ProjectRenderer } from './ProjectRenderer';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setCurrentProjectIndex, setIsSidebarOpen } from '../../../store/editorSlice';

export function ProjectSelector() {
  const { projects, currentProjectIndex } = useAppSelector(state => state.editor);
  const dispatch = useAppDispatch();

  const handleProjectChange = (index: number) => {
    console.log('handleProjectChange', index);
    dispatch(setCurrentProjectIndex(index));
    dispatch(setIsSidebarOpen(false));
  };

  if (projects.length === 0) {
    return (
      <Card size="1" variant="surface">
        <Flex align="center" justify="center" p="3">
          <Text size="2" color="gray">No projects available</Text>
        </Flex>
      </Card>
    );
  }

  // Create a sorted copy of the projects array instead of sorting in place
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );

  return (
    <ScrollArea style={{ maxHeight: '400px' }}>
      <Flex direction="column" gap="2">
        {sortedProjects
        .map((userProject, index) => {
          // Find the original index in the projects array
          const originalIndex = projects.findIndex(p => p === userProject);
          return (
            <ProjectRenderer 
              key={originalIndex}
              userProject={userProject} 
              onClickProject={() => handleProjectChange(originalIndex)}
              isCurrentProject={currentProjectIndex === originalIndex} />
          );
        })}
      </Flex>
    </ScrollArea>
  );
}