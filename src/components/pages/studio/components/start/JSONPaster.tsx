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
import { CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { ICourse, ILesson, IAction, isValidActions, isCourse, isLesson, filterAuthorActions, filterEditorActions, filterExternalActions, filterFileExplorerActions, filterMouseActions, filterTerminalActions, Project, extractActionsFromProject, filterSlideActions } from '@fullstackcraftllc/codevideo-types';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { addNewCourseToProjects, addNewLessonToProjects, addNewActionsToProjects, setLocationInStudio } from '../../../../../store/editorSlice';

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

    // navigate to studio
    dispatch(setLocationInStudio('studio'));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // filter actions by type
  const actions = extractActionsFromProject(parsedData as Project, null) || [];
  const authorActionsCount = filterAuthorActions(actions).length;
  const fileExplorerActionsCount = filterFileExplorerActions(actions).length;
  const editorActionsCount = filterEditorActions(actions).length;
  const terminalActionsCount = filterTerminalActions(actions).length;
  const slideActionsCount = filterSlideActions(actions).length;
  const mouseActionsCount = filterMouseActions(actions).length;
  const externalActionsCount = filterExternalActions(actions).length;

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
        {isValidating ? (
          <Flex align="center" >
            <IconButton color="mint" size="1" mr="2" loading={true}>
              <CheckCircledIcon width="15" height="15" />
            </IconButton>
            <Text color="mint" size="2">Validating JSON...</Text>
          </Flex>
        ) : validationError ? (
          <Flex align="center" >
            <IconButton color='red' size="1" mr="2">
              <ExclamationTriangleIcon width="15" height="15" />
            </IconButton>
            <Text color="red" size="2">{validationError}</Text>
          </Flex>
        ) : validationError === '' ? (
          <Flex align="center" justify="center" >
            <IconButton color="mint" size="1" mr="2">
              <CheckCircledIcon width="15" height="15" />
            </IconButton>
            <Flex direction="column">
              <Text color="mint" size="2">
                Project type: <Text weight="bold">{detectedType}</Text>; JSON is valid; parsed <Text weight="bold">{actions.length}</Text> actions{" "}
              </Text>
              <Text color="mint" size="1" as="span">
                ({authorActionsCount} author, {fileExplorerActionsCount} file explorer, {editorActionsCount} editor, {terminalActionsCount} terminal, {slideActionsCount} slide, {mouseActionsCount} mouse, {externalActionsCount} external)
              </Text>
            </Flex>
          </Flex>
        ) : null}


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
              <Button onClick={closeModal} color="mint" variant="soft" size="1">
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};