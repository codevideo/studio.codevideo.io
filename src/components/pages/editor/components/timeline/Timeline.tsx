import { useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  CollisionDetection,
  KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { TimelineLayout, xToIndex } from "../../utils/timelineLayout";
import { EditActions } from "../../hooks/useEditActions";
import { Playback } from "../../hooks/usePlayback";
import { TimelineToolbar } from "./TimelineToolbar";
import { InsertActionMenu } from "./InsertActionMenu";
import { ActionTile } from "./ActionTile";
import { ActionTileMenu } from "./ActionTileMenu";
import { TimeRuler } from "./TimeRuler";
import { Track } from "./Track";
import { Playhead } from "./Playhead";
import { useSpeechTakes } from "../../../../../hooks/useSpeechTakes";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { addToast } from "../../../../../store/toastSlice";
import { isSpeakAction } from "../../utils/actionFamilies";
const xCollision: CollisionDetection = ({
  droppableContainers,
  droppableRects,
  collisionRect,
}) =>
  droppableContainers
    .map((c) => {
      const r = droppableRects.get(c.id);
      return {
        id: c.id,
        data: {
          droppableContainer: c,
          value: r
            ? Math.abs(
                collisionRect.left +
                  collisionRect.width / 2 -
                  r.left -
                  r.width / 2,
              )
            : Infinity,
        },
      };
    })
    .sort((a, b) => a.data.value - b.data.value);
export function Timeline({
  actions,
  ids,
  selectedId,
  select,
  edits,
  playback,
  layout,
  zoom,
  setZoom,
}: {
  actions: IAction[];
  ids: string[];
  selectedId: string | null;
  select: (id: string, index: number) => void;
  edits: EditActions;
  playback: Playback;
  layout: TimelineLayout;
  zoom: number;
  setZoom: (n: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [follow, setFollow] = useState(true);
  const [insertAfter, setInsertAfter] = useState<number | null>(null);
  const [insertOpen, setInsertOpen] = useState(false);
  const speech = useSpeechTakes();
  const dispatch = useAppDispatch();
  // Keyboard navigation follows the one-dimensional sequence even when adjacent clips are in different tracks.
  const keyboardCoordinates: KeyboardCoordinateGetter = (
    event,
    { currentCoordinates, context },
  ) => {
    const delta =
      event.code === "ArrowRight" ? 1 : event.code === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const index = ids.indexOf(String(context.over?.id ?? context.active?.id));
    const target = ids[index + delta];
    const rect = target ? context.droppableRects.get(target) : undefined;
    const current = context.collisionRect;
    if (rect && current)
      return {
        x:
          currentCoordinates.x +
          rect.left +
          rect.width / 2 -
          current.left -
          current.width / 2,
        y: currentCoordinates.y,
      };
  };
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: keyboardCoordinates,
      keyboardCodes: { start: ["Enter"], end: ["Enter"], cancel: ["Escape"] },
    }),
  );
  const missing = [
    ...new Set(
      actions
        .filter(isSpeakAction)
        .filter((a) => !speech.takeFor(a.value))
        .map((a) => a.value),
    ),
  ].length;
  const fit = () => {
    const width = scrollRef.current?.clientWidth ?? 800;
    let low = 0.01,
      high = 10000;
    for (let i = 0; i < 35; i++) {
      const middle = (low + high) / 2;
      const size = layout.tiles.reduce(
        (s, t) => s + Math.max(8, (t.durationMs * middle) / 1000),
        0,
      );
      if (size > width - 24) high = middle;
      else low = middle;
    }
    setZoom(low);
  };
  return (
    <section className="cv-timeline" aria-label="Action timeline">
      <TimelineToolbar
        zoom={zoom}
        setZoom={setZoom}
        follow={follow}
        setFollow={setFollow}
        fit={fit}
        undo={edits.undo}
        redo={edits.redo}
      />
      <div className="cv-timeline-tracks">
        <div className="cv-track-headers">
          <InsertActionMenu
            open={insertOpen}
            onOpenChange={(value) => {
              setInsertOpen(value);
              if (!value) setInsertAfter(null);
            }}
            disabled={playback.isPlaying}
            onInsert={(name) => {
              edits.insert(insertAfter ?? playback.index, name);
              setInsertAfter(null);
            }}
          />
          <div className="cv-track-label">
            <b>V</b>
            <span>Video</span>
          </div>
          <div className="cv-track-label cv-audio-header">
            <div>
              <b>A</b>
              <span>Audio</span>
            </div>
            <button
              disabled={!missing || speech.pending.length > 0}
              onClick={() =>
                speech
                  .generateMissing(actions)
                  .catch((e) => dispatch(addToast(e.message)))
              }
            >
              Generate missing ({missing})
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="cv-timeline-scroll">
          <DndContext
            sensors={sensors}
            collisionDetection={xCollision}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={({ active, over }) => {
              if (over && !playback.isPlaying)
                edits.move(
                  ids.indexOf(String(active.id)),
                  ids.indexOf(String(over.id)),
                );
            }}
          >
            <SortableContext
              items={ids}
              strategy={horizontalListSortingStrategy}
            >
              <div
                className="cv-track-canvas"
                style={{
                  width: Math.max(
                    layout.width + 24,
                    scrollRef.current?.clientWidth ?? 0,
                  ),
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    select("", -1);
                  }
                }}
              >
                <div
                  onPointerDown={(e) => {
                    if (
                      (e.target as HTMLElement).closest(".cv-playhead-handle")
                    )
                      return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    playback.seek(xToIndex(layout, e.clientX - rect.left));
                  }}
                >
                  <TimeRuler layout={layout} />
                </div>
                <Track label="V" />
                <Track label="A" />
                {actions.map((a, i) => (
                  <ActionTileMenu
                    key={ids[i]}
                    index={i}
                    edits={edits}
                    playback={playback}
                    insertAt={(index) => {
                      setInsertAfter(index);
                      setInsertOpen(true);
                    }}
                  >
                    <ActionTile
                      id={ids[i]!}
                      action={a}
                      tile={layout.tiles[i]!}
                      selected={selectedId === ids[i]}
                      hasAudio={!!speech.takeFor(a.value)}
                      disabled={playback.isPlaying}
                      onSelect={() => select(ids[i]!, i)}
                      onDuplicate={() => edits.duplicate(i)}
                      onDelete={() => edits.remove(i)}
                    />
                  </ActionTileMenu>
                ))}
                <Playhead
                  playback={playback}
                  layout={layout}
                  scrollRef={scrollRef}
                  follow={follow}
                />
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <div className="cv-timeline-footer">
        <span>
          {actions.length} actions · {(layout.durationMs / 1000).toFixed(1)} s
        </span>
        <button
          disabled={!missing || speech.pending.length > 0}
          onClick={() =>
            speech
              .generateMissing(actions)
              .catch((e) => dispatch(addToast(e.message)))
          }
        >
          Generate missing ({missing})
        </button>
      </div>
    </section>
  );
}
