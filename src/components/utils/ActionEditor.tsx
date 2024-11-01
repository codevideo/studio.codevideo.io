import * as React from "react";
import {
    AllActions,
  IAction,
  allActionStrings,
  isCodeAction,
} from "@fullstackcraftllc/codevideo-types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setActions } from "../../store/editorSlice";
import { useAppSelector } from "../../hooks/useAppSelector";

export interface IActionEditorProps {
}

export function ActionEditor(props: IActionEditorProps) {
  const { actions } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

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

  const handleSelectChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = event.target.value;
    setActions(
      actions.map((action, i) => {
        if (i === index) {
          return {
            ...action,
            name: newValue as AllActions,
            value: isRepeatableAction(newValue as AllActions) ? "1" : "",
          };
        }
        return action;
      })
    );
  };

  return (
    <div className="h-[500px] overflow-y-auto">
      <div className="w-[900px] flex flex-col gap-4">
        {actions.map((action, index) => (
          <div key={index}>
            <div className="bg-emerald-50 rounded-lg p-4 shadow-sm">
              <div className="flex flex-row items-center gap-4">
                <span className="text-emerald-600 mr-2">#{index + 1}</span>
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-row items-center gap-4">
                    <span>Name:</span>
                    <select
                      className="px-3 py-2 border rounded-md bg-white"
                      value={action.name as string}
                      onChange={(e) => handleSelectChange(index, e)}
                    >
                      {allActionStrings.map((actionType) => (
                        <option key={actionType} value={actionType}>
                          {actionType}
                        </option>
                      ))}
                    </select>
                    <button
                      className="ml-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() =>
                        setActions(actions.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <span>Value:</span>
                    <input
                      className={`w-[700px] px-3 py-2 border rounded-md ${
                        isCodeAction(action) ? "font-mono" : "font-sans"
                      }`}
                      type={isRepeatableAction(action.name) ? "number" : "text"}
                      value={action.value}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                    <button
                      className="ml-auto px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                      onClick={() =>
                        setActions(
                          actions
                            .slice(0, index + 1)
                            .concat([action, ...actions.slice(index + 1)])
                        )
                      }
                    >
                      Duplicate
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center my-2">
              <button
                className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600"
                onClick={() =>
                  setActions(
                    actions
                      .slice(0, index + 1)
                      .concat([
                        { name: "speak-before" as AllActions, value: "My new action" } as IAction,
                        ...actions.slice(index + 1),
                      ])
                  )
                }
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActionEditor;