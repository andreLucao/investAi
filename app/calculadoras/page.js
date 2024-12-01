"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/card';
import { Button } from '../components/button';
import { Outfit } from 'next/font/google'
import { Calculator, Check } from 'lucide-react';
import InvestmentTimeCalculator from '../components/InvestimentTImeCalculator';
import FutureValCalc from '../components/FutureValCalc';
import MonthInvCalc from '../components/MonthInCalc';
import DividaCalc from '../components/DividaCalc';
import SideBar from '../components/SideBar';

const outfit = Outfit({ subsets: ['latin'] })

const calculators = [
  {
    id: 'investmentTime',
    title: 'Tempo para Atingir o Objetivo',
    component: InvestmentTimeCalculator
  },
  {
    id: 'futureValue',
    title: 'Calculadora de Valor Futuro',
    component: FutureValCalc
  },
  {
    id: 'monthlyInvestment',
    title: 'Investimento Mensal Necessário',
    component: MonthInvCalc
  },
  {
    id: 'debtGrowth',
    title: 'Crescimento de Dívida',
    component: DividaCalc
  }
];

const CalculatorSelector = ({ title, selected, onToggle }) => (
  <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg dark:bg-slate-800" onClick={onToggle}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium dark:text-white">{title}</h3>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          selected ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-slate-200 dark:bg-slate-700'
        }`}>
          {selected && <Check className="w-4 h-4 text-white" />}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function FinancialCalculators() {
  const [expanded, setExpanded] = useState(false);
  const [selectedCalculators, setSelectedCalculators] = useState([]);

  const handleCalculatorToggle = (calculatorId) => {
    setSelectedCalculators(prev =>
      prev.includes(calculatorId)
        ? prev.filter(id => id !== calculatorId)
        : [...prev, calculatorId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 dark:text-white">
      <SideBar expanded={expanded} setExpanded={setExpanded} />
      
      <div className={`transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`${outfit.className} text-4xl md:text-5xl font-bold flex items-center`}>
              <span className="text-gray-500 dark:text-gray-300 mr-4">Calculadoras</span>
              <Calculator className="inline-block w-8 h-8 text-purple-500" />
            </h2>
          </div>

          <Card className="mb-8 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold dark:text-white">
                Escolha as calculadoras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calculators.map(calc => (
                  <CalculatorSelector
                    key={calc.id}
                    title={calc.title}
                    selected={selectedCalculators.includes(calc.id)}
                    onToggle={() => handleCalculatorToggle(calc.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedCalculators.map(calcId => {
              const calculator = calculators.find(c => c.id === calcId);
              const CalcComponent = calculator.component;
              
              return (
                <Card key={calcId} className="dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold dark:text-white">
                      {calculator.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CalcComponent />
                  </CardContent>
                </Card>
              );
            })}
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