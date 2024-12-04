"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { GraduationCap, BookOpen, Lock, Sun, Moon } from 'lucide-react';
import { Outfit } from 'next/font/google';
import SideBar from '../components/SideBar';

const outfit = Outfit({ subsets: ['latin'] })

const modules = [
  {
    title: "Fundamentos Básicos",
    topics: ["Educação financeira", "Necessidades vs. desejos", "Orçamento pessoal", "Reserva de emergência"],
    color: "from-blue-500 to-blue-600",
    unlocked: true
  },
  {
    title: "Controle de Gastos",
    topics: ["Acompanhamento de despesas", "Corte de gastos", "Planejamento de compras"],
    color: "from-purple-500 to-purple-600",
    unlocked: true
  },
  {
    title: "Gestão de Dívidas",
    topics: ["Tipos de dívidas", "Priorização de pagamentos", "Negociação com credores"],
    color: "from-pink-500 to-pink-600",
    unlocked: false
  },
  {
    title: "Investimentos",
    topics: ["Poupar vs. investir", "Tipos de investimentos", "Diversificação"],
    color: "from-green-500 to-green-600",
    unlocked: false
  }
];

const ModuleCard = ({ title, topics, color, unlocked }) => (
  <Card className="relative dark:bg-slate-800 hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold dark:text-white">{title}</h3>
        {!unlocked && <Lock className="w-5 h-5 text-slate-400" />}
      </div>
      <div className="space-y-3">
        {topics.map((topic, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color}`} />
            <span className="text-slate-600 dark:text-slate-300">{topic}</span>
          </div>
        ))}
      </div>
      {unlocked ? (
        <div className={`mt-6 py-2 px-4 text-center text-white rounded-md bg-gradient-to-r ${color} cursor-pointer hover:opacity-90`}>
          Começar
        </div>
      ) : (
        <div className="mt-6 py-2 px-4 text-center text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400 rounded-md">
          Em breve
        </div>
      )}
    </CardContent>
  </Card>
);

export default function Education() {
  const [expanded, setExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <SideBar expanded={expanded} setExpanded={setExpanded} />
      
      <div className={`transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`${outfit.className} text-4xl md:text-5xl font-bold flex items-center`}>
              <span className="text-gray-500 dark:text-gray-300 mr-4">Educação Financeira</span>
              <GraduationCap className="inline-block w-8 h-8 text-purple-500" />
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-yellow-500" />
                ) : (
                  <Moon className="w-6 h-6 text-slate-700" />
                )}
              </button>
              <div className="flex items-center gap-2 text-purple-500">
                <BookOpen className="w-6 h-6" />
                <span className="font-medium">2/4 módulos completos</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module, index) => (
              <ModuleCard key={index} {...module} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2024 Investe a.í. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}