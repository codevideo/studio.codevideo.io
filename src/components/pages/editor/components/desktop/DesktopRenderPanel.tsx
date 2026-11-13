import { useState } from "react";
import { useStore } from "react-redux";
import { Button, Flex, Progress, Select, Text } from "@radix-ui/themes";
import { extractActionsFromProject } from "@fullstackcraftllc/codevideo-types";
import { RootState } from "../../../../../store";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useSpeechTakes } from "../../../../../hooks/useSpeechTakes";
import { addToast } from "../../../../../store/toastSlice";
import { activeTake } from "../../../../../utils/speech/speechAudio";
import {
  cancelRender,
  renderVideo,
  RenderEvent,
  RenderRequest,
  revealPath,
} from "../../../../../runtime/desktop";
import { fileNameFor } from "../../hooks/useDesktopProject";

type Status = { stage: string; fraction: number; detail: string };

/** Renders the open lesson to an MP4 on this machine with the bundled CLI. */
export function DesktopRenderPanel() {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const speech = useSpeechTakes();
  const project = useAppSelector((s) => s.editor.currentProject?.project);
  const [orientation, setOrientation] =
    useState<RenderRequest["orientation"]>("landscape");
  const [resolution, setResolution] =
    useState<RenderRequest["resolution"]>("1080p");
  const [status, setStatus] = useState<Status | null>(null);
  const [rendering, setRendering] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const render = async () => {
    const { currentProject, currentLessonIndex } = store.getState().editor;
    if (!currentProject) return;
    const actions = extractActionsFromProject(
      currentProject.project,
      currentLessonIndex,
    );
    setRendering(true);
    setSaved(null);
    setStatus({
      stage: "Narration",
      fraction: 0,
      detail: "Generating missing speech",
    });
    try {
      // Same as a cloud export: every narrated line gets a take first, and the
      // render uses exactly those takes.
      await speech.generateMissing(actions);
      const takesByText = store.getState().speech.takesByText;
      const texts = [
        ...new Set(
          actions
            .filter((a) => a.name.startsWith("author-speak-"))
            .map((a) => a.value),
        ),
      ];
      const takes = texts.flatMap((text) => {
        const take = activeTake(text, takesByText);
        return take?.path ? [{ text, path: take.path }] : [];
      });
      if (takes.length !== texts.length)
        throw new Error("Some speech lines have no audio yet.");

      const onEvent = (event: RenderEvent) => {
        if (event.type === "progress") setStatus(event);
      };
      const path = await renderVideo(
        {
          project: JSON.stringify(actions),
          takes,
          orientation,
          resolution,
          suggestedName: fileNameFor(currentProject.project, "mp4"),
        },
        onEvent,
      );
      if (path) {
        setSaved(path);
        dispatch(addToast("Your video is ready."));
      }
    } catch (e) {
      dispatch(addToast(e instanceof Error ? e.message : String(e)));
    } finally {
      setRendering(false);
      setStatus(null);
    }
  };

  return (
    <Flex direction="column" gap="3" className="cv-desktop-render">
      <Text size="2" color="gray">
        Renders the open lesson to an MP4 on this computer, with the speech
        takes you chose.
      </Text>
      <Flex gap="3" align="center" wrap="wrap">
        <label className="cv-field-label">
          Orientation
          <Select.Root
            value={orientation}
            onValueChange={(v) =>
              setOrientation(v as RenderRequest["orientation"])
            }
            disabled={rendering}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="landscape">Landscape</Select.Item>
              <Select.Item value="portrait">Portrait</Select.Item>
            </Select.Content>
          </Select.Root>
        </label>
        <label className="cv-field-label">
          Resolution
          <Select.Root
            value={resolution}
            onValueChange={(v) =>
              setResolution(v as RenderRequest["resolution"])
            }
            disabled={rendering}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="1080p">1080p</Select.Item>
              <Select.Item value="4K">4K</Select.Item>
            </Select.Content>
          </Select.Root>
        </label>
      </Flex>
      {rendering ? (
        <Flex direction="column" gap="2">
          <Text size="2">
            {status?.stage ?? "Starting"}
            {status?.detail ? ` · ${status.detail}` : ""}
          </Text>
          <Progress value={Math.round((status?.fraction ?? 0) * 100)} />
          <Button variant="soft" color="red" onClick={() => cancelRender()}>
            Cancel
          </Button>
        </Flex>
      ) : (
        <Button onClick={render} disabled={!project}>
          Render video…
        </Button>
      )}
      {saved && (
        <Flex gap="2" align="center" wrap="wrap">
          <Text size="2">Saved to {saved}</Text>
          <Button variant="ghost" onClick={() => revealPath(saved)}>
            Show in folder
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
