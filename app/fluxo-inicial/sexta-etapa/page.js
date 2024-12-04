"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Outfit } from 'next/font/google';
import { Moon, Sun } from 'lucide-react';

const outfit = Outfit({ subsets: ['latin'] });

export default function LoadingPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/dashboard';
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">
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

      <div className="w-16 h-16 relative animate-spin mb-8">
        <div className="absolute w-full h-full border-4 border-gray-300 dark:border-gray-600 rounded-full border-t-purple-500 dark:border-t-white transition-colors duration-300" />
      </div>

      <h1 className="text-xl md:text-2xl text-center font-medium text-gray-800 dark:text-gray-200">
        <span className={`${outfit.className} text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-900 to-purple-400 dark:from-purple-400 dark:to-purple-200 text-transparent bg-clip-text mr-4 ml-4`}>
          Investe a.í
        </span>
        esta pronta para você! 🫵😁
      </h1>
    </div>
  );
}