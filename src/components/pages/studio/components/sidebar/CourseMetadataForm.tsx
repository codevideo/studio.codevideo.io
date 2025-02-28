import React from 'react';
import { ICourse, ILesson } from "@fullstackcraftllc/codevideo-types";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useEffect, useState } from "react";
import { addNewCourseToProjects } from "../../../../../store/editorSlice";
import { LessonMetadataForm } from './LessonMetadataForm';
import { formatNameToSafeId } from '../../../../../utils/formatNameToSafeId';
import { openModal } from '../../../../../store/modalSlice';
import { ModalTypes } from '../../../../../types/modal';
import {
  Select,
  Box,
  Flex,
  Button,
  Heading,
  Text,
  Card,
  TextArea,
  TextField
} from '@radix-ui/themes';

export interface ICourseMetadataFormProps {
  onClickCancel: () => void;
}

export const CourseMetadataForm = (props: ICourseMetadataFormProps) => {
  const { onClickCancel } = props;
  const dispatch = useAppDispatch();
  const { projects, currentProjectIndex } = useAppSelector(state => state.editor);
  const course = projects[currentProjectIndex]?.project as ICourse;

  // State for managing the lesson addition UI
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Language options for dropdown
  const languageOptions = [
    { value: 'select-a-language', label: 'Select a language' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'other', label: 'Other' }
  ];

  // Create local state initialized with Redux values
  const [localCourse, setLocalCourse] = useState<ICourse>({
    id: '',
    name: '',
    description: '',
    primaryLanguage: '',
    lessons: []
  });

  // Update local state when Redux state changes
  useEffect(() => {
    if (course) {
      setLocalCourse({
        id: formatNameToSafeId(course.name),
        name: course.name || '',
        description: course.description || '',
        primaryLanguage: course.primaryLanguage || '',
        lessons: course.lessons || []
      });
    }
  }, [course]);

  // Listen for changes in the course's lessons array
  useEffect(() => {
    if (course && course.lessons && course.lessons.length > localCourse.lessons.length) {
      // A new lesson was added to the course
      setLocalCourse(prev => ({
        ...prev,
        lessons: course.lessons || []
      }));

      // Close the lesson form
      setIsAddingLesson(false);
    }
  }, [course?.lessons?.length]);

  const handleChange = (field: keyof ICourse, value: string) => {
    setLocalCourse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!localCourse.name) {
      dispatch(openModal({
        type: ModalTypes.ALERT,
        props: {
          message: 'Please fill in all required fields'
        }
      }))
      return;
    }

    // Persist changes to Redux
    dispatch(addNewCourseToProjects({
      id: localCourse.id,
      name: localCourse.name,
      description: localCourse.description,
      primaryLanguage: localCourse.primaryLanguage
    }));
  };

  const handleAddLesson = () => {
    setIsAddingLesson(true);
  };

  return (
    <Box style={{ minWidth: '400px', minHeight: "100vh" }} my="9" mx="auto">
    <Card >
      <Heading mb="3" size="4" >
        Course Info
      </Heading>

      <Text mb="3" as="label" htmlFor='course-name'>Name</Text>
      <TextField.Root
      mb="3"
        id="course-name"
        value={localCourse.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Mastering React Development"
        required
      />

      <Text mb="3" as="label" htmlFor="course-description">Description</Text>
      <TextArea
        mb="3"
        id="course-description"
        value={localCourse.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="A comprehensive course on modern React development techniques..."
      />

      <Flex direction="column">
        <Text as="label" htmlFor="primary-language" >
          Primary Language
        </Text>
        <Select.Root
          value={localCourse.primaryLanguage}
          onValueChange={(value) => handleChange('primaryLanguage', value)}
          size="3"
          defaultValue='select-a-language'
        >
          <Select.Trigger
            variant="surface"
          />
          <Select.Content>
            {languageOptions.map(option => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      <Box mt="6" pt="4">
        <Flex justify="between" align="center" mb="4">
          <Heading size="3">
            Course Lessons ({localCourse.lessons?.length || 0})
          </Heading>

          {!isAddingLesson && (
            <Button
              type="button"
              onClick={handleAddLesson}
              variant="solid"
              color="mint"
              size="2"
              aria-label="Add lesson"
            >
              Add Lesson
            </Button>
          )}
        </Flex>

        {/* Display existing lessons */}
        {localCourse.lessons && localCourse.lessons.length > 0 && (
          <Box >
            {localCourse.lessons.map((lesson, index) => (
              <Box key={lesson.id || index} >
                <Flex justify="between" align="center">
                  <Text weight="medium" >
                  Lesson {index + 1}: {lesson.name || `<no name>`}
                  </Text>
                </Flex>
                {lesson.description && (
                  <Text size="1" >
                    {lesson.description}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Add Lesson Form */}
        {isAddingLesson && (
          <LessonMetadataForm forCourse={true} onClickCancel={() => setIsAddingLesson(false)} />
        )}
      </Box>

      <Flex justify="end" gap="3" mt="6">
        <Button
          type="button"
          onClick={onClickCancel}
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
          Save Course
        </Button>
      </Flex>
    </Card>
    </Box>
  );
};