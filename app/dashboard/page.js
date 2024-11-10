"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Outfit } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'] })

// Move data to a separate constant object for better organization
const DASHBOARD_DATA = {
  goals: [
    { name: 'Viagem', progress: 75, color: 'from-blue-500 to-blue-600',goal:'20.000',now:'15.000',emoji: '🛬'},
    { name: 'Carro', progress: 60, color: 'from-purple-500 to-purple-600',goal:'50.000',now:'30.000',emoji:'🚗'},
    { name: 'Casa', progress: 45, color: 'from-pink-500 to-pink-600', goal:'100.000',now:'45.000',emoji:'🏠'},
  ],
  finances: [
    { name: 'Despesas', value: 1050, emoji: '💰',p:70 },
    { name: 'Dívidas', value: 300, emoji: '💳',p:20 },
    { name: 'Investimento', value: 150, emoji: '📈',p:10 },
  ],
  colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
};

// Separate the pie chart calculation logic
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

// Separate components for better organization
const ProgressBar = ({ progress, color }) => (
  <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden">
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
            {hoveredSlice === index && (
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dy="-20"
                className="text-2xl select-none pointer-events-none"
              >
                
              </text>
            )}
          </g>
        ))}
      </svg>
      {hoveredSlice !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-xl">{data[hoveredSlice].emoji}</span>
          <span className="font-medium">{(data[hoveredSlice].name)}</span>
          <span>{data[hoveredSlice].p}%</span>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [progress, setProgress] = useState(DASHBOARD_DATA.goals.map(() => 0));
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const total = DASHBOARD_DATA.finances.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(DASHBOARD_DATA.goals.map(item => item.progress));
      setShowBreakdown(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className={`${outfit.className} text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-teal-500 text-transparent bg-clip-text`}>
          <span className="text-4xl md:text-5xl font-bold text-gray-500 mr-4">Dashboard</span> 
          Investe a.í
        </h2> 
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Progresso das Metas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {DASHBOARD_DATA.goals.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">{item.name}</span>
                    <span className="text-slate-700 font-semibold">{item.emoji} R$ {item.now}/ R$ {item.goal} ({progress[index]}%)</span>
                  </div>
                  <ProgressBar progress={progress[index]} color={item.color} />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Divisão das finanças</CardTitle>
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
                    <span className="text-sm font-medium text-slate-700">
                      {item.emoji} {item.name} ({((item.value / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhe da Divisão</CardTitle>
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
                        <span className="text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {item.emoji} R$ {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
                      </span>
                      </div>
                    <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="absolute h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          backgroundColor: DASHBOARD_DATA.colors[index],
                          width: showBreakdown ? `${(item.value / total) * 100}%` : '0%',
                          opacity: hoveredSlice === index ? 1 : 0.8
                        }}
                      />
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-blue-700 group-hover:bg-blue-500 flex justify-content">
                        Detalhes
                      </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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