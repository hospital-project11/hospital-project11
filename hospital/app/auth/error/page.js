'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        {error && <p className="text-red-400">Error code: {error}</p>}
        <a href="/login" className="underline text-blue-400">Back to login</a>
      </div>
    </div>
  );
}
