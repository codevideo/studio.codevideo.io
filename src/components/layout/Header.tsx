import * as React from 'react';
import { Link } from 'gatsby';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { toggleSidebar } from '../../store/editorSlice';
import { useAppSelector } from '../../hooks/useAppSelector';

export function Header() {
    const { currentProjectIndex } = useAppSelector(state => state.editor)
    const dispatch = useAppDispatch();

    // const { isUserLoggedIn } = useAppSelector(state => state.user)
    return (
        <header className="max-w-[1800px] mx-auto mb-6 bg-slate-100 p-3">
            <div className="flex items-center justify-between">
                <div className="w-[100px]"> {/* Fixed width container for left side */}
                    {currentProjectIndex === -1 ? <div></div> : <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>}
                </div>
                <Link
                    to="/"
                    className="text-black rounded-lg transition-colors absolute left-1/2 transform -translate-x-1/2"
                >
                    <div className='flex items-center gap-2'>
                        {'/>'} CodeVideo™ Studio
                    </div>
                </Link>
                <div className="w-[300px] flex justify-end"> {/* Fixed width container for right side */}
                    <Link
                        to="/pdf/CodeVideo_Framework_White_Paper.pdf"
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-green-900 transition-colors mr-3"
                    >
                        Read white paper
                    </Link>
                    <a
                        href="https://github.com/orgs/codevideo/repositories"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                    >
                        GitHub
                    </a>
                </div>
                {/* {isUserLoggedIn ? (<Link
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
                )} */}
            </div>
        </header>
    );
}
