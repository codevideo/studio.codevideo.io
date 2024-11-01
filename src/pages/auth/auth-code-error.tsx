import { Link } from 'gatsby';
import * as React from 'react';

export interface IAuthErrorPageProps {
}

export default function AuthErrorPage (props: IAuthErrorPageProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 p-8 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-gray-300 mb-6">
          There was a problem authenticating your account. Please try again or contact support if the problem persists.
        </p>
        <Link 
          to="/"
          className="block w-full text-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
