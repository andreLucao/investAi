"use client";

import Profile from "../components/profile";
import SideBar from "../components/SideBar";
import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [expanded, setExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gray-900', 'text-gray-100');

    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-gray-100');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900', 'text-gray-100');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex h-screen relative ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <SideBar expanded={expanded} setExpanded={setExpanded} />
      
      <div className="absolute top-6 right-20 z-10 sm:right-24 md:right-28 lg:right-32">
        <button 
          onClick={toggleDarkMode}
          className={`
            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
            rounded-full
            transition
            flex
            items-center
            justify-center
            shadow-md
            active:scale-95
            ${darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-500' 
              : 'bg-white hover:bg-gray-100 text-purple-600'}
          `}
          aria-label={darkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          {darkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />}
        </button>
      </div>

      <div className="absolute top-6 right-4 z-10 sm:right-8 md:right-12 lg:right-16">
        <button
          onClick={() => router.push("/dashboard")}
          className={`
            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
            bg-purple-600 text-white
            rounded-full
            hover:bg-purple-700
            transition
            flex
            items-center
            justify-center
            shadow-md
            active:scale-95
          `}
          aria-label="Voltar para o dashboard"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
        </button>
      </div>
      
      <div className={`flex-1 p-4 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <Profile />
      </div>
    </div>
  );
}