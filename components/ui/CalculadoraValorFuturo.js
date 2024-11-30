import React, { useState } from 'react';
const FutureValueCalculator = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(200);
    const [investmentPeriod, setInvestmentPeriod] = useState(12);
    const [monthlyInterestRate = 0.5] = useState(0.5);
    const [futureValue, setFutureValue] = useState(null);
  
    const calculateFutureValue = () => {
     
      const r = monthlyInterestRate / 100;
      const fv = monthlyInvestment * 
        ((Math.pow(1 + r, investmentPeriod) - 1) / r) * 
        (1 + r);
      
      setFutureValue(fv.toFixed(2));
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
    </div>
  );
};