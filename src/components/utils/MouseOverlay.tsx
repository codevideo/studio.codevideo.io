import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EditorState, setMousePosition } from '../../store/editorSlice';

interface MouseOverlayProps {
  className?: string;
}

export const MouseOverlay: React.FC<MouseOverlayProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { mousePosition, mouseVisible, actions, codeIndex } = useSelector((state: { editor: EditorState }) => state.editor);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentAction = actions[codeIndex];
    if (!currentAction) return;

    let newPosition = { x: mousePosition.x, y: mousePosition.y };

    switch (currentAction.name) {
      case 'click-terminal':
        newPosition = { x: window.innerWidth / 2, y: window.innerHeight - 75 };
        break;
      case 'click-file':
        // Assuming the file tree is on the left side
        newPosition = { x: 125, y: 200 };
        break;
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
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 3L19 17L12 17L5 3Z"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
