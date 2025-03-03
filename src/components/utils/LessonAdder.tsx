import { Button } from '@radix-ui/themes';
import * as React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { openModal } from '../../store/modalSlice';
import { ModalTypes } from '../../types/modal';

export interface ILessonAdderProps {
}

export function LessonAdder (props: ILessonAdderProps) {
    const dispatch = useAppDispatch();
  return (
    <Button size="1" variant="soft" onClick={() => dispatch(openModal({type: ModalTypes.CUSTOM, props: {type: 'lesson'}}))}>
        Add Lesson...
    </Button>
  );
}
