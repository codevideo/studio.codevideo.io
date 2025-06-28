import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, Button, Box, Heading, Code, Flex } from '@radix-ui/themes';
import { Project } from '@fullstackcraftllc/codevideo-types';

export interface IComponentEmbedderProps {
    project: Project;
    currentActionIndex: number;
    currentLessonIndex: number;
    theme: string;
    mode: string;
}

export const ComponentEmbedder = (props: IComponentEmbedderProps) => {
    const { project, currentActionIndex, currentLessonIndex, theme, mode } = props;
    const [width, setWidth] = useState(854);
    const [height, setHeight] = useState(480);
    const [showCopied, setShowCopied] = useState(false);
    const [embedCode, setEmbedCode] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // on mount, generate the embed code
    useEffect(() => {
        const fullEmbedCode = `
<!-- @radix-ui/themes stylesheet and @fullstackcraftllc/codevideo-ide-react UMD script -->
<link rel="stylesheet" href="https://unpkg.com/@radix-ui/themes/styles.css">
<script src="https://unpkg.com/@fullstackcraftllc/codevideo-ide-react/dist/embeddable.bundle.js"></script>

<div id="codevideo-embed"></div>
<script>
    const props = {
        width: "${width}px",
        height: "${height}px",
        currentActionIndex: ${currentActionIndex},
        currentLessonIndex: ${currentLessonIndex},
        theme: "${theme}",
        mode: "${mode}",
        project: ${JSON.stringify(project)}
    };
    CodeVideoIDEEmbeddable.mountEmbeddableCodeVideoIDE(props, 'codevideo-embed');
</script>
`;
        setEmbedCode(fullEmbedCode);
    }, [width, height, currentActionIndex, currentLessonIndex, theme, mode, project]);

    // After embedCode is set, write it into the iframe
    useEffect(() => {
        if (iframeRef.current && embedCode) {
            const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (!iframeDoc) return;
            iframeDoc.open();
            iframeDoc.write(embedCode);
            iframeDoc.close();
        }
    }, [embedCode]);

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(embedCode);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    }, [embedCode]);

    return (
        <Box mt="9">
            <Card mb="4">
                <Heading size="5" mb="4">Component Preview</Heading>
                <Flex align="center" justify="center">
                <Box 
                    p="4"
                style={{
                    border: '2px dashed var(--gray-7)',
                    borderRadius: 'var(--radius-4)',
                    
                }}>
                    <iframe
                        ref={iframeRef}
                        style={{ width: `${width}px`, height: `${height}px`, border: 'none' }}
                        title="CodeVideoIDE Embed Preview"
                    />
                </Box>
                </Flex>
            </Card>
            <Card>
                <Flex display="flex" justify="between" align="center" mb="4">
                    <Heading size="5">Embed Code</Heading>
                    <Flex gap="2">
                        <Button
                            onClick={copyToClipboard}
                            variant={showCopied ? "soft" : "solid"}
                            size="1"
                        >
                            {showCopied ? 'Copied!' : 'Copy Code'}
                        </Button>
                    </Flex>
                </Flex>
                <Code size="2" style={{ display: 'block', whiteSpace: 'pre', overflowX: 'auto' }}>
                    {embedCode}
                </Code>
            </Card>
        </Box>
    );
};

export default ComponentEmbedder;
