import { useRef } from "react";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { reconcileActionIds } from "../utils/reconcileActionIds";
export function useActionIds(actions: IAction[], scope: string) {
  const previous = useRef<{ actions: IAction[]; ids: string[]; scope: string }>(
    { actions: [], ids: [], scope },
  );
  if (
    previous.current.actions !== actions ||
    previous.current.scope !== scope
  ) {
    const p = previous.current;
    previous.current = {
      actions,
      scope,
      ids: reconcileActionIds(
        p.scope === scope ? p.actions : [],
        p.scope === scope ? p.ids : [],
        actions,
      ),
    };
  }
  return previous.current.ids;
}
