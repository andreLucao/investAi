'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Upload } from 'lucide-react'

const deliveryTimes = ['24 hours', '48 hours', '72 hours', '5 days', '7 days']

export default function Profile() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    photoUrl: '',
    occupation: '',
    monthlyIncome: '',
    additionalIncome: '',
    incomeFrequency: 'monthly',
    rentMortgage: '',
    utilities: '',
    insurance: '',
    carPayment: '',
    savingsGoal: '',
    emergencyFundGoal: '',
    debtPayoffGoal: '',
    creditCardDebt: '',
    studentLoans: '',
    otherDebts: '',
    budgetingStyle: 'moderate',
    savingsPriority: 'medium'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          photoUrl: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      router.push('/search')
    }, 1000)
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center dark:bg-gray-900 bg-white">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center animate-scale-up">
            <Check className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-6 left-6 z-10">
        <Link href="/">
          <Image className="ml-4" src="/logo-red.png" alt="Logo" width={180} height={40} priority />
        </Link>
      </div>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#9333e9] text-primary-foreground py-6 px-8">
            <h2 className="text-3xl font-bold">Editar Perfil</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center">
              <label className="block text-lg font-medium mb-4 dark:text-white">
                Foto de Perfil
              </label>
              <div className="flex flex-col items-center gap-4">
                {profile.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt="Profile preview"
                    width={128}
                    height={128}
                    className="rounded-full object-cover w-32 h-32"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-300" />
                  </div>
                )}
                <label className="cursor-pointer bg-[#9333e9] hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full transition-colors duration-200 ease-in-out">
                  Escolha o arquivo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Informação Básica</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Digite seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={profile.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Conte mais sobre você"
                  />
                </div>

                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profissão
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={profile.occupation}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Digite sua profissão"
                  />
                </div>
              </div>
            </div>

            {/* Income Information Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Informações de Renda</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Renda Mensal
                  </label>
                  <input
                    type="number"
                    id="monthlyIncome"
                    name="monthlyIncome"
                    value={profile.monthlyIncome}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="additionalIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Renda Adicional
                  </label>
                  <input
                    type="number"
                    id="additionalIncome"
                    name="additionalIncome"
                    value={profile.additionalIncome}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="incomeFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frequência de Renda
                  </label>
                  <select
                    id="incomeFrequency"
                    name="incomeFrequency"
                    value={profile.incomeFrequency}
                    onChange={handleInputChange}
                    className="w-full p-3 text-gray-500 dark:text-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quinzenal</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Fixed Expenses Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Despesas Fixas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rentMortgage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Aluguel/Empréstimo Hipotecário
                  </label>
                  <input
                    type="number"
                    id="rentMortgage"
                    name="rentMortgage"
                    value={profile.rentMortgage}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="utilities" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Despesas
                  </label>
                  <input
                    type="number"
                    id="utilities"
                    name="utilities"
                    value={profile.utilities}
                    onChange={handleInputChange}
                    className="w-full p-3 text-gray-500 dark:text-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Financial Goals Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Objetivos Financeiros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meta de Poupança
                  </label>
                  <input
                    type="number"
                    id="savingsGoal"
                    name="savingsGoal"
                    value={profile.savingsGoal}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 dark:text-white p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyFundGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meta de Fundo de Emergência
                  </label>
                  <input
                    type="number"
                    id="emergencyFundGoal"
                    name="emergencyFundGoal"
                    value={profile.emergencyFundGoal}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 dark:text-white p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Budget Preferences Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Preferências de Orçamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budgetingStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estilo de Orçamento
                  </label>
                  <select
                    id="budgetingStyle"
                    name="budgetingStyle"
                    value={profile.budgetingStyle}
                    onChange={handleInputChange}
                    className="w-full p-3 text-gray-500 dark:text-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="conservative">Conservador</option>
                    <option value="moderate">Moderado</option>
                    <option value="aggressive">Agressivo</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="savingsPriority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prioridade de Poupança
                  </label>
                  <select
                    id="savingsPriority"
                    name="savingsPriority"
                    value={profile.savingsPriority}
                    onChange={handleInputChange}
                    className="w-full p-3 text-gray-500 dark:text-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="low">Baixo</option>
                    <option value="medium">Médio</option>
                    <option value="high">Alto</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#9333e9] text-primary-foreground py-3 px-6 rounded-md hover:bg-purple-600 transition-colors duration-200 ease-in-out text-lg font-medium shadow-lg"
            >
              Salvar Mudanças
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}