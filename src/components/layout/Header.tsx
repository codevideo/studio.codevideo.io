import * as React from 'react';
import { Link } from 'gatsby';
import { useAppSelector } from '../../hooks/useAppSelector';


export interface IHeaderProps {
}

export function Header(props: IHeaderProps) {
    const { isUserLoggedIn } = useAppSelector(state => state.user)
    return (
        <header className="max-w-[1800px] mx-auto mb-6 bg-slate-100 p-3">
            <div className="flex items-center justify-between">
                <Link
                    to="/"
                    className="text-black rounded-lg transition-colors"
                >
                    <div className='flex items-center gap-2'>
                    <img src="favicon.ico" alt="CodeVideo Studio" className="w-8 h-8 inline-block" />
                    CodeVideo™ Studio
                    </div>
                </Link>
                <span className='text-sm text-slate-500 text-left mr-auto mx-3'>Create and share interactive coding tutorials</span>
                {isUserLoggedIn ? (<Link
                    to="/purchase-credits"
                    className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                >
                    Purchase Credits
                </Link>) : (
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}
