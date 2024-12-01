import React, { useState } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const DividaCalc = () => {
    const [dividaInicial, setDividaInicial] = useState(50);
    const [taxaJuros, setTaxaJuros] = useState(30);
    const [periodo, setPeriodo] = useState(9);
    const [graphData, setGraphData] = useState([]);

    const calcularDivida = () => {
        const r = taxaJuros / 100;
        const D0 = dividaInicial;
        const T = periodo;

        const newGraphData = [];
        for (let i = 0; i <= T; i++){
            const valorDivida = D0 * Math.pow(1 + r, i);
            newGraphData.push({ mes: i, divida: valorDivida.toFixed(2) });
        }
        setGraphData(newGraphData);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-x1 font-bold mb-4">Calculadora de Crescimento de Dívida</h2>

            <div className="mb-3">
                <label className="block mb-1">Dívida Inicial (R$):</label>
                <input
                type="number"
                value={dividaInicial}
                onChange={(e) => setDividaInicial(Number(e.target.value))}
                className="w-full p-2 border rounded"
                />
            </div>


            <div className="mb-3">
                <label className="block mb-1">Taxa de Juros Mensal (%):</label>
                <input
                type="number"
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(Number(e.target.value))}
                className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-3">
                <label className="block mb-1">Período (meses):</label>
                <input
                type="number"
                value={periodo}
                onChange={(e) => setPeriodo(Number(e.target.value))}
                className="w-full p-2 border rounded"
                />
            </div>

            <button
            onClick={calcularDivida}
            className="w-full bg-blue-500 text-whire p-2 rounded hover:bg-blue-600 transition"
            >Calcular Crescimento da Dívida</button>

            {graphData.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-bold mb-2">Crescimento da Dívida ao Longo do Tempo</h3>
                    <LineChart width={400} height={300} data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="mes"
                            label={{ value: "Mês", position: "insideBottom", offset: -5}}
                        />
                        <YAxis
                         label={{ value: "Dívida (R$)", angle: -90, position: "insideLeft" }}
                         />
                         <Tooltip />
                         <Legend />
                         <Line type="monotone" dataKey="divida" stroke="#ff7300" />
                    </LineChart>
                </div>
            )}
        </div>
    );


};

export default DividaCalc;