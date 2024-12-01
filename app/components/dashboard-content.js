'use client'

import { Card, CardHeader, CardTitle, CardContent } from '../components/card';
import { Progress } from "@/components/ui/progress"
import { Button } from '../components/button';
import { BotIcon, TrendingUp, DollarSign, Target } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const ProgressBar = ({ value, color = "#22c55e" }) => (
  <div className="w-full bg-[#d9d9d9] rounded-full h-4">
    <div
      className="h-4 rounded-full transition-all duration-1000 ease-in-out"
      style={{ width: `${value}%`, backgroundColor: color }}
    ></div>
  </div>
);

const metasData = [
  { name: "Economia", current: 5000, target: 10000, color: "#3b82f6", icon: DollarSign },
  { name: "Fitness", current: 45, target: 60, color: "#22c55e", icon: TrendingUp },
  { name: "Aprendizado", current: 7, target: 10, color: "#a855f7", icon: Target },
]

const despesasData = [
  { name: 'Moradia', value: 35, color: '#3b82f6' },
  { name: 'Alimentação', value: 20, color: '#22c55e' },
  { name: 'Transporte', value: 15, color: '#eab308' },
  { name: 'Lazer', value: 10, color: '#f97316' },
  { name: 'Outros', value: 10, color: '#a855f7' },
]

function PieChart({ data }) {
  const [activeSegment, setActiveSegment] = useState(null)
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)', width: '250px', height: '250px' }}>
        {data.map((item, i) => {
          const startAngle = currentAngle
          const angle = (item.value / total) * 360
          const endAngle = startAngle + angle
          const largeArc = angle > 180 ? 1 : 0
          
          const startRad = (startAngle * Math.PI) / 180
          const endRad = (endAngle * Math.PI) / 180
          
          const x1 = Math.cos(startRad)
          const y1 = Math.sin(startRad)
          const x2 = Math.cos(endRad)
          const y2 = Math.sin(endRad)
          
          const pathData = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArc} 1 ${x2} ${y2} Z`
          
          currentAngle += angle
          
          return (
            <path
              key={item.name}
              d={pathData}
              fill={item.color}
              stroke="white"
              strokeWidth="0.01"
              onMouseEnter={() => setActiveSegment(i)}
              onMouseLeave={() => setActiveSegment(null)}
              style={{ transition: 'transform 0.2s', transform: activeSegment === i ? 'scale(1.05)' : 'scale(1)', transformOrigin: 'center' }}
            />
          )
        })}
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        {activeSegment !== null ? (
          <>
            <div className="font-semibold text-white bg-[#d9d9d9] bg-opacity-50 rounded-lg">{data[activeSegment].name}</div>
            <div className="text-sm text-gray-600">{data[activeSegment].value}%</div>
          </>
        ) : (
          <div className="font-semibold text-white bg-[#d9d9d9] bg-opacity-50 rounded-lg text-right">Total</div>
        )}
      </div>
    </div>
  )
}

export default function DashboardContent() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Painel de Controle</h1>
      
      {/* barra de progresso adicional */}
      <div className="mb-8">
        <h1>Viagem para Europa ✈️</h1>
        <ProgressBar value={75} color="#22c55e" />
      </div>
      
      {/* Visão Geral das Metas */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {metasData.map((meta) => (
          <Card key={meta.name}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg bg-opacity-20`} style={{ backgroundColor: `${meta.color}33` }}>
                    <meta.icon className="w-6 h-6" style={{ color: meta.color }} />
                  </div>
                  <h3 className="font-semibold">{meta.name}</h3>
                </div>
                <span className="text-sm font-medium">
                  {Math.round((meta.current / meta.target) * 100)}%
                </span>
              </div>
              <ProgressBar 
                value={(meta.current / meta.target) * 100}
                color={meta.color}
              />
              <div className="mt-2 text-sm text-gray-600">
                {meta.current} / {meta.target} {meta.name === "Economia" ? "R$" : "unidades"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Divisão de Despesas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Divisão de Despesas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between">
          <PieChart data={despesasData} />
          <div className="space-y-4 w-full md:w-1/2 mt-6 md:mt-0">
            {despesasData.map((despesa) => (
              <div key={despesa.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: despesa.color }} />
                    <span className="text-sm font-medium">{despesa.name}</span>
                  </div>
                  <span className="text-sm font-medium">{despesa.value}%</span>
                </div>
                <ProgressBar
                  value={despesa.value}
                  color={despesa.color}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Botão de Chat Flutuante */}
      <Link href="/chat-perguntas" passHref>
        <Button
          className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-blue-500 hover:bg-blue-600"
          aria-label="Abrir Chat"
        >
          <BotIcon className="w-8 h-8 text-white" />
        </Button>
      </Link>
    </div>
  )
}