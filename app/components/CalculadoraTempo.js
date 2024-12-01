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