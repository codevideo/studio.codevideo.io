import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { TimelineTile } from "../../utils/timelineLayout";
import { colorOf, isSpeakAction, trackOf } from "../../utils/actionFamilies";
export function ActionTile({
  id,
  action,
  tile,
  selected,
  hasAudio,
  disabled,
  onSelect,
  onDuplicate,
  onDelete,
}: {
  id: string;
  action: IAction;
  tile: TimelineTile;
  selected: boolean;
  hasAudio: boolean;
  disabled: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });
  const color = colorOf(action.name);
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-timeline-tile
      data-selected={selected}
      className={
        "cv-action-tile " +
        (isSpeakAction(action) && !hasAudio ? "cv-no-audio" : "")
      }
      title={`${tile.index + 1}. ${action.name}: ${action.value} (${(tile.durationMs / 1000).toFixed(2)} s)`}
      style={{
        left: tile.x,
        top: trackOf(action) === "A" ? 112 : 40,
        width: tile.width,
        backgroundColor: `var(--${color}-5)`,
        borderColor: `var(--${color}-8)`,
        color: `var(--${color}-12)`,
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 5 : 1,
        opacity: isDragging ? 0.75 : 1,
      }}
      onClick={onSelect}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
          e.preventDefault();
          onDuplicate();
        }
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          onDelete();
        }
        if (e.key === "Enter") onSelect();
        listeners?.onKeyDown?.(e);
      }}
    >
      <span className="cv-tile-name">{action.name}</span>
      <span className="cv-tile-value">{action.value}</span>
    </button>
  );
}
