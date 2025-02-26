import { IAction, IFileStructure, IPoint } from '@fullstackcraftllc/codevideo-types';
import React, { useEffect, useRef, useState } from 'react';

interface IMouseOverlayProps {
  mouseVisible: boolean;
  actions: Array<IAction>;
  actionIndex?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const MouseOverlay = (props: IMouseOverlayProps) => {
  const { mouseVisible, actions, actionIndex, containerRef } = props;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionIndex) return;
    const currentAction = actions[actionIndex];
    if (!currentAction) return;

    let newPosition = { x: mousePosition.x, y: mousePosition.y };

    switch (currentAction.name) {
      case 'mouse-click-terminal':
        newPosition = getCoordinatesOfTerminalInput()
        break;
      case 'mouse-click-editor':
        newPosition = getCoordinatesOfEditor()
        break;
      case 'file-explorer-open-file':
      case 'mouse-click-filename':
        newPosition = getCoordinatesOfFile(currentAction.value)
        break;
      case 'mouse-move':
        newPosition = parseCoordinatesFromAction(currentAction.value)
        break;
    }

    setMousePosition(newPosition);
  }, [actionIndex, actions]);

  // on mount, set the mouse to the center of the screen
  useEffect(() => {
    if (!containerRef?.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    console.log('setting mouse to ' + rect.width / 2 + ', ' + rect.height / 2);
    setMousePosition({
      x: rect.width / 2,
      y: rect.height / 2,
    });
  }, []);

  if (!mouseVisible) {
    return <></>
  }

  return (
    <div
      ref={overlayRef}
      className="fixed pointer-events-none z-50"
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(0.8)`,
        transition: 'transform 0.3s ease-out'
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 0,0 L 0,20 L 4.5,15.5 L 8.75,23 L 11,22 L 6.75,15 L 13.75,15 Z"
          fill="black"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const getCoordinatesOfTerminalInput = (): IPoint => {
  const terminal = document.querySelector('[data-codevideo-id="terminal"]');
  if (!terminal) return { x: 0, y: 0 };
  const rect = terminal.getBoundingClientRect();
  return {
      x: rect.left + 20, // Add padding for prompt
      y: rect.top + 20   // Position near top of terminal
  };
};

const getCoordinatesOfEditor = (): IPoint => {
  const editor = document.querySelector('[data-codevideo-id="replaying-editor"]');
  if (!editor) return { x: 0, y: 0 };
  const rect = editor.getBoundingClientRect();
  return {
      x: rect.left + 50,  // Position inside editor
      y: rect.top + 50    // Position inside editor
  };
};

const getCoordinatesOfFile = (filename: string): IPoint => {
  const fileElement = document.querySelector(`[data-codevideo-id="file-explorer-${filename}"]`);
  if (!fileElement) return { x: 0, y: 0 };
  const rect = fileElement.getBoundingClientRect();
  return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
  };
};

const parseCoordinatesFromAction = (value: string): IPoint => {
  // try to get two parts
  const parts = value.split(',')
  if (parts.length == 2 ) {
    return {
      x: parts[0] ? parseInt(parts[0]) : 0,
      y: parts[1] ? parseInt(parts[1]) : 0
    }
  }
  return {
    x: 0,
    y: 0,
  }
}