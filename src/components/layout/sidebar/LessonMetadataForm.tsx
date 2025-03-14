import React from 'react';
import { ILesson } from '@fullstackcraftllc/codevideo-types';
import { useEffect, useState } from "react";
import {
  Text,
  Flex,
  Button,
  Heading,
  Card,
  TextField,
  TextArea,
} from '@radix-ui/themes';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { addLessonToCourse, addNewLessonToCourse, addNewLessonToProjects, setLocationInStudio } from '../../../store/editorSlice';
import { openModal, closeModal } from '../../../store/modalSlice';
import { formatNameToSafeId } from '../../../utils/formatNameToSafeId';

interface ILessonMetadataFormProps {
  forCourse: boolean;
  forNewLesson: boolean;
  forEdit: boolean;
  onCancel?: () => void;
  onAddLesson?: (lesson: ILesson) => void;
}

export const LessonMetadataForm = (props: ILessonMetadataFormProps) => {
  const { forCourse, forNewLesson, forEdit, onCancel, onAddLesson } = props;
  const { projects, currentProjectIndex, currentLessonIndex } = useAppSelector(state => state.editor);
  const dispatch = useAppDispatch();
  const lesson = projects[currentProjectIndex]?.project as ILesson;

  // Create local lesson of just empty values
  const [localLesson, setLocalLesson] = useState<ILesson>({
    id: '',
    name: '',
    description: '',
    actions: []
  });

  // Update local state when Redux state changes in edit mode
  useEffect(() => {
    if (forEdit && lesson) {
      setLocalLesson({
        id: `${currentLessonIndex + 1}-${formatNameToSafeId(lesson.name)}`,
        name: lesson.name || '',
        description: lesson.description || '',
        actions: lesson.actions || []
      });
    }
  }, [forEdit, lesson]);

  const handleChange = (field: keyof ILesson, value: string) => {
    setLocalLesson(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!localLesson.name) {
      dispatch(openModal({
        modalType: 'alert-fields',
        title: 'Error',
      }))
      return;
    }

    if (forCourse) {
      // call callback up to course metadataform
      onAddLesson && onAddLesson(localLesson);

      // reset local lesson
      setLocalLesson({
        id: '',
        name: '',
        description: '',
        actions: []
      });

      return;
    }

    if (forNewLesson) {
      dispatch(addNewLessonToCourse(localLesson));
      // close modal
      dispatch(closeModal());
      return;
    }

    // Persist changes to Redux
    dispatch(addNewLessonToProjects({
      id: localLesson.id,
      name: localLesson.name,
      description: localLesson.description,
      actions: localLesson.actions
    }));

    // close modal
    dispatch(closeModal());

    // navigate to studio
    dispatch(setLocationInStudio('studio'));
  };

  const resolveConfirmText = () => {
    if (forCourse) {
      return 'Add Lesson to Course';
    }
    if (forNewLesson) {
      return 'Add Lesson';
    }
    return 'Save and Go to Studio';
  };

  return (
    <Flex justify="center">
      <Card mt={forCourse ? '0' : '9'} size="3" style={{ maxWidth: '28rem', width: '100%' }}>
        <Heading mb="3" size="4">
          Lesson Info
        </Heading>

        <Text mb="3" as="label" htmlFor='lesson-name'>Name</Text>
        <TextField.Root
          mb="3"
          id="lesson-name"
          value={localLesson.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Introduction to React Hooks"
          required
        />

        <Text mb="3" as="label" htmlFor="lesson-description">Description</Text>
        <TextArea
          mb="3"
          id="lesson-description"
          value={localLesson.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="A comprehensive overview of React Hooks and their usage..."
        />

        <Flex justify="end" gap="3" mt="6">
          <Button
            type="button"
            onClick={() => {
              // if a cancel callback is provided, call it and don't navigate
              if (onCancel) {
                onCancel();
                return;
              }

              // close modal
              dispatch(closeModal());
              if (forNewLesson) {
                return
              }
              forEdit ? dispatch(setLocationInStudio('studio')) : dispatch(setLocationInStudio('select'))
            }}
            variant="solid"
            color="red"
            size="2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            variant="solid"
            color="mint"
            size="2"
          >
            {resolveConfirmText()}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};