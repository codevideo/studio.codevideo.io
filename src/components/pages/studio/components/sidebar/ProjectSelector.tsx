import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { setCurrentProjectIndex } from '../../../../../store/editorSlice';
import { 
  Flex, 
  Card, 
  Text, 
  ScrollArea,
} from '@radix-ui/themes';
import { ProjectRenderer } from './ProjectRenderer';

export function ProjectSelector() {
  const { projects, currentProjectIndex } = useAppSelector(state => state.editor);
  const dispatch = useAppDispatch();

  const handleProjectChange = (index: number) => {
    dispatch(setCurrentProjectIndex(index));
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

  // sort by modified date
  const projectsSorted = [...projects];
  projectsSorted.sort((a, b) => new Date(a.modified).getTime() - new Date(b.modified).getTime());

  return (
    <ScrollArea style={{ maxHeight: '400px' }}>
      <Flex direction="column" gap="2">
        {projects.map((userProject, index) => {
          return (
            <ProjectRenderer 
              key={index}
              index={index}
              handleProjectChange={handleProjectChange}
              userProject={userProject} 
              isCurrentProject={currentProjectIndex === index} />
          );
        })}
      </Flex>
    </ScrollArea>
  );
}