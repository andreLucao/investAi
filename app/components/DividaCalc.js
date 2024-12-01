import React, { useState } from 'react';
import { Card, CardContent } from '../components/Card';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const DividaCalc = () => {
    const [initialDebt, setInitialDebt] = useState(50);
    const [interestRate, setInterestRate] = useState(30);
    const [period, setPeriod] = useState(9);
    const [graphData, setGraphData] = useState([]);

    const calculateDebtGrowth = () => {
        const r = interestRate / 100;
        const D0 = initialDebt;
        const T = period;

        const newGraphData = [];
        for (let i = 0; i <= T; i++) {
            const debtValue = D0 * Math.pow(1 + r, i);
            newGraphData.push({ month: i, debt: debtValue.toFixed(2) });
        }
        setGraphData(newGraphData);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-white">
                        Dívida Inicial (R$)
                    </label>
                    <input
                        type="number"
                        value={initialDebt}
                        onChange={(e) => setInitialDebt(Number(e.target.value))}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-white">
                        Taxa de Juros Mensal (%)
                    </label>
                    <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        step="0.1"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-white">
                        Período (meses)
                    </label>
                    <input
                        type="number"
                        value={period}
                        onChange={(e) => setPeriod(Number(e.target.value))}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <button
                    onClick={calculateDebtGrowth}
                    className="w-full p-2 rounded-md text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
                >
                    Calcular Crescimento da Dívida
                </button>

                {graphData.length > 0 && (
                    <Card className="mt-4">
                        <CardContent className="p-4">
                            <div className="bg-purple-50 dark:bg-slate-700 rounded-md p-4">
                                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4">
                                    Crescimento da Dívida ao Longo do Tempo
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
                                            dataKey="month"
                                            label={{ 
                                                value: "Mês", 
                                                position: "insideBottom", 
                                                offset: -5,
                                                className: "dark:fill-gray-300"
                                            }}
                                            className="dark:fill-gray-300"
                                        />
                                        <YAxis
                                            label={{ 
                                                value: "Dívida (R$)", 
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
                                            dataKey="debt" 
                                            stroke="#9333ea" 
                                            name="Dívida"
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

export default DividaCalc;