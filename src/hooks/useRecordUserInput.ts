import { AllActions, IAction, isRepeatableAction } from "@fullstackcraftllc/codevideo-types";
import { useEffect, useRef, useState } from "react";
import { useKeyDown } from "./useKeyDown";

export function useRecordUserInput(
  isRecording: boolean,
  refs: { [areaName: string]: React.RefObject<HTMLElement> }
) {
  const [detailedActions, setDetailedActions] = useState<IAction[]>();
  const recognitionRef = useRef<any | null>(null);

  // Reset function to clear the actions array
  const reset = () => {
    setDetailedActions([]);
  };

  // Common function to add actions
  const addAction = (name: string, value: string) => {
    setDetailedActions((prevActions: any) => [
      ...(prevActions || []),
      { name, value }
    ]);
  };

  // Setup key handlers
  const keyConfig = {
    'Delete': {
      handler: () => addAction('delete', '1')
    },
    'Backspace': {
      handler: () => addAction('backspace', '1')
    },
    'ArrowUp': {
      handler: () => addAction('arrow-up', '1')
    },
    'ArrowDown': {
      handler: () => addAction('arrow-down', '1')
    },
    'ArrowLeft': {
      handler: () => addAction('arrow-left', '1')
    },
    'ArrowRight': {
      handler: () => addAction('arrow-right', '1')
    },
    'Enter': {
      handler: () => addAction('enter', '1')
    },
    'Tab': {
      handler: () => addAction('tab', '1'),
      preventDefault: true
    },
    'd': {
      handler: () => addAction('cmd+d', '1'),
      combo: { key: 'd', ctrl: true },
      preventDefault: true
    },
    // 'ArrowRight': {
    //   handler: () => addAction('shift+arrow-right', '1'),
    //   combo: { key: 'ArrowRight', shift: true }
    // },
    // 'ArrowLeft': {
    //   handler: () => addAction('shift+arrow-left', '1'),
    //   combo: { key: 'ArrowLeft', shift: true }
    // }
  };

  // Use our new hook
  useKeyDown(keyConfig, { enabled: isRecording });

  // Handle speech recognition
  useEffect(() => {
    if (isRecording) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('SpeechRecognition is not supported in this browser.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        addAction('speak-before', transcript);
      };

      recognition.start();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  // Handle mouse events
  useEffect(() => {
    if (!isRecording) return;

    const getAreaFromEvent = (event: MouseEvent) => {
      let area = 'unknown';
      for (const [areaName, ref] of Object.entries(refs)) {
        if (ref.current && ref.current.contains(event.target as Node)) {
          area = areaName;
          break;
        }
      }
      return area;
    };

    const handleClick = (event: MouseEvent) => {
      addAction('click-left', getAreaFromEvent(event));
    };

    const handleContextMenu = (event: MouseEvent) => {
      addAction('click-right', getAreaFromEvent(event));
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isRecording, refs]);

  return { 
    detailedActions, 
    recordedActions: detailedActions ? collapseActions(detailedActions) : [], 
    reset 
  };
}

// Helper function to collapse actions
const collapseActions = (allActions: Array<IAction>) => {
    const collapsedActions: IAction[] = [];
    let i = 0;

    while (i < allActions.length) {
        const currentAction = allActions[i];
        if (currentAction === undefined) {
            i++;
            continue;
        }

        if (currentAction.name === 'type-editor' || currentAction.name === 'type-terminal') {
            // Accumulate typed characters
            let accumulatedValue = currentAction.value;
            i++;
            while (
                i < allActions.length &&
                (allActions[i]?.name === 'type-editor' || allActions[i]?.name === 'type-terminal')
            ) {
                if (allActions[i]?.name === 'space') {
                    accumulatedValue += ' ';
                } else {
                accumulatedValue += allActions[i]?.value;
                }
                i++;
            }
            collapsedActions.push({
                name: currentAction.name,
                value: accumulatedValue,
            });
        } else if (isRepeatableAction(currentAction.name as any)) {
            // Count consecutive repeatable actions
            let count = 1;
            i++;
            while (
                i < allActions.length &&
                allActions[i]?.name === currentAction.name
            ) {
                count++;
                i++;
            }
            collapsedActions.push({
                name: currentAction.name,
                value: count.toString(),
            });
        } else {
            // Non-repeatable action, add as is
            collapsedActions.push(currentAction);
            i++;
        }
    }

    return collapsedActions;
};