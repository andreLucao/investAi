"use client"
import React, { useState } from 'react';
import { Card, CardContent } from '../components/card';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const InvestmentTimeCalculator = () => {
  const [futureValue, setFutureValue] = useState(5000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(200);
  const [monthlyReturn, setMonthlyReturn] = useState(0.5);
  const [timeNeeded, setTimeNeeded] = useState('');
  const [graphData, setGraphData] = useState([]);

  const calculateTime = () => {
    const r = monthlyReturn / 100;
    const FV = futureValue;
    const P = monthlyInvestment;

    const t = Math.log((FV * r) / P + 1) / Math.log(1 + r);
    setTimeNeeded(t.toFixed(2));

    const newGraphData = [];
    for (let i = 100; i <= 1000; i += 100) {
      const newT = Math.log((FV * r) / i + 1) / Math.log(1 + r);
      newGraphData.push({ investment: i, time: newT.toFixed(2) });
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
            value={monthlyReturn}
            onChange={(e) => setMonthlyReturn(Number(e.target.value))}
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

        {timeNeeded && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="bg-purple-50 dark:bg-slate-700 rounded-md p-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  Tempo Necessário para Atingir o Objetivo:
                </h3>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {timeNeeded} meses
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
                  Variação do Tempo com o Investimento Mensal
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
                      dataKey="investment"
                      label={{ 
                        value: "Investimento Mensal (R$)", 
                        position: "insideBottom", 
                        offset: -5,
                        className: "dark:fill-gray-300"
                      }}
                      className="dark:fill-gray-300"
                    />
                    <YAxis
                      label={{ 
                        value: "Tempo (meses)", 
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
                    />
                    <Legend className="dark:fill-gray-300" />
                    <Line 
                      type="monotone" 
                      dataKey="time" 
                      stroke="#9333ea" 
                      name="Tempo"
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

export default InvestmentTimeCalculator;