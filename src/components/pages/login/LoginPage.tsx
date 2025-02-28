import * as React from 'react';
import { Auth } from '../../utils/Auth';

export interface ILoginPageProps {}

export function LoginPage(props: ILoginPageProps) {
    return (
        <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-4">
            {/* Main container */}
            <div className="w-full max-w-md bg-white dark:bg-emerald-800 rounded-lg shadow-xl p-8">
                {/* Logo/Brand section */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-emerald-900 dark:text-white">
                        CodeVideo Studio
                    </h1>
                </div>

                {/* Welcome text */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-200 mb-2">
                        Welcome
                    </h2>
                    <p className="text-emerald-600 dark:text-emerald-300">
                        Log in to CodeVideo to continue to CodeVideo Studio
                    </p>
                </div>

                {/* Auth buttons container */}
                <div className="space-y-4 flex flex-col items-center">
                    <div className="hover:opacity-90 transition-opacity">
                        <Auth provider="google" />
                    </div>
                    <div className="hover:opacity-90 transition-opacity">
                        <Auth provider="github" />
                    </div>
                </div>
            </div>

            {/* Optional footer */}
            <div className="mt-8 text-center text-sm text-emerald-400">
                <p>© {new Date().getFullYear()} CodeVideo Studio. All rights reserved.</p>
            </div>
        </div>
    );
}

export default LoginPage;