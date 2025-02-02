import * as React from "react";
import {
  AllActions,
  AllActionStrings,
  isAuthorAction,
  isEditorAction,
} from "@fullstackcraftllc/codevideo-types";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { setActions, setActionsString, setCodeIndex } from "../../../store/editorSlice";
import { InsertStepButton } from "./InsertStepButton";

import { useEffect, useRef } from "react";

export interface IActionEditorProps { }

export function ActionEditor(props: IActionEditorProps) {
  const { actions, codeIndex, jumpFlag } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  const snapToStep = (index: number) => {
    if (containerRef.current) {
      const activeStep = containerRef.current.querySelector(`[data-index="${codeIndex}"]`);
      if (activeStep) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const stepRect = activeStep.getBoundingClientRect();
        container.scrollTop = container.scrollTop + (stepRect.top - containerRect.top);
      }
    }
  }

  // Scroll the active step into view when codeIndex changes, or when the jumpFlag changes
  useEffect(() => {
    snapToStep(codeIndex);
  }, [codeIndex, jumpFlag]);

  const isRepeatableAction = (actionName: AllActions): boolean => {
    return ["enter", "space", "backspace", "tab"].includes(actionName as string);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setActions(
      actions.map((action, i) => {
        if (i === index) {
          return { ...action, value: event.target.value };
        }
        return action;
      })
    ));
  };

  const handleTextAreaChange = (
    index: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setActions(
      actions.map((action, i) => {
        if (i === index) {
          return { ...action, value: event.target.value };
        }
        return action;
      })
    ));
  }

  const handleSelectChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = event.target.value;
    const newActions = actions.map((action, i) => {
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
    dispatch(setActionsString(JSON.stringify(newActions, null, 2)));
    dispatch(setCodeIndex(index));
  };

  const handleOnClickToCurrent = () => {
    snapToStep(codeIndex);
  }

  const stepBackgroundColor = (index: number) => {
    return index === codeIndex ? "bg-green-200" : "bg-slate-200";
  }

  return (
    <div className="h-[500px] overflow-y-auto px-4" ref={containerRef}>
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {actions.length === 0 && (
          <InsertStepButton actions={actions} index={0} />
        )}
        {actions.map((action, index) => (
          <div 
          key={index} 
          className="relative my-1"
          data-index={index}>
            <div className={`${stepBackgroundColor(index)} rounded-lg p-3 shadow-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{index + 1}.</span>
                <div className="flex gap-1">
                  <button
                    className="px-2 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                    onClick={() => {
                      const newActions = actions
                        .slice(0, index + 1)
                        .concat([action, ...actions.slice(index + 1)]);
                      dispatch(setActions(
                        newActions
                      ))
                      dispatch(setActionsString(JSON.stringify(newActions, null, 2)));
                      dispatch(setCodeIndex(index + 1));
                    }}
                  >
                    Clone
                  </button>
                  <button
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={() => {
                      const newActions = actions.filter((_, i) => i !== index);
                      dispatch(setActions(
                        newActions
                      ))
                      dispatch(setActionsString(JSON.stringify(newActions, null, 2)));
                      dispatch(setCodeIndex(Math.min(index, newActions.length - 1)));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="block text-xs text-gray-600 font-medium">
                    Action Type
                  </label>
                  <select
                    className="w-full px-2 py-1.5 text-sm border rounded bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={action.name as string}
                    onChange={(e) => handleSelectChange(index, e)}
                  >
                    {AllActionStrings.map((actionType) => (
                      <option key={actionType} value={actionType}>
                        {actionType}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-gray-600 font-medium">
                    Value
                  </label>
                  {/* if it's a speach action, use a multiline text */}
                  {isAuthorAction(action) ? (
                    <textarea
                      className="w-full h-20 px-2 py-1.5 text-sm border rounded font-sans focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={action.value}
                      onChange={(e) => handleTextAreaChange(index, e)}
                    />
                  ) : (
                    // otherwise, use a single line text
                    <input
                      className={`w-full px-2 py-1.5 text-sm border rounded ${isEditorAction(action) ? "font-mono" : "font-sans"
                        } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                      type={isRepeatableAction(action.name) ? "number" : "text"}
                      value={action.value}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  )}
                </div>
              </div>
            </div>
            <InsertStepButton actions={actions} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActionEditor;