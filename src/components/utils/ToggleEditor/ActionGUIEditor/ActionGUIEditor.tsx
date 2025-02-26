import * as React from "react";
import {
  AllActions,
  AllActionStrings,
  isAuthorAction,
  isEditorAction,
} from "@fullstackcraftllc/codevideo-types";
import { InsertStepButton } from "./InsertStepButton";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { setActions, setCurrentActionIndex, setDraftActionsString } from "../../../../store/editorSlice";
import { ActionValidationStats } from "../ActionValidationStats";

export function ActionGUIEditor() {
  const { currentActions, currentActionIndex, jumpFlag, actionsString } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  const snapToStep = (index: number) => {
    if (containerRef.current) {
      const activeStep = containerRef.current.querySelector(`[data-index="${currentActionIndex}"]`);
      if (activeStep) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const stepRect = activeStep.getBoundingClientRect();
        container.scrollTop = container.scrollTop + (stepRect.top - containerRect.top);
      }
    }
  }

  // Scroll the active step into view when currentActionIndex changes, or when the jumpFlag changes
  useEffect(() => {
    snapToStep(currentActionIndex);
  }, [currentActionIndex, jumpFlag]);

  const isRepeatableAction = (actionName: AllActions): boolean => {
    return ["enter", "space", "backspace", "tab"].includes(actionName as string);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newActions = currentActions.map((action, i) => {
      if (i === index) {
        return { ...action, value: event.target.value };
      }
      return action;
    })
    dispatch(setActions(
      newActions
    ));
    // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
    dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
  };

  const handleTextAreaChange = (
    index: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newActions = currentActions.map((action, i) => {
      if (i === index) {
        return { ...action, value: event.target.value };
      }
      return action;
    })
    dispatch(setActions(
      newActions
    ));
    // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
    dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
  }

  const handleSelectChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = event.target.value;
    const newActions = currentActions.map((action, i) => {
      if (i === index) {
        return {
          ...action,
          name: newValue as AllActions,
          value: isRepeatableAction(newValue as AllActions) ? "1" : "",
        };
      }
      return action;
    })
    dispatch(setActions(
      newActions
    ));
    dispatch(setCurrentActionIndex(index));
    // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
    dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
  };

  const stepBackgroundColor = (index: number) => {
    return index === currentActionIndex ? "bg-green-200" : "bg-slate-200";
  }

  return (
    <div className="h-[500px] overflow-y-auto px-4" ref={containerRef}>
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {currentActions.length === 0 && (
          <InsertStepButton actions={currentActions} index={0} />
        )}
        {currentActions.map((action, index) => (
          <div
            key={index}
            className="relative my-1"
            data-index={index}>
            <div className={`${stepBackgroundColor(index)} rounded-lg p-3 shadow-sm`}>
              <div className="absolute -top-2 -left-2 cursor-pointer" onClick={() => dispatch(setCurrentActionIndex(index))} title={`Jump to step ${index + 1}`}>
                <span className="flex items-center justify-center w-5 h-5 bg-white text-xs font-medium rounded-full border shadow-sm">
                  {index + 1}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600 font-medium">
                    Name
                  </label>
                  <select
                    className="flex-1 px-2 py-1.5 text-sm border rounded bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={action.name as string}
                    onChange={(e) => handleSelectChange(index, e)}
                  >
                    {AllActionStrings.map((actionType) => (
                      <option key={actionType} value={actionType}>
                        {actionType}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      onClick={() => {
                        const newActions = currentActions
                          .slice(0, index + 1)
                          .concat([action, ...currentActions.slice(index + 1)]);
                        dispatch(setActions(
                          newActions
                        ))
                        dispatch(setCurrentActionIndex(index + 1));
                        // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
                        dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
                      }}
                    >
                      Clone
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      onClick={() => {
                        const newActions = currentActions.filter((_, i) => i !== index);
                        dispatch(setActions(
                          newActions
                        ))
                        dispatch(setCurrentActionIndex(Math.min(index, newActions.length - 1)));
                        // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
                        dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <label className="text-xs text-gray-600 font-medium pt-1.5">
                    Value
                  </label>
                  {isAuthorAction(action) ? (
                    <textarea
                      className="flex-1 px-2 py-1.5 text-sm border rounded font-sans focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                      value={action.value}
                      onChange={(e) => handleTextAreaChange(index, e)}
                      rows={1}
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                    />
                  ) : (
                    <input
                      className={`flex-1 px-2 py-1.5 text-sm border rounded ${isEditorAction(action) ? "font-mono" : "font-sans"
                        } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      type={isRepeatableAction(action.name) ? "number" : "text"}
                      value={action.value}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  )}
                </div>

              </div>
            </div>
            <InsertStepButton actions={currentActions} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActionGUIEditor;