import React, { useState } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const InvestmentTimeCalculator = () => {
  const [valorFuturo, setValorFuturo] = useState(5000);
  const [investimentoMensal, setInvestimentoMensal] = useState(200);
  const [rentabilidade, setRentabilidade] = useState(0.5); // Corrigido para permitir edição
  const [tempo, setTempo] = useState('');
  const [graphData, setGraphData] = useState([]);

  const calcularTempo = () => {
    const r = rentabilidade / 100;
    const FV = valorFuturo;
    const P = investimentoMensal;

    const t = Math.log((FV * r) / P + 1) / Math.log(1 + r);
    setTempo(t.toFixed(2));

    const newGraphData = [];
    for (let i = 100; i <= 1000; i += 100) {
      const newT = Math.log((FV * r) / i + 1) / Math.log(1 + r);
      newGraphData.push({ investimento: i, tempo: newT.toFixed(2) });
    }
    setGraphData(newGraphData);
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

      <div className="mb-3">
        <label className="block mb-1">Qual é a rentabilidade mensal (%):</label>
        <input
          type="number"
          value={rentabilidade}
          onChange={(e) => setRentabilidade(Number(e.target.value))}
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

      {graphData.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Variação do Tempo com o Investimento Mensal</h3>
          <LineChart width={400} height={300} data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="investimento"
              label={{ value: 'Investimento Mensal', position: 'insideBottom', offset: -5 }}
            />
            <YAxis label={{ value: 'Tempo (meses)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tempo" stroke="#8884d8" />
          </LineChart>
        </div>
      )}
    </div>
  );
};

export default InvestmentTimeCalculator;
