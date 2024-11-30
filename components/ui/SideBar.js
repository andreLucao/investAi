"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Bot, Calculator, Target, BookOpen, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Bot, label: 'Assistente IA', path: '/ai-assistant' },
  { icon: Calculator, label: 'Calculadoras', path: '/calculadoras' },
  { icon: Target, label: 'Metas', path: '/metas' },
  { icon: BookOpen, label: 'Educação', path: '/educacao' },
  { icon: Settings, label: 'Configurações', path: '/config' },
];

const Sidebar = ({ expanded, setExpanded }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    let timer;
    if (expanded) {
      timer = setTimeout(() => {
        setShowText(true);
      }, 70);
    } else {
      setShowText(false);
    }
    return () => clearTimeout(timer);
  }, [expanded]);

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 ease-in-out z-50 flex flex-col
      ${expanded ? 'w-64' : 'w-20'}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute -right-3 top-8 bg-purple-600 text-white rounded-full p-1 hover:bg-purple-700 transition-colors"
      >
        {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className="flex items-center p-4 mb-6">
        <h1 
          className={`${outfit.className} text-xl font-bold text-gray-800 dark:text-white
          ${showText ? 'block' : 'hidden'}`}
        >
          Investe a.í
        </h1>
      </div>

      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors
            ${expanded ? 'space-x-4' : 'justify-center'}`}
          >
            <item.icon className={`w-6 h-6 ${expanded ? '' : 'text-purple-600 dark:text-purple-400'}`} />
            {expanded && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;