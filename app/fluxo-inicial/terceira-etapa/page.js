"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Moon, Sun } from 'lucide-react';
import { Card, CardContent } from '@/app/components/Card';

export default function Page3() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/fluxo-inicial/quarta-etapa');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const categories = [
    { emoji: '💰', name: 'Gastos Fixos', percentage: '55%' },
    { emoji: '⚽', name: 'Lazer', percentage: '15%' },
    { emoji: '💳', name: 'Dívida', percentage: '30%' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      <Card className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vamos separar a sua renda nessa categorias:
            </h1>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Isso vai ajudar você a se organizar melhor!
            </h2>

            <div className="space-y-6">

              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 
                             border border-purple-100 dark:border-purple-800
                             transition-all duration-300 hover:scale-105"
                  >
                    <p className="text-gray-800 dark:text-gray-200 text-lg">
                      <span className="mr-2">{category.emoji}</span>
                      {category.name}:{' '}
                      <strong className="text-purple-600 dark:text-purple-400">
                        {category.percentage}
                      </strong>
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 
                           bg-gradient-to-r from-purple-500 to-purple-600 
                           hover:from-purple-600 hover:to-purple-700 
                           dark:from-purple-600 dark:to-purple-800
                           dark:hover:from-purple-700 dark:hover:to-purple-900
                           text-white rounded-lg py-3 px-4 
                           transition-all duration-300 transform 
                           hover:-translate-y-1 hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Próximo
                </button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
