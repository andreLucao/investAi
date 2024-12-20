"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/button';
import { Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Outfit } from 'next/font/google'
import EmergencyFundCard from '../components/EmergencyFundCard';
import SideBar from '../components/SideBar';
import { Sun, Moon } from 'lucide-react';
import TrialNotification from '../components/TrialNotification';

const outfit = Outfit({ subsets: ['latin'] })

const DASHBOARD_DATA = {
  goals: [
    { name: 'Viagem', progress: 75, color: 'from-blue-500 to-blue-600', goal: '20.000', now: '15.000', emoji: '🛬' },
    { name: 'Carro', progress: 60, color: 'from-purple-500 to-purple-600', goal: '50.000', now: '30.000', emoji: '🚗' },
    { name: 'Casa', progress: 45, color: 'from-pink-500 to-pink-600', goal: '100.000', now: '45.000', emoji: '🏠' },
  ],
  finances: [
    { name: 'Despesas', value: 1050, emoji: '💰', p: 70 },
    { name: 'Dívidas', value: 300, emoji: '💳', p: 20 },
    { name: 'Investimento', value: 150, emoji: '📈', p: 10 },
  ],
  colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
};

const calculatePieSlices = (data) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  return data.map((item) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;
    
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const radius = 80;
    
    const x1 = radius * Math.cos(startRad);
    const y1 = radius * Math.sin(startRad);
    const x2 = radius * Math.cos(endRad);
    const y2 = radius * Math.sin(endRad);
    
    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
  });
};

const ProgressBar = ({ progress, color }) => (
  <div className="relative h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
    <div 
      className={`absolute h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
      style={{ width: `${progress}%` }}
    />
  </div>
);

const PieChart = ({ data, hoveredSlice, setHoveredSlice }) => {
  const pieSlices = calculatePieSlices(data);
  
  return (
    <div className="h-[300px] flex justify-center items-center relative">
      <svg width="200" height="200" viewBox="-100 -100 200 200">
        {pieSlices.map((path, index) => (
          <g key={index}>
            <path
              d={path}
              fill={DASHBOARD_DATA.colors[index]}
              stroke="white"
              strokeWidth="2"
              className="transition-transform duration-200 ease-in-out"
              style={{
                transform: hoveredSlice === index ? 'scale(1.05)' : 'scale(1)',
                filter: hoveredSlice === index ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' : 'none'
              }}
              onMouseEnter={() => setHoveredSlice(index)}
              onMouseLeave={() => setHoveredSlice(null)}
            />
          </g>
        ))}
      </svg>
      {hoveredSlice !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-xl">{data[hoveredSlice].emoji}</span>
          <span className="font-medium dark:text-white">{(data[hoveredSlice].name)}</span>
          <span className="dark:text-white">{data[hoveredSlice].p}%</span>
        </div>
      )}
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-[425px] w-full mx-4 relative p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Investir vs Apostar</h2>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Investir 📈</h3>
            <ul className="list-disc list-inside text-green-600 dark:text-green-400 space-y-2">
              <li>Crescimento consistente ao longo do tempo</li>
              <li>Risco calculado e gerenciável</li>
              <li>Baseado em análise e estratégia</li>
              <li>Construção de patrimônio a longo prazo</li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
            <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Apostar 🎲</h3>
            <ul className="list-disc list-inside text-red-600 dark:text-red-400 space-y-2">
              <li>Alta volatilidade e risco de perda total</li>
              <li>Baseado em sorte e chance</li>
              <li>Sem controle sobre o resultado</li>
              <li>Possibilidade de comportamento compulsivo</li>
            </ul>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [progress, setProgress] = useState(DASHBOARD_DATA.goals.map(() => 0));
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const total = DASHBOARD_DATA.finances.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(DASHBOARD_DATA.goals.map(item => item.progress));
      setShowBreakdown(true);
    }, 500);

    if (typeof window !== 'undefined') {
      const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(darkModePreference);
    }

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 dark:text-white">
      <SideBar expanded={expanded} setExpanded={setExpanded} />
      <TrialNotification />
      <div className={`transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${outfit.className} text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 text-transparent bg-clip-text`}>
              <span className="text-4xl md:text-5xl font-bold text-gray-500 dark:text-gray-300 mr-4">Dashboard</span> 
              Investe a.í
            </h2>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="col-span-2 dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Progresso das Metas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {DASHBOARD_DATA.goals.map((item, index) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                      <span className="text-slate-700 dark:text-slate-200 font-semibold">
                        {item.emoji} R$ {item.now}/ R$ {item.goal} ({progress[index]}%)
                      </span>
                    </div>
                    <ProgressBar progress={progress[index]} color={item.color} />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Divisão das finanças</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={DASHBOARD_DATA.finances} 
                  hoveredSlice={hoveredSlice} 
                  setHoveredSlice={setHoveredSlice}
                />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {DASHBOARD_DATA.finances.map((item, index) => (
                    <div 
                      key={item.name}
                      className="flex items-center space-x-2 transition-colors duration-200"
                      onMouseEnter={() => setHoveredSlice(index)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: DASHBOARD_DATA.colors[index]}}
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {item.emoji} {item.name} ({((item.value / total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <EmergencyFundCard />

            <Card className="dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Detalhe da Divisão</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6">
                  {DASHBOARD_DATA.finances.map((item, index) => (
                    <li 
                      key={item.name} 
                      className="space-y-2"
                      onMouseEnter={() => setHoveredSlice(index)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="h-4 w-4 rounded-full" 
                            style={{ backgroundColor: DASHBOARD_DATA.colors[index] }}
                          />
                          <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.emoji} R$ {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="relative h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div 
                          className="absolute h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            backgroundColor: DASHBOARD_DATA.colors[index],
                            width: showBreakdown ? `${(item.value / total) * 100}%` : '0%',
                            opacity: hoveredSlice === index ? 1 : 0.8
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex justify-center">
                  <Button 
                    variant="default"
                    size="lg"
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium px-8 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 m-10"
                  >
                    Veja a diferença entre investir e apostar!
                  </Button>
                </div>

                <Modal 
                  isOpen={isModalOpen} 
                  onClose={() => setIsModalOpen(false)} 
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-6 dark:text-white">Investir vs Apostar</h2>
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Investir 📈</h3>
                        <ul className="list-disc list-inside text-green-600 dark:text-green-400 space-y-2">
                          <li>Crescimento consistente ao longo do tempo</li>
                          <li>Risco calculado e gerenciável</li>
                          <li>Baseado em análise e estratégia</li>
                          <li>Construção de patrimônio a longo prazo</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Apostar 🎲</h3>
                        <ul className="list-disc list-inside text-red-600 dark:text-red-400 space-y-2">
                          <li>Alta volatilidade e risco de perda total</li>
                          <li>Baseado em sorte e chance</li>
                          <li>Sem controle sobre o resultado</li>
                          <li>Possibilidade de comportamento compulsivo</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Modal>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2024 Investe a.í. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={() => router.push('/ai-assistant')}
        className="fixed bottom-8 right-8 flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Bot className="h-5 w-5" />
        <span>AI Assistant</span>
      </Button>
    </div>
  );
}