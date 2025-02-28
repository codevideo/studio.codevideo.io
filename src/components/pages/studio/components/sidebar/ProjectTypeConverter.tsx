import * as React from 'react';
import { ICourse, ILesson, IAction, ProjectType, convertProjectType } from '@fullstackcraftllc/codevideo-types';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { setCurrentProjectIndex, setActions, addNewCourseToProjects, addNewLessonToProjects, addNewActionsToProjects } from '../../../../../store/editorSlice';
import { useState } from 'react';
import { 
  Select, 
  Box, 
  Flex, 
  Button, 
  Dialog
} from '@radix-ui/themes';

export function ProjectTypeConverter() {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector(state => state.editor);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetType, setTargetType] = useState<ProjectType>('');

  // Determine available conversion options based on current mode
  const getConversionOptions = () => {
    const options: Array<{ value: 'course' | 'lesson' | 'actions', label: string }> = [];
    
    if (currentProject?.projectType !== 'course') {
      options.push({ value: 'course', label: 'Course' });
    }
    
    if (currentProject?.projectType !== 'lesson') {
      options.push({ value: 'lesson', label: 'Lesson' });
    }
    
    if (currentProject?.projectType !== 'actions') {
      options.push({ value: 'actions', label: 'Actions' });
    }
    
    return options;
  };

  const handleConversionSelect = (value: string) => {
    if (value === '') return;
    
    setTargetType(value as 'course' | 'lesson' | 'actions');
    setIsModalOpen(true);
  };

  const handleConfirmConversion = () => {
    if (!currentProject || !targetType) return;
    
    const convertedProject = convertProjectType(
      currentProject.project, 
      targetType
    );
    
    if (convertedProject) {
      if (targetType === 'course') {
        dispatch(addNewCourseToProjects(convertedProject as ICourse));
      } else if (targetType === 'lesson') {
        dispatch(addNewLessonToProjects(convertedProject as ILesson));
      } else if (targetType === 'actions') {
        dispatch(addNewActionsToProjects(convertedProject as IAction[]));
      }
    }
    
    // Close modal and reset target type
    setIsModalOpen(false);
    setTargetType('');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTargetType('');
  };

  const options = getConversionOptions();

  if (options.length === 0 || !currentProject) {
    return null;
  }

  return (
    <>
      <Box>
        <Select.Root 
          value={targetType} 
          onValueChange={handleConversionSelect}
        >
          <Select.Trigger 
            placeholder="Convert Project To..." 
            color="mint"
            variant="surface"
            style={{ width: '100%' }}
          />
          <Select.Content position="popper">
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Box>

      {/* Conversion Confirmation Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content size="2">
          <Dialog.Title>Convert Project</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to convert this {currentProject?.projectType} to a {targetType}? 
            This action will create a new project and leave the original unchanged.
          </Dialog.Description>
          
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" onClick={handleModalClose}>
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button color="mint" onClick={handleConfirmConversion}>
                Convert
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}