import { Badge, Button } from '@radix-ui/themes';
import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { isCourse } from '@fullstackcraftllc/codevideo-types';
import { openLessonModal } from '../../../store/modalSlice';

export function LessonAdder() {
  const { currentProject } = useAppSelector((state) => state.editor);

  const dispatch = useAppDispatch();

  if (currentProject && currentProject.project && isCourse(currentProject.project)) {

    return (
      <Badge size="1" variant="soft" onClick={() => dispatch(openLessonModal())} style={{cursor: 'pointer'}}>
        Add Lesson...
      </Badge>
    );
  }
  return <></>
}
