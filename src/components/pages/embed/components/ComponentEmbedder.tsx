import React, { useState, useCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card, Button, Box, Heading, Code, Flex } from '@radix-ui/themes';
import { Provider } from 'react-redux';
import createStore from '../../../../store';
import { useAppSelector } from '../../../../hooks/useAppSelector';

export interface IComponentEmbedderProps<T> {
    Component: React.ComponentType<T>;
    componentName: string;
    componentProps: T;
}

export const ComponentEmbedder = <T extends {} = {}>(props: IComponentEmbedderProps<T>) => {
    const { Component, componentName, componentProps } = props;
    const [showCopied, setShowCopied] = useState(false);

    // Grab the current global state
    const globalState = useAppSelector(state => state);

    const generateEmbedCode = useCallback(() => {
        // Get the static HTML markup of the component
        const componentHtml = renderToStaticMarkup(
            <Provider store={createStore(globalState)}>
                <Component {...componentProps} />
            </Provider>
        );

        console.log("componentHtml is", componentHtml);

        return `<!-- React Component Embed Code -->
<div id="embedded-component">${componentHtml}</div>

<!-- Dependencies -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@radix-ui/themes@2.0.0/styles.css">
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Component Hydration -->
<script type="text/javascript">
  // Re-hydrate the component to make it interactive
  const root = ReactDOM.createRoot(document.getElementById('embedded-component'));
  root.render(React.createElement(${componentName}));
</script>`;
    }, [Component, componentName, componentProps]);

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(generateEmbedCode());
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    }, [generateEmbedCode]);

    console.log("RENDERING, componentProps are", componentProps);

    return (
        <Box mt="9">
            <Card mb="4">
                <Heading size="5" mb="4">Component Preview</Heading>
                <Box style={{
                    border: '2px dashed var(--gray-7)',
                    borderRadius: 'var(--radius-4)',
                    padding: 'var(--space-4)'
                }}>
                    <Component {...componentProps} />
                </Box>
            </Card>

            <Card>
                <Flex display="flex" justify="between" align="center" mb="4">
                    <Heading size="5">Embed Code</Heading>
                    <Button
                        onClick={copyToClipboard}
                        variant={showCopied ? "soft" : "solid"}
                    >
                        {showCopied ? 'Copied!' : 'Copy Code'}
                    </Button>
                </Flex>
                <Code size="2" style={{ display: 'block', whiteSpace: 'pre', overflowX: 'auto' }}>
                    {generateEmbedCode()}
                </Code>
            </Card>
        </Box>
    );
}

export default ComponentEmbedder;