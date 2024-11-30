'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Upload } from 'lucide-react'

const categories = ['Art', 'Music', 'Writing', 'Photography', 'Video']
const deliveryTimes = ['24 hours', '48 hours', '72 hours', '5 days', '7 days']

export default function Profile() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    deliveryTime: '',
    categories: [],
    photoUrl: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDeliveryTimeSelect = (time) => {
    setProfile(prev => ({
      ...prev,
      deliveryTime: time
    }))
  }

  const handleCategoryToggle = (category) => {
    setProfile(prev => {
      const updatedCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
      return {
        ...prev,
        categories: updatedCategories
      }
    })
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
          <div className="bg-primary text-primary-foreground py-6 px-8">
            <h2 className="text-3xl font-bold">Edit Profile</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
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
                <label className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full transition-colors duration-200 ease-in-out">
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

            <div className="space-y-4">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Time
              </label>
              <div className="flex flex-wrap gap-2">
                {deliveryTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleDeliveryTimeSelect(time)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium
                      ${profile.deliveryTime === time
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      } transition-colors duration-200 ease-in-out`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium
                      ${profile.categories.includes(category)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      } transition-colors duration-200 ease-in-out`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-md hover:bg-primary/90 transition-colors duration-200 ease-in-out text-lg font-medium"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}