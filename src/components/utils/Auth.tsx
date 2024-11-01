import * as React from 'react';
import { supabase } from '../../services/supabase';
import { GoogleIcon } from '../icons/GoogleIcon';
import { GithubIcon } from '../icons/GithubIcon';

export interface IAuthProps {
    provider: 'github' | 'google'
}

export function Auth(props: IAuthProps) {
    const { provider } = props

    const handleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/.netlify/functions/auth-callback`,
                },
            })

            if (error) throw error
        } catch (error) {
            console.error('Error logging in:', error)
        }
    }

    const icon = provider === 'github' ? <GithubIcon className="w-5 h-5" /> : <GoogleIcon className="w-5 h-5" />

    return (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-6 py-3 my-3 rounded-lg bg-gradient-to-r from-teal-400 to-teal-500 text-white hover:bg-gray-700 transition-colors"
        >
            {icon}
            Continue with {provider === 'github' ? 'GitHub' : 'Google'}
        </button>
    )
}