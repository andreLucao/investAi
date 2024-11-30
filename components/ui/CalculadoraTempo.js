import React, { useState } from 'react';



const InvestmentTimeCalculator = () => {
  const [valorFuturo, setValorFuturo] = useState(5000);
  const [investimentoMensal, setInvestimentoMensal] = useState(200);
  const [rentabilidade = 5] = useState(0.5);
  const [tempo, setTempo] = useState('');

  const calcularTempo = () => {
    const r = rentabilidade / 100;
    const FV = valorFuturo;
    const P = investimentoMensal;
    
    const t = Math.log((FV * r) / P + 1) / Math.log(1 + r);
    setTempo(t.toFixed(2));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Calculadora de Tempo para Atingir o Objetivo</h2>
      
      <div className="mb-3">
        <label className="block mb-1">Quanto você quer ter no futuro?</label>
        <input
          type="number"
          value={valorFuturo}
          onChange={(e) => setValorFuturo(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-3">
        <label className="block mb-1">Quanto você pode investir por mês?</label>
        <input
          type="number"
          value={investimentoMensal}
          onChange={(e) => setInvestimentoMensal(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      
      
      
      <button 
        onClick={calcularTempo}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Calcular Tempo
      </button>
      
      {tempo && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <h3 className="font-semibold">Tempo para atingir o seu objetivo:</h3>
          <p className="text-lg">{tempo} meses</p>
        </div>
      )}
    </div>
  );
};

/*const FutureValueCalculator = () => {
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
};*/
  




/*const MonthInvCalc = () => {
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
};*/

export default function CalculationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Calculadoras</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InvestmentTimeCalculator />
        <FutureValCalc />
        <MonthInvCalc />
      </div>
    </div>
  );
}