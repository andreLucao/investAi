'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send} from 'lucide-react'

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
              <li className='text-black mb-8'>💰 Gastos Fixos: <span className='font-bold text-black mb-8'>{categoryVector[0]}%</span> a menos que a média</li>
              <li className='text-black mb-8'>⚽ Lazer: <span className='font-bold text-black mb-8'>{categoryVector[1]}%</span> a menos que a média</li>  
              <li className='text-black mb-8'>💳 Dívida: <span className='font-bold text-black mb-8'>{categoryVector[1]}%</span> a menos que a média</li>              
            </ul>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white rounded-md py-2 px-4 hover:bg-purple-500 transition-colors"
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