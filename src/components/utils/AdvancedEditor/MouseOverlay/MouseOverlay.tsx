import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EditorState, setMousePosition } from '../../../../store/editorSlice';

interface MouseOverlayProps {
  className?: string;
}

export const MouseOverlay: React.FC<MouseOverlayProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { mousePosition, mouseVisible, actions, codeIndex, currentProject } = useSelector((state: { editor: EditorState }) => state.editor);
  const fileStructure = currentProject?.fileStructure;
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentAction = actions[codeIndex];
    if (!currentAction) return;

    let newPosition = { x: mousePosition.x, y: mousePosition.y };

    // TODO: think maybe from a different way - we should be able to retrieve the x and y coordinates directly from state from the editor!
    switch (currentAction.name) {
      case 'click-terminal':
        case 'type-terminal':
        newPosition = { x: window.innerWidth / 2, y: window.innerHeight - 75 };
        break;
      case 'click-editor':
      case 'type-editor':
        // Get middle of editor div
        newPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        break;
      // case 'click-file':
      // use the file structure to get the middle x and y position of the file

      // Add more cases as needed
    }

    dispatch(setMousePosition(newPosition));
  }, [codeIndex, actions]);

  if (!mouseVisible) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed pointer-events-none z-50 ${className}`}
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        transition: 'transform 0.3s ease-out'
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 0,0 L 0,20 L 4.5,15.5 L 8.75,23 L 11,22 L 6.75,15 L 13.75,15 Z"
          fill="black"
          stroke="white"
          stroke-width="1.5"
          stroke-linejoin="rounded"
        />
      </svg>
    </div>
  );
};
