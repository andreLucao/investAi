import React, { useState } from 'react';
import InvestmentTimeCalculator from './InvestimentTImeCalculator';
import FutureValCalc from './FutureValCalc';
import MonthInvCalc from './MonthInCalc';
import DividaCalc from './DividaCalc';
import Card from './card';

const App = () => {
    const [selectedCalculators, setSelectedCalculators] = useState([]);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedCalculators(prevState => 
            checked ? [...prevState, value] : prevState.filter(item => item !== value)
        );
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen p-8 font-sans">
            <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105">
                <h1 className="text-5xl font-extrabold mb-8 text-center text-blue-600 shadow-lg p-4 rounded-lg">
                    Calculadoras Financeiras
                </h1>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 tracking-wider">
                        Escolha as calculadoras:
                    </h2>

              
                    <div className="grid grid-cols-2 gap-4 justify-center">
                        <label className="flex items-center space-x-2 cursor-pointer text-lg">
                            <input 
                                type="checkbox" 
                                value="investmentTime" 
                                checked={selectedCalculators.includes('investmentTime')}
                                onChange={handleCheckboxChange}
                                className="form-checkbox h-6 w-6 text-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:ring-2 hover:ring-blue-400"
                            />
                            <span className="text-lg font-medium text-gray-700 hover:text-blue-600 transition duration-300">Tempo para Atingir o Objetivo</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer text-lg">
                            <input 
                                type="checkbox" 
                                value="futureValue" 
                                checked={selectedCalculators.includes('futureValue')}
                                onChange={handleCheckboxChange}
                                className="form-checkbox h-6 w-6 text-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:ring-2 hover:ring-blue-400"
                            />
                            <span className="text-lg font-medium text-gray-700 hover:text-blue-600 transition duration-300">Calculadora de Valor Futuro</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer text-lg">
                            <input 
                                type="checkbox" 
                                value="monthlyInvestment" 
                                checked={selectedCalculators.includes('monthlyInvestment')}
                                onChange={handleCheckboxChange}
                                className="form-checkbox h-6 w-6 text-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:ring-2 hover:ring-blue-400"
                            />
                            <span className="text-lg font-medium text-gray-700 hover:text-blue-600 transition duration-300">Investimento Mensal Necessário</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer text-lg">
                            <input 
                                type="checkbox" 
                                value="debtGrowth" 
                                checked={selectedCalculators.includes('debtGrowth')}
                                onChange={handleCheckboxChange}
                                className="form-checkbox h-6 w-6 text-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:ring-2 hover:ring-blue-400"
                            />
                            <span className="text-lg font-medium text-gray-700 hover:text-blue-600 transition duration-300">Crescimento de Dívida</span>
                        </label>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedCalculators.includes('investmentTime') && (
                        <Card title="Tempo para Atingir o Objetivo">
                            <InvestmentTimeCalculator />
                        </Card>
                    )}
                    {selectedCalculators.includes('futureValue') && (
                        <Card title="Calculadora de Valor Futuro">
                            <FutureValCalc />
                        </Card>
                    )}
                    {selectedCalculators.includes('monthlyInvestment') && (
                        <Card title="Investimento Mensal Necessário">
                            <MonthInvCalc />
                        </Card>
                    )}
                    {selectedCalculators.includes('debtGrowth') && (
                        <Card title="Crescimento de Dívida">
                            <DividaCalc />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
