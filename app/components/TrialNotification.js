import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TrialNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={`
        fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 
        flex items-center gap-4 
        bg-white dark:bg-slate-800 
        rounded-lg shadow-lg p-4 pr-12 
        border border-slate-200 dark:border-slate-700 
        transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0 mb-8' : 'translate-y-full'}
      `}
    >
      <div className="text-sm text-slate-700 dark:text-slate-200">
        Seu <span className="font-semibold">período de teste</span> encerrará em <span className="font-semibold">14 dias</span>. Contrate um plano.
      </div>
      
      <button className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-semibold transition-colors">
        Falar conosco
      </button>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TrialNotification;