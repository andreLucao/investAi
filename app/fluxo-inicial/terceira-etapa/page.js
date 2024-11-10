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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] max-w-md w-full space-y-8 text-center p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
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
            <p>💰 Gastos Fixos: <strong>55%</strong></p>
            <p>⚽ Lazer: <strong>15%</strong></p>
            <p>💳 Dívida: <strong>30%</strong></p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
          <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white rounded-full py-3 px-4 hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg "
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