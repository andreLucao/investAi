"use client"
import React from 'react'
import { useState } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const MonthInvCalc = () => {
    const [futureValue, setFutureValue] = useState(5000);
    const [investmentPeriod, setInvestmentPeriod] = useState(12);
    const [monthlyInterestRate = 0.5] = useState(0.5);
    const [monthlyInvestment, setMonthlyInvestment] = useState(null);
    const [graphData, setGraphData] = useState([]);

    const calculateMonthlyInvestment = () => {
        const r = monthlyInterestRate / 100;
        const FV = futureValue;

        const P = FV / (((Math.pow(1+ r, investmentPeriod) - 1) / r) * (1 + r))

        setMonthlyInvestment(P.toFixed(2));

        const newGraphData = [];
        for (let i = 1; i <= 60; i += 5){
            const P_temp = FV / (((Math.pow(1 + r, i) - 1) / r) * (1 + r));
            newGraphData.push({periodo: i, investimento: P_temp.toFixed(2)});
        }
        setGraphData(newGraphData);
    };

    return (
        <div className = "p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Calculadora de Investimento Mensal</h2>

            <div className="mb-3">
                <label className="block mb-1">Valor Futuro Desejado (R$):</label>
                <input
                type="number"
                value={futureValue}
                onChange={(e) => setFutureValue(Number(e.target.value))}
                className="w-full p-2 border rounded"
                />
            </div>

            <div className = "mb-3">
                <label className="block mb-1">Período de Investimento (Meses):</label>
                <input
                type="number"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                className="w-full p-2 border rounded"
                />
            </div>

            <button
            onClick={calculateMonthlyInvestment}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
                Calcular Investimento Mensal
            </button>

            {monthlyInvestment && (
                <div className="mt-4 p-3 bg-green-50 rounded">
                    <h3 className="font-semibold">Investimento Mensal:</h3>
                    <p className="text-lg">R$ {monthlyInvestment}</p>
                </div>
            )}

            {graphData.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-bold mb-2">Variação do Investimento Mensal</h3>
                    <LineChart width={400} height={300} data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="periodo"
                            label={{ value: "Período (meses)", position: "insideBottom", offset: -5}}
                        />
                        <YAxis
                            label={{ value: "Investimento Mensal (R$)", angle: -90, position: "insideLeft"}}
                        />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="investimento" stroke="#8884d8"/>
                    </LineChart>
                </div>
            )} 



        </div>
    );
};

export default MonthInvCalc;