'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
        A <span className="text-primary font-semibold">{'nome da nossa plataforma'}</span> esta pronta para você :)
      </h1>
    </div>
  ) 
}