import * as React from 'react';
import {
  Flex,
  Heading,
  Button,
  Text,
  Card
} from '@radix-ui/themes';
import { ExampleSelector } from '../../ExampleSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import {
  addNewActionsToProjects,
  addNewCourseToProjects,
  addNewLessonToProjects,
  setLocationInStudio,
} from '../../../../../store/editorSlice';
import { JSONPaster } from './JSONPaster';

export function CreateNewOverlay() {
  const dispatch = useAppDispatch();

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
      <Card size="3" style={{ maxWidth: '28rem', width: '100%' }}>
        <Heading size="4" align="center" mb="4" weight="medium">
          What do you want to create?
        </Heading>

        <Flex direction="column" gap="3" mb="6">
          <Button
          size="3"
            onClick={() => {
              dispatch(addNewCourseToProjects({
                id: '',
                name: '',
                description: '',
                primaryLanguage: '',
                lessons: []
              }))
              dispatch(setLocationInStudio('course'));
            }}
          >
            <Text>Create a New Course</Text>
          </Button>

          <Button
          size="3"
            onClick={() => {
              dispatch(addNewLessonToProjects({
                id: '',
                name: '',
                description: '',
                actions: []
              }))
              dispatch(setLocationInStudio('lesson'));
            }}
          >
            <Text>Create a New Lesson</Text>
          </Button>

          <Button
            size="3"
            onClick={() => {
              dispatch(addNewActionsToProjects([]))
              dispatch(setLocationInStudio('studio'));
            }}
          >
            <Flex direction="column" align="center" justify="center">
              <Text>Create Actions Only</Text>
              <Text size="1">
                (simplest)
              </Text>
            </Flex>
          </Button>

          <Text size="1" align="center">
            Or, start from an example course:
          </Text>
          <ExampleSelector />

          <Text size="1" align="center">
            Advanced: paste in any course, lesson, or actions JSON to start from an existing project:
          </Text>
          <JSONPaster />
        </Flex>

        <Flex justify="center">
          <Text size="1" align="center">
            If you don't know which to select, don't worry - all these formats are interchangeable at any time in the studio.
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
}