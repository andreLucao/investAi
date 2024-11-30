"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Outfit } from 'next/font/google';
import { Target, Plus, Edit2, Trash2, Save, TrendingUp, CircleDollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SideBar from '@/components/ui/SideBar';

const outfit = Outfit({ subsets: ['latin'] })

const DEFAULT_COLORS = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
  'from-red-500 to-red-600',
];

const EMOJIS = ['🎯', '🎓','🏠', '🎮', '💻',  '🚗', '🛩️', '📚', '💍', '🏖️'];

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <Card className="dark:bg-slate-800 dark:text-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const CommitmentChart = ({ goals }) => {
  const getMonthlyData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((month, index) => ({
      name: month,
      progresso: Math.floor(Math.random() * 40) + 60,
    }));
  };

  const data = getMonthlyData();

  return (
    <Card className="dark:bg-slate-800 mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold dark:text-white ">Comprometimento Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="progresso"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const ProgressBar = ({ progress, color }) => (
  <div className="relative h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
    <div 
      className={`absolute h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default function Goals() {
  const [expanded, setExpanded] = useState(false);
  const [goals, setGoals] = useState([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    emoji: '🎯',
    color: DEFAULT_COLORS[0]
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.currentAmount) {
      return;
    }

    const goalToAdd = {
      ...newGoal,
      id: Date.now(),
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount),
      color: DEFAULT_COLORS[goals.length % DEFAULT_COLORS.length],
    };

    setGoals([...goals, goalToAdd]);
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      emoji: '🎯',
      color: DEFAULT_COLORS[0]
    });
    setIsAddingGoal(false);
  };

  const handleUpdateGoal = (id) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        return {
          ...goal,
          ...editingGoal,
          targetAmount: parseFloat(editingGoal.targetAmount),
          currentAmount: parseFloat(editingGoal.currentAmount)
        };
      }
      return goal;
    });
    setGoals(updatedGoals);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const calculateTotalProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((acc, goal) => {
      return acc + calculateProgress(goal.currentAmount, goal.targetAmount);
    }, 0);
    return Math.round(totalProgress / goals.length);
  };

  const calculateTotalSaved = () => {
    return goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  };

  const calculateTotalTarget = () => {
    return goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 dark:text-white">
      <SideBar expanded={expanded} setExpanded={setExpanded} />
      
      <div className={`transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`${outfit.className} text-4xl md:text-5xl font-bold`}>
              <span className="text-gray-500 dark:text-gray-300 mr-4">Minhas Metas</span>
              <Target className="inline-block w-8 h-8 text-purple-500" />
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Progresso Médio"
              value={`${calculateTotalProgress()}%`}
              icon={TrendingUp}
              color="bg-gradient-to-r from-blue-500 to-blue-600 dark:text-white"
            />
            <StatsCard
              title="Total Economizado"
              value={`R$ ${calculateTotalSaved().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={CircleDollarSign}
              color="bg-gradient-to-r from-green-500 to-green-600 dark:text-white"
            />
            <StatsCard
            title="Meta Total"
            value={`R$ ${calculateTotalTarget().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={Target}
            color="bg-gradient-to-r from-purple-500 to-purple-600 dark:text-white"
            />
          </div>

          {/* Commitment Chart */}
          <CommitmentChart goals={goals} />

          <Button
            onClick={() => setIsAddingGoal(true)}
            className="my-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Meta
          </Button>

          {isAddingGoal && (
            <Card className="mb-6 dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Nova Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <select
                    value={newGoal.emoji}
                    onChange={(e) => setNewGoal({...newGoal, emoji: e.target.value})}
                    className="p-2 rounded-md border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    {EMOJIS.map(emoji => (
                      <option key={emoji} value={emoji}>{emoji}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Nome da meta"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Valor total (R$)"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Valor atual (R$)"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                    className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddGoal} className="bg-green-500 hover:bg-green-600">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={() => setIsAddingGoal(false)} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="dark:bg-slate-800">
                <CardContent className="pt-6">
                  {editingGoal?.id === goal.id ? (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <select
                          value={editingGoal.emoji}
                          onChange={(e) => setEditingGoal({...editingGoal, emoji: e.target.value})}
                          className="p-2 rounded-md border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        >
                          {EMOJIS.map(emoji => (
                            <option key={emoji} value={emoji}>{emoji}</option>
                          ))}
                        </select>
                        <input
                          value={editingGoal.name}
                          onChange={(e) => setEditingGoal({...editingGoal, name: e.target.value})}
                          className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div className="flex gap-4">
                        <input
                          type="number"
                          value={editingGoal.targetAmount}
                          onChange={(e) => setEditingGoal({...editingGoal, targetAmount: e.target.value})}
                          className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                          type="number"
                          value={editingGoal.currentAmount}
                          onChange={(e) => setEditingGoal({...editingGoal, currentAmount: e.target.value})}
                          className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateGoal(goal.id)} className="bg-green-500 hover:bg-green-600">
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button onClick={() => setEditingGoal(null)} variant="outline">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{goal.emoji}</span>
                          <h3 className="text-xl font-semibold dark:text-white">{goal.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingGoal(goal)}
                            className="dark:hover:bg-slate-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteGoal(goal.id)}className="dark:hover:bg-slate-700"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-300">
                              R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / 
                              R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="font-semibold">
                              {calculateProgress(goal.currentAmount, goal.targetAmount)}%
                            </span>
                          </div>
                          <ProgressBar
                            progress={calculateProgress(goal.currentAmount, goal.targetAmount)}
                            color={goal.color}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
  
            <div className="mt-8 flex justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2024 Investe a.í. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }