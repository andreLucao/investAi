"use client"
import { useState, useEffect } from 'react';
import { MapPin, DollarSign, Navigation, Check, Moon, Sun, CreditCard, Wallet, Coins, Receipt } from 'lucide-react';
import { Card, CardContent } from '@/app/components/Card';
import Link from 'next/link';

const SelectionButton = ({ selected, onClick, children, icon: Icon, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full p-4 rounded-lg border flex items-center gap-3 transition-all duration-300
      ${selected 
        ? 'bg-purple-100 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-200' 
        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/50'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      dark:bg-gray-800 dark:text-gray-200
    `}
  >
    <Icon className={selected ? 'text-purple-600 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'} />
    {children}
  </button>
);

const MoneyInput = ({ value, onChange, icon: Icon, placeholder }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
      <Icon className="text-gray-500 dark:text-gray-400" size={20} />
    </div>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                transition-all duration-300"
    />
  </div>
);

export default function FirstStage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedIncome, setSelectedIncome] = useState('');
  const [hasDebts, setHasDebts] = useState('');
  const [hasEmergencyFund, setHasEmergencyFund] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const countries = [
    { id: 'brazil', name: 'Brasil', icon: '🇧🇷' },
    { id: 'mexico', name: 'México', icon: '🇲🇽' },
    { id: 'colombia', name: 'Colômbia', icon: '🇨🇴' },
    { id: 'chile', name: 'Chile', icon: '🇨🇱' }
  ];
  
  const regions = {
    brazil: [
      { id: 'norte', name: 'Norte' },
      { id: 'nordeste', name: 'Nordeste' },
      { id: 'sudeste', name: 'Sudeste' },
      { id: 'sul', name: 'Sul' },
      { id: 'centro-oeste', name: 'Centro-Oeste' }
    ],
    mexico: [
      { id: 'norte', name: 'Norte' },
      { id: 'sur', name: 'Sur' },
      { id: 'este', name: 'Este' },
      { id: 'oeste', name: 'Oeste' },
      { id: 'centro', name: 'Centro' }
    ],
    colombia: [
      { id: 'andina', name: 'Región Andina' },
      { id: 'caribe', name: 'Región Caribe' },
      { id: 'pacifica', name: 'Región Pacífica' },
      { id: 'orinoquia', name: 'Región Orinoquía' },
      { id: 'amazonia', name: 'Región Amazonía' }
    ],
    chile: [
      { id: 'norte-grande', name: 'Norte Grande' },
      { id: 'norte-chico', name: 'Norte Chico' },
      { id: 'zona-central', name: 'Zona Central' },
      { id: 'zona-sur', name: 'Zona Sur' },
      { id: 'zona-austral', name: 'Zona Austral' }
    ]
  };

  const incomeRanges = [
    { id: 'low', name: '1-2 salários mínimos' },
    { id: 'medium', name: '3-4 salários mínimos' },
    { id: 'high', name: '+4 salários mínimos' }
  ];

  const yesNoOptions = [
    { id: 'yes', name: 'Sim' },
    { id: 'no', name: 'Não' }
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const ConfirmButton = ({ onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-3 bg-gradient-to-r from-purple-500 to-purple-600 
        hover:from-purple-600 hover:to-purple-700 text-white rounded-lg
        flex items-center justify-center gap-2 transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        dark:from-purple-600 dark:to-purple-800
        dark:hover:from-purple-700 dark:hover:to-purple-900
      `}
    >
      <Check size={20} />
      Confirmar Seleção
    </button>
  );

  const steps = [
    {
      title: 'Selecione seu país',
      content: (
        <div className="space-y-3">
          {countries.map((country) => (
            <SelectionButton
              key={country.id}
              selected={selectedCountry === country.id}
              onClick={() => setSelectedCountry(country.id)}
              icon={MapPin}
            >
              <span className="mr-2">{country.icon}</span>
              {country.name}
            </SelectionButton>
          ))}
          <ConfirmButton 
            onClick={handleNext}
            disabled={!selectedCountry}
          />
        </div>
      )
    },
    {
      title: 'Selecione sua região',
      content: selectedCountry && (
        <div className="space-y-3">
          {regions[selectedCountry].map((region) => (
            <SelectionButton
              key={region.id}
              selected={selectedRegion === region.id}
              onClick={() => setSelectedRegion(region.id)}
              icon={Navigation}
            >
              {region.name}
            </SelectionButton>
          ))}
          <ConfirmButton 
            onClick={handleNext}
            disabled={!selectedRegion}
          />
        </div>
      )
    },
    {
      title: 'Selecione sua renda',
      content: (
        <div className="space-y-3">
          {incomeRanges.map((range) => (
            <SelectionButton
              key={range.id}
              selected={selectedIncome === range.id}
              onClick={() => setSelectedIncome(range.id)}
              icon={DollarSign}
            >
              {range.name}
            </SelectionButton>
          ))}
          <ConfirmButton 
            onClick={handleNext}
            disabled={!selectedIncome}
          />
        </div>
      )
    },
    {
      title: 'Você tem dívidas?',
      content: (
        <div className="space-y-3">
          {yesNoOptions.map((option) => (
            <SelectionButton
              key={option.id}
              selected={hasDebts === option.id}
              onClick={() => setHasDebts(option.id)}
              icon={CreditCard}
            >
              {option.name}
            </SelectionButton>
          ))}
          <ConfirmButton 
            onClick={handleNext}
            disabled={!hasDebts}
          />
        </div>
      )
    },
    {
      title: 'Você já possui uma reserva de emergência?',
      content: (
        <div className="space-y-3">
          {yesNoOptions.map((option) => (
            <SelectionButton
              key={option.id}
              selected={hasEmergencyFund === option.id}
              onClick={() => setHasEmergencyFund(option.id)}
              icon={Wallet}
            >
              {option.name}
            </SelectionButton>
          ))}
          <ConfirmButton 
            onClick={handleNext}
            disabled={!hasEmergencyFund}
          />
        </div>
      )
    },
    {
      title: 'Quanto você ganha por mês?',
      content: (
        <div className="space-y-3">
          <MoneyInput
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            icon={Coins}
            placeholder="Digite sua renda mensal"
          />
          <ConfirmButton 
            onClick={handleNext}
            disabled={!monthlyIncome}
          />
        </div>
      )
    },
    {
      title: 'Qual seu gasto mensal?',
      content: (
        <div className="space-y-3">
          <MoneyInput
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
            icon={Receipt}
            placeholder="Digite seus gastos mensais"
          />
          {monthlyExpenses && (
            <Link href='/fluxo-inicial/segunda-etapa' className="block">
              <ConfirmButton 
                onClick={() => console.log({ 
                  selectedCountry, 
                  selectedRegion, 
                  selectedIncome, 
                  hasDebts,
                  hasEmergencyFund,
                  monthlyIncome,
                  monthlyExpenses
                })}
                disabled={!monthlyExpenses}
              />
            </Link>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      <Card className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {steps[currentStep].title}
              </h2>
              <div className="mt-4 flex justify-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-12 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              {steps[currentStep].content}
            </div>

            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="w-full mt-4 p-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 
                         dark:hover:text-purple-300 transition-colors duration-300"
              >
                Voltar
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}