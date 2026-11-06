import * as React from 'react';
import { useClerk } from '@clerk/clerk-react';
import ComponentEmbedder from './components/ComponentEmbedder';
import { StaticCodeVideoIDE } from './components/StaticCodeVideoIDE';

export function Embed() {
    // the preview mounts Monaco, and if Monaco's AMD loader runs before clerk.browser.js,
    // Clerk registers as an AMD module and window.Clerk is never set. Wait, as MainStudio does
    const clerk = useClerk();

    return (
        <ComponentEmbedder
            Component={StaticCodeVideoIDE}
            componentName={"CodeVideoIDE"}
            componentProps={{}}
            showPreview={clerk.loaded}
        />
    );
}
