import React, { useState } from 'react';

import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
const FutureValCalc = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(200);
    const [investmentPeriod, setInvestmentPeriod] = useState(12);
    const [monthlyInterestRate = 0.5] = useState(0.5);
    const [futureValue, setFutureValue] = useState(null);
    const [graphData, setGraphData] = useState([]);
  
    const calculateFutureValue = () => {
     
      const r = monthlyInterestRate / 100;
      const fv = monthlyInvestment * 
        ((Math.pow(1 + r, investmentPeriod) - 1) / r) * 
        (1 + r);
      
      setFutureValue(fv.toFixed(2));

      const newGraphData = [];
      for (let i = 1; i <= 60; i += 5){
        const newFv = monthlyInvestment * 
        ((Math.pow(1 + r, i) - 1) / r) * (1 + r);
        newGraphData.push( {periodo: i, valor: newFv.toFixed(2) });
        }
        setGraphData(newGraphData);
    };
  
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Calculadora de Valor Futuro</h2>
        
        <div className="mb-3">
          <label className="block mb-1">Investimento Mensal (R$)</label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-3">
          <label className="block mb-1">Período de Investimento (Meses)</label>
          <input
            type="number"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        
        
        <button
          onClick={calculateFutureValue}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Calcular Valor Futuro
        </button>

        {futureValue && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <h3 className="font-semibold">Valor Futuro:</h3>
          <p className="text-lg">R$ {futureValue}</p>
        </div>
      )}

      {graphData.length > 0 && (
        <div className="mt-4">
            <h3 className="font-bold mb-2"> Variação do Valor Futuro com o tempo</h3>
            <LineChart width={400} height={300} data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" label={{ value: "Período (meses)", position: "insideBottom", offset: -5}} />
                <YAxis label={{ value: "Valor Futuro (R$)", angle: -90, position: "insideLeft"}} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#82ca9d" />


            </LineChart>
        </div>
      )}
    </div>
  );
};

export default FutureValCalc;