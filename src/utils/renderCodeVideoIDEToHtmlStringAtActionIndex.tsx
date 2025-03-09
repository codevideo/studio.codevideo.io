import React from 'react';
import * as ReactDOMServer from 'react-dom/server'; // important that this has the .browser suffix
import { CodeVideoIDE } from '@fullstackcraftllc/codevideo-ide-react';
import { Project } from '@fullstackcraftllc/codevideo-types';

export const renderCodeVideoIDEToHtmlStringAtActionIndex = (project: Project, actionIndex: number) => {
  // Generate HTML string using ReactDOMServer.renderToString
  // even though this is called "ReactDOMServer", it can be used in the browser: https://react.dev/reference/react-dom/server/renderToString
  const htmlString = ReactDOMServer.renderToString(<CodeVideoIDE
    theme={'light'}
    project={project}
    mode={'step'}
    allowFocusInEditor={false}
    currentActionIndex={actionIndex}
    currentLessonIndex={null}
    defaultLanguage={''}
    isExternalBrowserStepUrl={null}
    isSoundOn={false}
    withCaptions={true}
    actionFinishedCallback={() => { }}
    speakActionAudios={[]} />);

  return htmlString;
}