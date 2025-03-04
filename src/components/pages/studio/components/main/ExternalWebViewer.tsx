import React, { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

export interface IExternalWebViewerProps {
    url: string;
}

export const ExternalWebViewer = (props: IExternalWebViewerProps) => {
    const { url } = props;
    const [hasError, setHasError] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    // Start a timeout to detect load failures
    useEffect(() => {
        // If the iframe hasn't loaded after 10 seconds, assume it failed
        const timer = setTimeout(() => {
            if (!hasLoaded) {
                setHasError(true);
            }
        }, 10000);

        return () => clearTimeout(timer);
    }, [hasLoaded]);

    return (
        <Box style={{ width: '100%', height: '100vh' }}>
            {hasError ? (
                <Flex align="center" justify="center" style={{ height: '100%' }}>
                    <Text size="5" style={{ color: 'var(--gray-10)' }}>
                        Failed to load external content from {url}. The site may be invalid or not allow iframes.
                    </Text>
                </Flex>
            ) : (
                <iframe
                    src={url}
                    title="External Web Viewer"
                    style={{ width: '100%', height: '100%', border: 0 }}
                    sandbox="allow-same-origin allow-scripts allow-popups"
                    onLoad={() => setHasLoaded(true)}
                    onError={() => setHasError(true)}
                />
            )}
        </Box>
    );
};