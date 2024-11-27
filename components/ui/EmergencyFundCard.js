import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert } from 'lucide-react';

const EmergencyFundCard = () => {
  const targetAmount = 18000;
  const currentAmount = 9000;
  const percentage = (currentAmount / targetAmount) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-yellow-500" />
          <CardTitle>Reserva de Emergência</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 font-medium">Meta: 6 meses de despesas</span>
          <span className="text-slate-700 font-semibold">
            🛡️ R$ {currentAmount.toLocaleString()} / R$ {targetAmount.toLocaleString()}
          </span>
        </div>
        
        <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div 
            className="absolute h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center pt-4">
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-yellow-700 font-semibold">{percentage.toFixed(0)}%</p>
            <p className="text-sm text-yellow-600">Progresso</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-yellow-700 font-semibold">R$ {(targetAmount - currentAmount).toLocaleString()}</p>
            <p className="text-sm text-yellow-600">Faltante</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-yellow-700 font-semibold">3</p>
            <p className="text-sm text-yellow-600">Meses cobertos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyFundCard;