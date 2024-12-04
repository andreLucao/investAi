"use client"
import React, { useState } from 'react';
import { Card, CardContent } from '../components/Card';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const MonthInvCalc = () => {
  const [futureValue, setFutureValue] = useState(5000);
  const [investmentPeriod, setInvestmentPeriod] = useState(12);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState(0.5);
  const [monthlyInvestment, setMonthlyInvestment] = useState(null);
  const [graphData, setGraphData] = useState([]);

  const calculateMonthlyInvestment = () => {
    const r = monthlyInterestRate / 100;
    const FV = futureValue;
    const P = FV / (((Math.pow(1 + r, investmentPeriod) - 1) / r) * (1 + r));
    setMonthlyInvestment(P.toFixed(2));

    // Calculate graph data for different future values
    const newGraphData = [];
    const baseValue = futureValue * 0.5;
    for (let i = 0; i <= 5; i++) {
      const targetValue = baseValue + (baseValue * i * 0.5);
      const monthlyInv = targetValue / (((Math.pow(1 + r, investmentPeriod) - 1) / r) * (1 + r));
      newGraphData.push({
        targetValue: targetValue.toFixed(0),
        investment: monthlyInv.toFixed(2)
      });
    }
    setGraphData(newGraphData);
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
          onClick={calculateMonthlyInvestment}
          className="w-full p-2 rounded-md text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
        >
          Calcular Investimento Mensal
        </button>

        {monthlyInvestment && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="bg-purple-50 dark:bg-slate-700 rounded-md p-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  Investimento Mensal Necessário:
                </h3>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  R$ {monthlyInvestment}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {graphData.length > 0 && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="bg-purple-50 dark:bg-slate-700 rounded-md p-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4">
                  Investimento Mensal para Diferentes Valores Alvo
                </h3>
                <div className="overflow-x-auto">
                  <LineChart 
                    width={400} 
                    height={300} 
                    data={graphData}
                    className="mx-auto"
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      className="dark:stroke-gray-600"
                    />
                    <XAxis
                      dataKey="targetValue"
                      label={{ 
                        value: "Valor Alvo (R$)", 
                        position: "insideBottom", 
                        offset: -5,
                        className: "dark:fill-gray-300"
                      }}
                      className="dark:fill-gray-300"
                    />
                    <YAxis
                      label={{ 
                        value: "Investimento Mensal (R$)", 
                        angle: -90, 
                        position: "insideLeft",
                        className: "dark:fill-gray-300"
                      }}
                      className="dark:fill-gray-300"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #purple-500'
                      }}
                      formatter={(value) => [`R$ ${value}`, "Investimento Mensal"]}
                    />
                    <Legend className="dark:fill-gray-300" />
                    <Line 
                      type="monotone" 
                      dataKey="investment" 
                      stroke="#9333ea" 
                      name="Investimento Mensal"
                    />
                  </LineChart>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MonthInvCalc;