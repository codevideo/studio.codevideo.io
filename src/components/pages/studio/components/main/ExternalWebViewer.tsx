import React, { useState, useEffect } from 'react';

export interface IExternalWebViewerProps {
    url: string;
}

const ExternalWebViewer = (props: IExternalWebViewerProps) => {
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
        <div className="w-full h-screen">
            {hasError ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-xl text-gray-700">
                        Failed to load external content from {url}. The site may be invalid or not allow iframes.
                    </p>
                </div>
            ) : (
                <iframe
                    src={url}
                    title="External Web Viewer"
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin allow-scripts allow-popups"
                    onLoad={() => setHasLoaded(true)}
                    onError={() => setHasError(true)}
                />
            )}
        </div>
    );
};

export default ExternalWebViewer;
