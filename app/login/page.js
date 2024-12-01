'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="rounded-lg bg-white px-6 py-3 text-gray-900 shadow-md hover:bg-gray-100"
      >
        Sign in with Google
      </button>
    </div>
  );
}