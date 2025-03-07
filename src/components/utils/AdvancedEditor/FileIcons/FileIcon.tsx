import React, { JSX } from 'react';
import { CodeGray, Cplus, Csharp, Gear, Git, Go, Js, License, Markdown, Python, Reactjs, Reactts, Rust, Shell, Text, TypeScript, Yaml } from '@react-symbols/icons';

export interface IFileIconProps {
    filename: string;
}

export function FileIcon(props: IFileIconProps) {
    const { filename } = props;
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
            return <Js height="20" />;
        case 'ts':
            return <TypeScript height="20" />;
        case 'go':
            return <Go height="20" />;
        case 'sh':
        case 'zsh':
            return <Shell height="20" />;
        case 'yaml':
            return <Yaml height="20" />;
        case 'cs':
            return <Csharp height="20" />;
        case 'cpp':
            return <Cplus height="20" />;
        case 'jsx':
            return <Reactjs height="20" />;
        case 'tsx':
            return <Reactts height="20" />;
        case 'env':
        case 'toml':
            return <Gear height="20" />;
        case 'gitignore':
            return <Git height="20" />;
        case 'md':
            return <Markdown height="20" />;
        case 'py':
            return <Python height="20" />;
        case 'rs':
            return <Rust height="20" />;
        case "txt":
            return <Text height="20" />;
        default:
            if (filename.toUpperCase() === 'LICENSE') {
                return <License height="20" />;
            }
            return <CodeGray height="20" />;
    }
}