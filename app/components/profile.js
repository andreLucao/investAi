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
    // Existing profile fields
    name: '',
    description: '',
    photoUrl: '',
    
    // Financial Information
    occupation: '',
    monthlyIncome: '',
    additionalIncome: '',
    incomeFrequency: 'monthly',
    
    // Fixed Expenses
    rentMortgage: '',
    utilities: '',
    insurance: '',
    carPayment: '',
    
    // Financial Goals
    savingsGoal: '',
    emergencyFundGoal: '',
    debtPayoffGoal: '',
    
    // Debt Information
    creditCardDebt: '',
    studentLoans: '',
    otherDebts: '',
    
    // Budget Preferences
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
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center animate-scale-up">
            <Check className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-6 left-6 z-10">
        <Link href="/">
          <Image className="ml-4" src="/logo-red.png" alt="Logo" width={180} height={40} priority />
        </Link>
      </div>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#9333e9] text-primary-foreground py-6 px-8">
            <h2 className="text-3xl font-bold">Edit Profile</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center">
              <label className="block text-lg font-medium mb-4">
                Profile Photo
              </label>
              <div className="flex flex-col items-center gap-4">
                {profile.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt="Profile preview"
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer bg-[#9333e9] hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full transition-colors duration-200 ease-in-out">
                  Choose File
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
              <h3 className="text-xl font-medium text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={profile.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={profile.occupation}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Enter your occupation"
                  />
                </div>
              </div>
            </div>

            {/* Income Information Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Income Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    id="monthlyIncome"
                    name="monthlyIncome"
                    value={profile.monthlyIncome}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="additionalIncome" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Income
                  </label>
                  <input
                    type="number"
                    id="additionalIncome"
                    name="additionalIncome"
                    value={profile.additionalIncome}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="incomeFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Income Frequency
                  </label>
                  <select
                    id="incomeFrequency"
                    name="incomeFrequency"
                    value={profile.incomeFrequency}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Fixed Expenses Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Fixed Expenses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rentMortgage" className="block text-sm font-medium text-gray-700 mb-1">
                    Rent/Mortgage
                  </label>
                  <input
                    type="number"
                    id="rentMortgage"
                    name="rentMortgage"
                    value={profile.rentMortgage}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="utilities" className="block text-sm font-medium text-gray-700 mb-1">
                    Utilities
                  </label>
                  <input
                    type="number"
                    id="utilities"
                    name="utilities"
                    value={profile.utilities}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Financial Goals Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Financial Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-700 mb-1">
                    Savings Goal
                  </label>
                  <input
                    type="number"
                    id="savingsGoal"
                    name="savingsGoal"
                    value={profile.savingsGoal}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyFundGoal" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Fund Goal
                  </label>
                  <input
                    type="number"
                    id="emergencyFundGoal"
                    name="emergencyFundGoal"
                    value={profile.emergencyFundGoal}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Budget Preferences Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Budget Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budgetingStyle" className="block text-sm font-medium text-gray-700 mb-1">
                    Budgeting Style
                  </label>
                  <select
                    id="budgetingStyle"
                    name="budgetingStyle"
                    value={profile.budgetingStyle}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="savingsPriority" className="block text-sm font-medium text-gray-700 mb-1">
                    Savings Priority
                  </label>
                  <select
                    id="savingsPriority"
                    name="savingsPriority"
                    value={profile.savingsPriority}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#9333e9] text-primary-foreground py-3 px-6 rounded-md hover:bg-primary/90 transition-colors duration-200 ease-in-out text-lg font-medium"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}