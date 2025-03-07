import { Button } from '@radix-ui/themes';
import * as React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { openModal } from '../../store/modalSlice';
import { ModalTypes } from '../../types/modal';
import { useAppSelector } from '../../hooks/useAppSelector';
import { isCourse } from '@fullstackcraftllc/codevideo-types';

export function LessonAdder() {
  const { currentProject } = useAppSelector((state) => state.editor);

  const dispatch = useAppDispatch();

  if (currentProject && isCourse(currentProject?.project)) {

    return (
      <Button size="1" variant="soft" onClick={() => dispatch(openModal({ type: ModalTypes.CUSTOM, props: { type: 'lesson' } }))}>
        Add Lesson...
      </Button>
    );
  }
  return <></>
}
