import { AllActions, IAction } from "@fullstackcraftllc/codevideo-types";
import { useStore } from "react-redux";
import { RootState } from "../../../../store";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import {
  setActions,
  setDraftActionsString,
  setCurrentActionIndex,
} from "../../../../store/editorSlice";
import {
  deleteAction,
  insertActionAfter,
  moveAction,
  renameAction,
  setActionValue,
  setAdvancedActionValue,
  getSuggestedValueForActionName,
  IActionsEdit,
} from "../../../../utils/actionEdits";
import { useActionHistory } from "./useActionHistory";
import { Playback } from "./usePlayback";
export function useEditActions(
  scope: string,
  playback: Playback,
  selectIndex: (index: number, actions: IAction[]) => void,
) {
  const store = useStore<RootState>();
  const dispatch = useAppDispatch();
  const history = useActionHistory(scope);
  const current = () => store.getState().editor.currentActions;
  const apply = (next: IAction[], index: number, record = true) => {
    playback.pause();
    if (record) history.record(current());
    dispatch(setActions(next));
    dispatch(setDraftActionsString(JSON.stringify(next, null, 2)));
    dispatch(
      setCurrentActionIndex(Math.max(-1, Math.min(index, next.length - 1))),
    );
    selectIndex(index, next);
  };
  const edit = (result: IActionsEdit) =>
    apply(result.actions, result.currentActionIndex);
  return {
    insert: (after: number, name: AllActions) =>
      edit(
        insertActionAfter(current(), after, {
          name,
          value: getSuggestedValueForActionName(name),
        }),
      ),
    duplicate: (i: number) => {
      if (current()[i])
        edit(insertActionAfter(current(), i, { ...current()[i]! }));
    },
    remove: (i: number) => {
      if (current()[i]) edit(deleteAction(current(), i));
    },
    move: (from: number, to: number) => {
      if (from !== to) edit(moveAction(current(), from, to));
    },
    value: (i: number, value: string, expected?: IAction) => {
      const actions = current();
      if (expected && actions[i] !== expected) return;
      apply(setActionValue(actions, i, value), i);
    },
    pair: (i: number, from: string, to: string) =>
      apply(setAdvancedActionValue(current(), i, from, to), i),
    rename: (i: number, name: AllActions) =>
      apply(renameAction(current(), i, name), i),
    undo: () => {
      const prev = history.undo(current());
      if (prev) apply(prev, Math.min(playback.index, prev.length - 1), false);
    },
    redo: () => {
      const next = history.redo(current());
      if (next) apply(next, Math.min(playback.index, next.length - 1), false);
    },
  };
}
export type EditActions = ReturnType<typeof useEditActions>;
