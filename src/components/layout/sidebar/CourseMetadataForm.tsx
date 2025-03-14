import React from 'react';
import { ICourse, ILesson } from "@fullstackcraftllc/codevideo-types";
import { useEffect, useState } from "react";
import { LessonMetadataForm } from './LessonMetadataForm';
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
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { addNewCourseToProjects, setLocationInStudio } from '../../../store/editorSlice';
import { openModal } from '../../../store/modalSlice';
import { formatNameToSafeId } from '../../../utils/formatNameToSafeId';

export interface ICourseMetadataForm {
  forEdit: boolean;
}

export const CourseMetadataForm = (props: ICourseMetadataForm) => {
  const { forEdit } = props;
  const dispatch = useAppDispatch();
  const { projects, currentProjectIndex } = useAppSelector(state => state.editor);
  const course = projects[currentProjectIndex]?.project as ICourse;

  // State for managing the lesson addition UI
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Create local state initialized with Redux values
  const [localCourse, setLocalCourse] = useState<ICourse>({
    id: '',
    name: '',
    description: '',
    primaryLanguage: '',
    lessons: []
  });

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

  // Update local state when Redux state changes if in edit mode
  useEffect(() => {
    if (forEdit && course) {
      setLocalCourse({
        id: formatNameToSafeId(course.name),
        name: course.name || '',
        description: course.description || '',
        primaryLanguage: course.primaryLanguage || '',
        lessons: course.lessons || []
      });
    }
  }, [forEdit, course]);

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
        modalType: 'alert-fields',
        title: 'Error',
      }))
      return;
    }

    // Persist changes to Redux
    dispatch(addNewCourseToProjects({
      id: localCourse.id,
      name: localCourse.name,
      description: localCourse.description,
      primaryLanguage: localCourse.primaryLanguage,
      lessons: localCourse.lessons
    }));

    // guide them to studio
    dispatch(setLocationInStudio('studio'));
  };

  const handleAddLesson = () => {
    setIsAddingLesson(true);
  };

  const addLesson = (lesson: ILesson) => {
    const localCourseCopy = { 
      ...localCourse,
      lessons: [...localCourse.lessons, lesson] // Create a new array with the new lesson
    };
    setLocalCourse(localCourseCopy);
  }

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
              Course Lessons ({localCourse.lessons.length || 0})
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
                <Card key={lesson.id || index} m="2">
                  <Flex justify="between" align="center">
                    <Text weight="medium" >
                      {lesson.name || `<no name>`}
                    </Text>
                  </Flex>
                  {lesson.description && (
                    <Text size="1" >
                      {lesson.description}
                    </Text>
                  )}
                </Card>
              ))}
            </Box>
          )}

          {/* Add Lesson Form */}
          {isAddingLesson && (
            <LessonMetadataForm forCourse={true} forNewLesson={true} forEdit={false} onCancel={() => setIsAddingLesson(false)} onAddLesson={addLesson} />
          )}
        </Box>

        <Flex justify="end" gap="3" mt="6">
          <Button
            type="button"
            onClick={() => forEdit ? dispatch(setLocationInStudio('studio')) : dispatch(setLocationInStudio('select'))}
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
            Save Course and Go to Studio
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};