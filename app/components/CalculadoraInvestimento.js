import React, { useState } from 'react';
const MonthInvCalc = () => {
    const [futureValue, setFutureValue] = useState(5000);
    const [investmentPeriod, setInvestmentPeriod] = useState(12);
    const [monthlyInterestRate = 0.5] = useState(0.5);
    const [monthlyInvestment, setMonthlyInvestment] = useState(null);

    const calculateMonthlyInvestment = () => {
        const r = monthlyInterestRate / 100;
        const FV = futureValue;

        const P = FV / (((Math.pow(1+ r, investmentPeriod) - 1) / r) * (1 + r))

        setMonthlyInvestment(P.toFixed(2));
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
    


        </div>
    );
};