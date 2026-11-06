import { useMemo } from "react";
import {
  IAction,
  estimateActionDurationsMs,
} from "@fullstackcraftllc/codevideo-types";
import { RENDER_PAUSES } from "../../../../utils/estimateVideoDurationInSeconds";
import { buildTimelineLayout } from "../utils/timelineLayout";
export function useTimelineLayout(
  actions: IAction[],
  speechMs: Record<number, number>,
  zoom: number,
) {
  return useMemo(
    () =>
      buildTimelineLayout(
        estimateActionDurationsMs(actions, { ...RENDER_PAUSES, speechMs }),
        zoom,
      ),
    [actions, speechMs, zoom],
  );
}
