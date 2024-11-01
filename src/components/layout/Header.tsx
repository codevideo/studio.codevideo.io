import * as React from 'react';
import { Link } from 'gatsby';


export interface IHeaderProps {
}

export function Header(props: IHeaderProps) {
    return (
        <header className="max-w-[1800px] mx-auto mb-6 bg-slate-100 p-3">
            <div className="flex items-center justify-between">
                <Link
                    to="/studio"
                    className="text-black rounded-lg transition-colors"
                >
                    CodeVideo™ Studio
                </Link>
                <Link
                    to="/purchase-credits"
                    className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                >
                    Purchase Credits
                </Link>
            </div>
        </header>
    );
}
