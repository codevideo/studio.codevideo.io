import { useRef } from "react";
import { IAction } from "@fullstackcraftllc/codevideo-types";
export function useActionHistory(scope: string) {
  const history = useRef<{
    scope: string;
    past: IAction[][];
    future: IAction[][];
  }>({ scope, past: [], future: [] });
  if (history.current.scope !== scope)
    history.current = { scope, past: [], future: [] };
  return {
    record: (actions: IAction[]) => {
      history.current.past.push(actions);
      history.current.past = history.current.past.slice(-100);
      history.current.future = [];
    },
    undo: (current: IAction[]) => {
      const prev = history.current.past.pop();
      if (prev) history.current.future.push(current);
      return prev;
    },
    redo: (current: IAction[]) => {
      const next = history.current.future.pop();
      if (next) history.current.past.push(current);
      return next;
    },
  };
}
