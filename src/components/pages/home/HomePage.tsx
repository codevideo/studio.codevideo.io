import * as React from 'react';
import { Auth } from '../../utils/Auth';

export interface IHomePageProps {
}

export function HomePage(props: IHomePageProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
                <h1 className="text-7xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent">
                    CodeVideo Studio
                </h1>
                <h2 className="mt-6 text-2xl sm:text-2xl text-white dark:text-white max-w-2xl mx-auto leading-relaxed">
                    Create educational software videos in <span className='font-bold text-teal-400'>minutes</span>, not weeks
                </h2>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto sm:max-w-none">
                    <Auth provider="github" />
                    <Auth provider="google" />
                </div>
            </div>
        </div>
    );
}
