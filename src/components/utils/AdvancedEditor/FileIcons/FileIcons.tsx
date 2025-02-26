import React, { JSX } from 'react';

interface IconProps {
    className?: string;
    size?: number;
}

export const FileIcons = {
    js: ({ className, size = 16 }: IconProps) => (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path
                fill="#F7DF1E"
                d="M2 2v28h28V2H2zm15.238 21.837c0 2.725-1.6 3.969-3.931 3.969-2.106 0-3.325-1.087-3.95-2.406l2.144-1.294c.413.725.788 1.338 1.694 1.338.863 0 1.412-.338 1.412-1.656v-8.944h2.631v8.993zm6.224 3.969c-2.444 0-4.025-1.162-4.794-2.688l2.144-1.237c.563.919 1.3 1.6 2.594 1.6 1.087 0 1.788-.544 1.788-1.3 0-.9-.713-1.219-1.919-1.75l-.656-.281c-1.9-.806-3.156-1.825-3.156-3.969 0-1.975 1.506-3.475 3.85-3.475 1.675 0 2.875.581 3.738 2.106l-2.05 1.313c-.45-.806-.938-1.125-1.694-1.125-.768 0-1.256.488-1.256 1.125 0 .788.488 1.106 1.619 1.6l.656.281c2.238.956 3.494 1.938 3.494 4.137 0 2.363-1.863 3.662-4.357 3.662z"
            />
        </svg>
    ),
    ts: ({ className, size = 16 }: IconProps) => (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path
                fill="#3178C6"
                d="M2 2v28h28V2H2zm15.95 14.75c.712-.713 1.563-1.063 2.55-1.063 1.013 0 1.838.3 2.475.9.638.6.956 1.35.956 2.25l-.006 5.525h-2.356v-5.088c0-.487-.137-.862-.412-1.125-.275-.262-.663-.394-1.163-.394-.562 0-1.012.175-1.35.525-.337.35-.506.863-.506 1.538v4.544h-2.356v-5.088c0-.487-.138-.862-.413-1.125-.275-.262-.662-.394-1.162-.394-.563 0-1.013.175-1.35.525-.338.35-.507.863-.507 1.538v4.544h-2.356V16.8h2.356v1.063c.4-.4.838-.706 1.313-.919a3.894 3.894 0 011.619-.319c1.312 0 2.275.456 2.887 1.369.45-.438.969-.775 1.556-1.013.588-.237 1.194-.356 1.819-.356z"
            />
        </svg>
    ),
    jsx: ({ className, size = 16 }: IconProps) => (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path
                fill="#61DAFB"
                d="M16 13.146c-1.573 0-2.854 1.281-2.854 2.854s1.281 2.854 2.854 2.854 2.854-1.281 2.854-2.854-1.281-2.854-2.854-2.854zm-7.99 8.338c-.758 0-1.375.617-1.375 1.375s.617 1.375 1.375 1.375 1.375-.617 1.375-1.375-.617-1.375-1.375-1.375zm16.031.073c-.758 0-1.375.617-1.375 1.375s.617 1.375 1.375 1.375 1.375-.617 1.375-1.375-.617-1.375-1.375-1.375zM16 9.74c1.865 0 3.375-1.51 3.375-3.375S17.865 2.99 16 2.99s-3.375 1.51-3.375 3.375S14.135 9.74 16 9.74z"
            />
        </svg>
    ),
    tsx: ({ className, size = 16 }: IconProps) => (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <defs>
                <linearGradient id="tsx-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#61DAFB" />
                    <stop offset="100%" stopColor="#3178C6" />
                </linearGradient>
            </defs>
            <path
                fill="url(#tsx-gradient)"
                d="M16 13.146c-1.573 0-2.854 1.281-2.854 2.854s1.281 2.854 2.854 2.854 2.854-1.281 2.854-2.854-1.281-2.854-2.854-2.854zm-7.99 8.338c-.758 0-1.375.617-1.375 1.375s.617 1.375 1.375 1.375 1.375-.617 1.375-1.375-.617-1.375-1.375-1.375zm16.031.073c-.758 0-1.375.617-1.375 1.375s.617 1.375 1.375 1.375 1.375-.617 1.375-1.375-.617-1.375-1.375-1.375z"
            />
        </svg>
    ),
    cs: ({ className, size = 16 }: IconProps) => (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path
                fill="#953DAC"
                d="M2 2v28h28V2H2zm22.6 14.834c0 3.702-2.167 5.818-5.251 5.818-1.1 0-2.017-.184-2.917-.551v-2.101c.917.434 1.784.651 2.6.651 1.917 0 2.917-1.017 2.917-3.051v-6.7h2.651v5.934zm-10.967 5.768c-2.734 0-4.434-1.868-4.434-4.868 0-3.034 1.7-4.951 4.434-4.951 2.717 0 4.4 1.917 4.4 4.951 0 3-1.683 4.868-4.4 4.868zm.017-7.885c-1.5 0-2.434 1.151-2.434 3.017 0 1.834.934 2.968 2.434 2.968 1.483 0 2.4-1.134 2.4-2.968 0-1.866-.917-3.017-2.4-3.017z"
            />
        </svg>
    ),
    env: ({ className, size = 16 }: IconProps) => (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path
                fill="#4CAF50"
                d="M28 4H4a2 2 0 00-2 2v20a2 2 0 002 2h24a2 2 0 002-2V6a2 2 0 00-2-2zm-2 18H6v-2h20v2zm0-4H6v-2h20v2zm0-4H6v-2h20v2z"
            />
        </svg>
    ),
    md: ({ className, size = 16 }: IconProps) => (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path
                fill="#42A5F5"
                d="M2.5 7.5v17h27v-17h-27zm24.75 14.875h-22.5v-12.75h22.5v12.75zM6.625 18.875l3.375-3.375 1.688 1.688 5.062-5.063 6.75 6.75h-16.875z"
            />
        </svg>
    ),
    license: ({ className, size = 16 }: IconProps) => (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path
                fill="#FF9800"
                d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 25.2c-6.187 0-11.2-5.013-11.2-11.2S9.813 4.8 16 4.8 27.2 9.813 27.2 16 22.187 27.2 16 27.2zm0-19.6c-4.631 0-8.4 3.769-8.4 8.4s3.769 8.4 8.4 8.4 8.4-3.769 8.4-8.4-3.769-8.4-8.4-8.4z"
            />
        </svg>
    ),
    default: ({ className, size = 16 }: IconProps) => (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path
                fill="#90A4AE"
                d="M20 4H8C6.9 4 6 4.9 6 6v20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10l-6-6zm4 22H8V6h11v5h5v15z"
            />
        </svg>
    )
};

export function getFileIcon(filename: string): JSX.Element {
    const ext = filename.split('.').pop()?.toLowerCase();
    const IconComponent = (() => {
        switch (ext) {
            case 'js':
                return FileIcons.js;
            case 'ts':
                return FileIcons.ts;
            case 'cs':
                return FileIcons.cs;
            case 'jsx':
                return FileIcons.jsx;
            case 'tsx':
                return FileIcons.tsx;
            case 'env':
                return FileIcons.env;
            case 'md':
                return FileIcons.md;
            default:
                if (filename.toUpperCase() === 'LICENSE') {
                    return FileIcons.license;
                }
                return FileIcons.default;
        }
    })();

    return <IconComponent size={16} className="inline-block" />;
}