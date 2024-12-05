'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [connectionStatus, setConnectionStatus] = useState('');

  async function testMongoConnection() {
    try {
      const response = await fetch('/api/test-mongo'); 
      const data = await response.json();
      setConnectionStatus(data.message);
    } catch (error) {
      setConnectionStatus(`Erro: ${error.message}`);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })} 
        className="rounded-lg bg-white px-6 py-3 text-gray-900 shadow-md hover:bg-gray-100"
      >
        Sign in with Google
      </button>


    </div>
  );
}
