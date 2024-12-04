import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const InvestmentTimeCalculator = () => {
  const [futureValue, setFutureValue] = useState(5000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(200);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState(0.5);
  const [timeNeeded, setTimeNeeded] = useState(null);

  const calculateTime = () => {
    const r = monthlyInterestRate / 100;
    const FV = futureValue;
    const P = monthlyInvestment;
    
    const t = Math.log((FV * r) / P + 1) / Math.log(1 + r);
    const roundedTime = Math.round(t);
    setTimeNeeded(roundedTime);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium dark:text-white">
            Valor Futuro Desejado (R$)
          </label>
          <input
            type="number"
            value={futureValue}
            onChange={(e) => setFutureValue(Number(e.target.value))}
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium dark:text-white">
            Investimento Mensal (R$)
          </label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium dark:text-white">
            Taxa de Juros Mensal (%)
          </label>
          <input
            type="number"
            value={monthlyInterestRate}
            onChange={(e) => setMonthlyInterestRate(Number(e.target.value))}
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            step="0.1"
          />
        </div>

        <button
          onClick={calculateTime}
          className="w-full p-2 rounded-md text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
        >
          Calcular Tempo Necessário
        </button>

        {timeNeeded !== null && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="bg-purple-50 dark:bg-slate-700 rounded-md p-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  Tempo Necessário para Atingir o Objetivo:
                </h3>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {parseInt(timeNeeded)} {parseInt(timeNeeded) === 1 ? 'mês' : 'meses'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default function CalculationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Calculadoras</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InvestmentTimeCalculator />
      </div>
    </div>
  );
}