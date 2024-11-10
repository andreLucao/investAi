"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';

const progressData = [
  { name: 'Development', progress: 75, color: 'from-blue-500 to-blue-600' },
  { name: 'Design', progress: 60, color: 'from-purple-500 to-purple-600' },
  { name: 'Testing', progress: 45, color: 'from-pink-500 to-pink-600' },
];

const data = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 200 },
  { name: 'Category D', value: 100 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

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
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  });
};

export default function Dashboard() {
  const router = useRouter();
  const [progress, setProgress] = useState(progressData.map(() => 0));
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const pieSlices = calculatePieSlices(data);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progressData.map(item => item.progress));
      setShowBreakdown(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChatbotClick = () => {
    router.push('/ai-assistant');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Project Dashboard</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {progressData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">{item.name}</span>
                    <span className="text-slate-700 font-semibold">{progress[index]}%</span>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`absolute h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${progress[index]}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center items-center">
                <svg width="200" height="200" viewBox="-100 -100 200 200">
                  {pieSlices.map((path, index) => (
                    <path
                      key={index}
                      d={path}
                      fill={COLORS[index]}
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
                  ))}
                </svg>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {data.map((item, index) => (
                  <div 
                    key={item.name}
                    className="flex items-center space-x-2 transition-colors duration-200"
                    onMouseEnter={() => setHoveredSlice(index)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Breakdown Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-6">
                {data.map((item, index) => (
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
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="absolute h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          backgroundColor: COLORS[index],
                          width: showBreakdown ? `${(item.value / total) * 100}%` : '0%',
                          opacity: hoveredSlice === index ? 1 : 0.8
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="fixed bottom-8 right-8">
        <Button 
          onClick={handleChatbotClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Bot className="h-5 w-5" />
          <span>AI Assistant</span>
        </Button>
      </div>
    </div>
  );
}