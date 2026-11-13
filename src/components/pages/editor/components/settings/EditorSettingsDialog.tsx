import { useState } from "react";
import { Dialog, Tabs, IconButton, Button, Flex, Text } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import { ExportDropdown } from "../../../../layout/sidebar/ExportDropdown";
import { VirtualLayerLogs } from "../../../studio/components/footer/VirtualLayerLogs";
import { VideoTimeEstimationsAndStats } from "../../../studio/components/footer/VideoTimeEstimationsAndStats";
import { SpeechSettings } from "./SpeechSettings";
import { DesktopRenderPanel } from "../desktop/DesktopRenderPanel";
import { APP_VERSION, IS_DESKTOP } from "../../../../../runtime/environment";
export function EditorSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [exportTarget, setExportTarget] = useState<HTMLDivElement | null>(null);
  return (
    <>
      {!IS_DESKTOP && <ExportDropdown portalTarget={exportTarget} />}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <IconButton aria-label="Editor settings" variant="ghost">
            <GearIcon />
          </IconButton>
        </Dialog.Trigger>
        <Dialog.Content maxWidth="760px">
          <Dialog.Title>Editor settings</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {IS_DESKTOP
              ? "Render your lesson, choose a voice, and inspect playback."
              : "Export your lesson, choose a voice, and inspect playback."}
          </Dialog.Description>
          <Tabs.Root defaultValue="export">
            <Tabs.List>
              <Tabs.Trigger value="export">
                {IS_DESKTOP ? "Render" : "Export"}
              </Tabs.Trigger>
              <Tabs.Trigger value="speech">Speech</Tabs.Trigger>
              <Tabs.Trigger value="stats">Stats</Tabs.Trigger>
              <Tabs.Trigger value="logs">Virtual layer logs</Tabs.Trigger>
            </Tabs.List>
            <div className="cv-settings-body">
              <Tabs.Content value="export" forceMount className="cv-export-tab">
                {IS_DESKTOP ? (
                  <DesktopRenderPanel />
                ) : (
                  <div ref={setExportTarget} />
                )}
              </Tabs.Content>
              <Tabs.Content value="speech">
                <SpeechSettings />
              </Tabs.Content>
              <Tabs.Content value="stats">
                <VideoTimeEstimationsAndStats />
              </Tabs.Content>
              <Tabs.Content value="logs">
                <VirtualLayerLogs />
              </Tabs.Content>
            </div>
          </Tabs.Root>
          <Flex justify="between" align="center" mt="4">
            <Dialog.Close>
              <Button variant="soft">Done</Button>
            </Dialog.Close>
            {APP_VERSION && (
              <Text size="1" color="gray">
                CodeVideo Studio v{APP_VERSION}
                {IS_DESKTOP ? " · desktop" : ""}
              </Text>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
