'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function page4() {
  const router = useRouter();
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove the text input check since we're not using it
    router.push('/fluxo-inicial/quinta-etapa');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-8">
          Me manda um audio me respondendo essas perguntas:
        </h1>
        <div className="space-y-6">
          <div>
            <p className="text-lg font-medium text-black">O que você acha de criar a meta com base nos seus objetivos?</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Exemplos mais escolhidos:</p>
            
          </div>
          <div>
            <p className="text-lg font-medium text-black">Dinheiro para uma casa</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Casamento</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Viagem</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors"
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