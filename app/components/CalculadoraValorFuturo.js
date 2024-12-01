import React, { useState } from 'react';
import { Card, CardContent } from './Card';

const FutureValCalc = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(200);
  const [investmentPeriod, setInvestmentPeriod] = useState(12);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState(0.5);
  const [futureValue, setFutureValue] = useState(null);

  const calculateFutureValue = () => {
    const r = monthlyInterestRate / 100;
    const fv = monthlyInvestment * 
      ((Math.pow(1 + r, investmentPeriod) - 1) / r) * 
      (1 + r);
    
    setFutureValue(fv.toFixed(2));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
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
            Período de Investimento (Meses)
          </label>
          <input
            type="number"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
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
          onClick={calculateFutureValue}
          className="w-full p-2 rounded-md text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
        >
          Calcular Valor Futuro
        </button>

        {futureValue && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="bg-purple-50 dark:bg-slate-700 rounded-md p-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  Valor Futuro:
                </h3>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  R$ {futureValue}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FutureValCalc;