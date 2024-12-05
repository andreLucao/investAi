'use client';

import { signIn } from 'next-auth/react';
import { Card, CardContent } from '@/app/components/Card';
import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    // Enable dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-900 transition-colors duration-300">
      <Card className="max-w-md w-full bg-gray-800 shadow-lg">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              Bem-vindo
            </h1>
            
            <h2 className="text-xl font-semibold text-gray-200">
              Faça login para continuar
            </h2>

            <button
              onClick={() => signIn('google', { callbackUrl: '/fluxo-inicial/sexta-etapa' })}
              className="w-full flex items-center justify-center gap-3 
                       bg-gradient-to-r from-purple-600 to-purple-800
                       hover:from-purple-700 hover:to-purple-900
                       text-white rounded-lg py-3 px-4 
                       transition-all duration-300 transform 
                       hover:-translate-y-1 hover:shadow-lg"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#fff"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#fff"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#fff"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#fff"
                />
              </svg>
              Entrar com Google
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}