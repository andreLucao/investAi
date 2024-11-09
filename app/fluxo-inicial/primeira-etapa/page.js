'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function page1() {
  const router = useRouter();
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      router.push('/fluxo-inicial/segunda-etapa');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-8">
          Me manda um audio me respondendo essas perguntas:
        </h1>
        <div className="space-y-6">
          <div>
            <p className="text-lg font-medium text-black">Qual é sua renda media atual?</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Atualmente voce tem dividas?</p>
            <p className="text-sm text-gray-600 mt-1">(se sim, quanto)</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Me fale de onde você é.</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Voce ja apostou ou tem costume de apostar?</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Vc tem filhos?</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-4">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors"
                disabled={!textInput.trim()}
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}