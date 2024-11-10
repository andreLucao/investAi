'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Outfit } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'] })
export default function LoadingPage() {
  const router = useRouter()
  
//shogo
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/dashboard' // Changed to use client-side navigation
    }, 5000)

    return () => clearTimeout(timer)
  }, [])  // Removed router from dependencies since we're using window.location

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-16 h-16 relative animate-spin mb-8">
        <div className="absolute w-full h-full border-4 border-primary rounded-full border-t-transparent" />
      </div>
      <h1 className="text-xl md:text-2xl text-center font-medium">
        A<span className={`${outfit.className} text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-900 to-purple-400 text-transparent bg-clip-text mr-4 ml-4`}>
            Investe a.í
          </span>esta pronta para você :)
      </h1>
    </div>
  ) 
}