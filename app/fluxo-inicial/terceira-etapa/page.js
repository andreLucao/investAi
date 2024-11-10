'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react'

export default function page3() {
  const router = useRouter();
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    router.push('/fluxo-inicial/quarta-etapa');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-8">
          O que você acha de criarmos alguns objetivos?
        </h1>

        <h1 className="text-2xl font-semi-bold text-black mb-8">
          Antes disso, vamos separar sua renda nessas categorias:
        </h1>

        <div className="space-y-6">
          
          <div>
            <p className="text-lg font-medium text-black">Sua renda se divide nessas categorias:</p>
          </div>
          <div>
            <p>categoria 1</p>
            <p>categoria 2</p>
            <p>categoria 3</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
          <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white rounded-md py-2 px-4 hover:bg-purple-500 transition-colors "
            >
              <Send className="w-4 h-4" />
              Próximo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}