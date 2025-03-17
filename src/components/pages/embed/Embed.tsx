import * as React from 'react';
import ComponentEmbedder from './components/ComponentEmbedder';
import { StaticCodeVideoIDE } from './components/StaticCodeVideoIDE';

export function Embed() {
    return (
        <ComponentEmbedder
            Component={StaticCodeVideoIDE}
            componentName={"CodeVideoIDE"}
            componentProps={{}}
        />
    );
}
