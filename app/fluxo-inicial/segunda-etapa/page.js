'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function page2() {
  const router = useRouter();
  const [textInput, setTextInput] = useState('');
  const categoryVector = [50,40,40]

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    router.push('/fluxo-inicial/terceira-etapa');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-8">
          Seus gastos se dividem nessas categorias:
        </h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-black mb-8">Você está gastando em: </h2>
            <ul>
               <li className='text-black mb-8'>Gastos Fixos: <span className='font-bold text-black mb-8'>{categoryVector[1]}% a menos</span> que a média</li>
              <li className='text-blue-700 font-bold mb-8'>Lazer: <span className='font-bold text-black mb-8'>{categoryVector[0]}% a mais</span> <span className='text-black mb-8'>que a média</span></li>  
              <li className='text-red-700 font-bold mb-8'>Dívida: <span className='font-bold text-black mb-8'>{categoryVector[2]}% a mais</span> <span className='text-black mb-8'>que a média</span></li>             
            </ul>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="submit"
              className="w-full bg-purple-900 text-white rounded-md py-2 px-4 hover:bg-purple-500 transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}