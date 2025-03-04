import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  TextArea,
  Card,
  Heading,
  Dialog,
  Code,
  IconButton
} from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { ICourse, ILesson, IAction, isValidActions, isCourse, isLesson } from '@fullstackcraftllc/codevideo-types';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { addNewCourseToProjects, addNewLessonToProjects, addNewActionsToProjects } from '../../../../../store/editorSlice';

export const JSONPaster = () => {
  const dispatch = useAppDispatch();
  const [jsonInput, setJsonInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [detectedType, setDetectedType] = useState<'course' | 'lesson' | 'actions' | null>(null);
  const [parsedData, setParsedData] = useState<ICourse | ILesson | IAction[] | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Validate JSON whenever the input changes (with debounce)
  useEffect(() => {
    if (!jsonInput.trim()) {
      setDetectedType(null);
      setParsedData(null);
      setIsValidating(false);
      return;
    }

    // Set a slight delay to avoid validating while typing
    const timer = setTimeout(() => {
      validateJson();
    }, 500);

    return () => clearTimeout(timer);
  }, [jsonInput]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    // Clear previous validation results when input changes
    setValidationError('');
    setIsValidating(true);
  };

  const validateJson = () => {
    if (!jsonInput.trim()) {
      setValidationError('');
      setDetectedType(null);
      setParsedData(null);
      setIsValidating(false);
      return;
    }

    try {
      // Try to parse the JSON
      const parsed = JSON.parse(jsonInput);

      // Check if it matches any of our types
      if (isCourse(parsed)) {
        setDetectedType('course');
        setParsedData(parsed as ICourse);
        setValidationError('');
      } else if (isLesson(parsed)) {
        setDetectedType('lesson');
        setParsedData(parsed as ILesson);
        setValidationError('');
      } else if (isValidActions(parsed)) {
        // we require at least one action to be present
        if ((parsed as IAction[]).length === 0) {
          setDetectedType(null);
          setParsedData(null);
          setValidationError('Actions array must contain at least one action.');
          setIsModalOpen(true);
          setIsValidating(false);
          return;
        }

        setDetectedType('actions');
        setParsedData(parsed as IAction[]);
        setValidationError('');
      } else {
        setDetectedType(null);
        setParsedData(null);
        setValidationError("We couldn't identify your JSON as a course, lesson, or actions array.");
        setIsModalOpen(true);
      }
    } catch (error) {
      setDetectedType(null);
      setParsedData(null);
      setValidationError(`Invalid JSON: ${(error as Error).message}`);
      setIsModalOpen(true);
    }

    setIsValidating(false);
  };

  const handleImport = () => {
    if (!detectedType || !parsedData) return;

    // Import the data based on its type
    switch (detectedType) {
      case 'course':
        dispatch(addNewCourseToProjects(parsedData as ICourse));
        break;
      case 'lesson':
        dispatch(addNewLessonToProjects(parsedData as ILesson));
        break;
      case 'actions':
        dispatch(addNewActionsToProjects(parsedData as IAction[]));
        break;
    }

    // Clear the input after successful import
    setJsonInput('');
    setDetectedType(null);
    setParsedData(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Loading spinner SVG as a component
  const SpinnerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'spin 1s linear infinite' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
      <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <Box width="full">

      <TextArea
        value={jsonInput}
        onChange={handleJsonChange}
        placeholder='{"id": "example", "name": "Example Project", ...}'
        style={{
          fontFamily: 'monospace',
          fontSize: '14px',
          height: '6em',
          resize: 'none'
        }}
      />

      <Flex justify="between" align="center" mt="4">
        <Flex align="center" gap="1">
          {isValidating ? (
            <Flex align="center" gap="1">
              <SpinnerIcon />
              <Text color="mint" size="1">Validating...</Text>
            </Flex>
          ) : detectedType ? (
            <Flex align="center" gap="1">
              <CheckCircledIcon width="16" height="16" color="mint" />
              <Text color="mint" size="1" weight="medium">
                Detected project of type <Code>{detectedType}</Code>
              </Text>
            </Flex>
          ) : jsonInput ? (
            <Flex align="center" gap="1">
              <CrossCircledIcon width="16" height="16" color="red" />
              <Text color="red" size="1" weight="medium">Invalid Format</Text>
            </Flex>
          ) : null}
        </Flex>

        <Flex gap="2">
          <Button
            onClick={handleImport}
            disabled={!detectedType || isValidating}
            color={detectedType && !isValidating ? "mint" : "gray"}
            variant={detectedType && !isValidating ? "solid" : "soft"}
          >
            Import
          </Button>
        </Flex>
      </Flex>


      {/* Error Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content>
          <Dialog.Title>
            <Heading size="3" color="red" mb="1">Validation Error</Heading>
          </Dialog.Title>
          <Text color="mint" mb="4">{validationError}</Text>
          <Flex justify="end">
            <Dialog.Close>
              <Button onClick={closeModal} color="mint" variant="soft">
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};