import { IAction, IFileStructure, IPoint } from '@fullstackcraftllc/codevideo-types';
import { Box } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';

interface IMouseOverlayProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const MouseOverlay = (props: IMouseOverlayProps) => {
  const { currentActions, currentActionIndex, mouseVisible } = useAppSelector(state => state.editor);
  const { containerRef } = props;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  

  useEffect(() => {
    if (!currentActionIndex) return;
    const currentAction = currentActions[currentActionIndex];
    if (!currentAction) return;

    let newPosition = { x: mousePosition.x, y: mousePosition.y };

    switch (currentAction.name) {
      case 'mouse-click-terminal':
        newPosition = getCoordinatesOfTerminalInput(containerRef)
        break;
      case 'mouse-click-editor':
        case 'editor-type':
        newPosition = getCoordinatesOfEditor(containerRef)
        break;
      case 'file-explorer-create-folder':
      case 'file-explorer-create-file':
      case 'file-explorer-open-file':
      case 'mouse-click-filename':
        newPosition = getCoordinatesOfFileOrFolder(currentAction.value, containerRef)
        break;
      case 'mouse-move':
        newPosition = parseCoordinatesFromAction(currentAction.value, containerRef)
        break;
    }

    console.log('setting mouse to ' + newPosition.x + ', ' + newPosition.y);
    setMousePosition(newPosition);
  }, [currentActionIndex, currentActions]);

  // on mount, set the mouse to the center of the editor
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
    <Box
    id="mouse-overlay"
      ref={overlayRef}
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(0.8)`,
        transition: 'transform 0.3s ease-out',
        zIndex: 100000000,
        position: 'absolute',
        pointerEvents: 'none',
        userSelect: 'none',
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
    </Box>
  );
};

const getCoordinatesOfTerminalInput = (containerRef: React.RefObject<HTMLDivElement>): IPoint => {
  const terminal = document.querySelector('[data-codevideo-id="terminal"]');
  if (!terminal) return { x: 0, y: 0 };
  console.log('terminal', terminal);
  const rect = terminal.getBoundingClientRect();
  return convertToContainerCoordinates({
    x: rect.left + 20, // Add padding for prompt
    y: rect.top + 20   // Position near top of terminal
  }, containerRef);
};

const getCoordinatesOfEditor = (containerRef: React.RefObject<HTMLDivElement>): IPoint => {
  const editor = document.querySelector('[data-codevideo-id="editor"]');
  if (!editor) return { x: 0, y: 0 };
  console.log('editor', editor);
  const rect = editor.getBoundingClientRect();
  return convertToContainerCoordinates({
    x: rect.left + 50,  // Position inside editor
    y: rect.top + 50    // Position inside editor
  }, containerRef);
};

const getCoordinatesOfFileOrFolder = (fileOrFolderPath: string, containerRef: React.RefObject<HTMLDivElement>): IPoint => {
  console.log('fileOrFolderPath', fileOrFolderPath);
  const fileElement = document.querySelector(`[data-codevideo-id="file-explorer-${fileOrFolderPath}"]`);
  if (!fileElement) return { x: 0, y: 0 };
  console.log('fileElement', fileElement);
  const rect = fileElement.getBoundingClientRect();
  return convertToContainerCoordinates({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }, containerRef);
};

const parseCoordinatesFromAction = (value: string, containerRef: React.RefObject<HTMLDivElement>): IPoint => {
  // try to get two parts
  const parts = value.split(',')
  if (parts.length == 2) {
    return convertToContainerCoordinates({
      x: parts[0] ? parseInt(parts[0]) : 0,
      y: parts[1] ? parseInt(parts[1]) : 0
    }, containerRef);
  }
  return {
    x: 0,
    y: 0,
  }
}

const convertToContainerCoordinates = (point: IPoint, containerRef: React.RefObject<HTMLDivElement>): IPoint => {
  if (!containerRef?.current) return point;
  
  const containerRect = containerRef.current.getBoundingClientRect();
  
  return {
    x: point.x - containerRect.left,
    y: point.y - containerRect.top
  };
};