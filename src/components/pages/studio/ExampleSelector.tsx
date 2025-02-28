import * as React from 'react';
import { useEffect, useState } from 'react';
import { 
  Flex, 
  Box, 
  Button, 
  Text, 
  Select 
} from '@radix-ui/themes';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { addNewCourseToProjects } from '../../../store/editorSlice';
import { ICourse, isCourse } from '@fullstackcraftllc/codevideo-types';
import { allProjects } from './examples/allProjects';

export function ExampleSelector() {
    const { currentProject } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();
    const [selectedId, setSelectedId] = useState<string>('');
    const DEFAULT_VALUE = 'default';

    useEffect(() => {
        // Initialize with current project ID if available
        if (currentProject?.project && isCourse(currentProject.project)) {
            setSelectedId(currentProject.project.id);
        }
    }, [currentProject]);

    const handleExampleChange = (exampleId: string) => {
        setSelectedId(exampleId);
    };

    const loadSelectedExample = () => {
        if (selectedId === DEFAULT_VALUE || selectedId === '') return;

        const matchingProject = allProjects.find((ex: ICourse) => ex.id === selectedId);
        if (matchingProject) {
            
            // set the actions from the example's steps - for now, use the first lesson's actions
            if (!matchingProject.lessons) {
                console.error('No lessons found in example:', matchingProject);
                return;
            }
            if (!matchingProject.lessons[0]) {
                console.error('No actions found in example lesson:', matchingProject.lessons[0]);
                return;
            }
            try {
                dispatch(addNewCourseToProjects(matchingProject));
            } catch (error) {
                console.error('Failed to parse example steps:', error);
            }
        }
    };

    const selectedProject = selectedId !== DEFAULT_VALUE 
        ? allProjects?.find((ex: ICourse) => ex.id === selectedId) 
        : null;

    return (
        <Flex direction="column" gap="2">
            <Flex gap="2" align="center" justify="center" >
                <Select.Root 
                    value={selectedId || DEFAULT_VALUE}
                    onValueChange={handleExampleChange}
                    size="3"
                    
                >
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Examples</Select.Label>
                            <Select.Item value={DEFAULT_VALUE} disabled>
                                Select an example...
                            </Select.Item>
                            {allProjects.map((project: ICourse) => (
                                <Select.Item key={project.id} value={project.id}>
                                    {project.name}
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
                
                {selectedId !== DEFAULT_VALUE && selectedId !== '' && (
                    <Button 
                        onClick={loadSelectedExample}
                        size="3"
                        color="mint"
                    >
                        Go!
                    </Button>
                )}
            </Flex>
            
            {selectedProject?.description && (
                <Text size="1" color="mint" align="center" mt="1">
                    {selectedProject.description}
                </Text>
            )}
        </Flex>
    );
}