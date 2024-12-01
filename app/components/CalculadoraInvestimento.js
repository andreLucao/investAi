import React, { useState } from 'react';
import { Card, CardContent } from '../components/Card';

const MonthInvCalc = () => {
    const [futureValue, setFutureValue] = useState(5000);
    const [investmentPeriod, setInvestmentPeriod] = useState(12);
    const [monthlyInterestRate, setMonthlyInterestRate] = useState(0.5);
    const [monthlyInvestment, setMonthlyInvestment] = useState(null);

    const calculateMonthlyInvestment = () => {
        const r = monthlyInterestRate / 100;
        const FV = futureValue;
        const P = FV / (((Math.pow(1 + r, investmentPeriod) - 1) / r) * (1 + r));
        setMonthlyInvestment(P.toFixed(2));
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
            </div>
        </div>
    );
};

export default MonthInvCalc;