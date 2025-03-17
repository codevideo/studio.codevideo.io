import * as React from 'react';
import { CodeVideoIDE } from '@fullstackcraftllc/codevideo-ide-react';
import { Box, Flex, Theme } from '@radix-ui/themes';
import { useAppSelector } from '../../../../hooks/useAppSelector';

export function StaticCodeVideoIDE() {
  const { currentProject, currentActionIndex, currentLessonIndex, isSoundOn, allowFocusInEditor } = useAppSelector((state) => state.editor);
  const { theme } = useAppSelector(state => state.theme);

  if (!currentProject) {
    console.log("No current project");
    return null;
  }
  
  return (
    <Theme
      accentColor="mint"
      appearance="dark"
      panelBackground="translucent"
      radius="large"
    >
      <Flex direction="column" justify="center" align="center">
        <Box
          style={{
            height: '100vh',
            width: '100vw',
          }}
        >
          <CodeVideoIDE
            theme={theme}
            project={currentProject.project}
            mode={"step"}
            allowFocusInEditor={allowFocusInEditor}
            defaultLanguage={"javascript"}
            isExternalBrowserStepUrl={""}
            currentActionIndex={currentActionIndex}
            currentLessonIndex={currentLessonIndex}
            isSoundOn={isSoundOn}
            withCaptions={true}
            actionFinishedCallback={() => { }}
            playBackCompleteCallback={() => { }}
            speakActionAudios={[]}
          />
        </Box>
      </Flex>
    </Theme>
  );
}
