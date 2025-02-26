import React, { useState, useEffect } from 'react';
import { ICourse, ILesson, IAction, isActions, isCourse, isLesson } from '@fullstackcraftllc/codevideo-types';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { addNewCourseToProjects, addNewLessonToProjects, addNewActionsToProjects } from '../../../../../store/editorSlice';

export const JSONPaster: React.FC = () => {
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
      } else if (isActions(parsed)) {
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

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-slate-800 rounded-lg">
        <textarea
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder='{"id": "example", "name": "Example Project", ...}'
          className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 dark:text-slate-200 font-mono text-sm h-15 resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm">
            {isValidating ? (
              <div className="flex items-center text-slate-500 dark:text-slate-400">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validating...
              </div>
            ) : detectedType ? (
              <div className="flex items-center font-medium text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Detected&nbsp;<code>{detectedType}</code>
              </div>
            ) : jsonInput ? (
              <div className="flex items-center font-medium text-red-600 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Invalid Format
              </div>
            ) : null}
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleImport}
              disabled={!detectedType || isValidating}
              className={`px-4 py-2 rounded-md transition-colors ${
                detectedType && !isValidating
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              Import
            </button>
          </div>
        </div>
      </div>
      
      {/* Error Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6 mx-4">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
              Validation Error
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {validationError}
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-slate-800 dark:text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};