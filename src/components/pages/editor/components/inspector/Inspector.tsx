import {
  AllActionDescriptions,
  IAction,
} from "@fullstackcraftllc/codevideo-types";
import { Button } from "@radix-ui/themes";
import { InspectorHeader } from "./InspectorHeader";
import { ActionValueField } from "./ActionValueField";
import { ActionTypeSelect } from "./ActionTypeSelect";
import { SpeechTakePanel } from "./SpeechTakePanel";
import { EditActions } from "../../hooks/useEditActions";
import { TimelineLayout } from "../../utils/timelineLayout";
import { isSpeakAction, trackOf } from "../../utils/actionFamilies";
import { useSpeechTakes } from "../../../../../hooks/useSpeechTakes";
export function Inspector({
  actions,
  index,
  id,
  edits,
  layout,
}: {
  actions: IAction[];
  index: number;
  id: string | null;
  edits: EditActions;
  layout: TimelineLayout;
}) {
  const action = actions[index];
  const speech = useSpeechTakes();
  const description = AllActionDescriptions.find(
    (d) => d.name === action?.name,
  );
  return (
    <aside className="cv-inspector">
      <InspectorHeader name={action?.name} index={index} />
      {action ? (
        <div className="cv-inspector-body">
          <ActionValueField
            key={id + "-" + action.name}
            action={action}
            onCommit={(value) => edits.value(index, value, action)}
          />
          <ActionTypeSelect
            name={action.name}
            onChange={(name) => edits.rename(index, name)}
          />
          <p className="cv-help">{description?.description}</p>
          <p className="cv-help">{description?.valueDescription}</p>
          <div className="cv-duration">
            Estimated duration{" "}
            <strong>
              {((layout.tiles[index]?.durationMs ?? 0) / 1000).toFixed(2)} s
            </strong>
          </div>
          <div className="cv-inspector-actions">
            <Button variant="soft" onClick={() => edits.duplicate(index)}>
              Duplicate
            </Button>
            <Button
              color="red"
              variant="soft"
              onClick={() => edits.remove(index)}
            >
              Delete
            </Button>
          </div>
          {isSpeakAction(action) && (
            <SpeechTakePanel key={id} text={action.value} />
          )}
        </div>
      ) : (
        <div className="cv-inspector-body">
          <h2>Your lesson at a glance</h2>
          <p className="cv-help">
            Select a clip to edit its value, change its action, or generate
            speech.
          </p>
          <dl className="cv-overview">
            <dt>Duration</dt>
            <dd>{(layout.durationMs / 1000).toFixed(1)} s</dd>
            <dt>Actions</dt>
            <dd>{actions.length}</dd>
            <dt>Video actions</dt>
            <dd>{actions.filter((a) => trackOf(a) === "V").length}</dd>
            <dt>Speech lines</dt>
            <dd>{actions.filter(isSpeakAction).length}</dd>
            <dt>With audio</dt>
            <dd>
              {
                actions.filter(
                  (a) => isSpeakAction(a) && speech.takeFor(a.value),
                ).length
              }
            </dd>
          </dl>
        </div>
      )}
    </aside>
  );
}
