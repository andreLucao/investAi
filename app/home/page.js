'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Outfit } from 'next/font/google'
import { Mic, Brain, UniversalAccess, TrendingUp, ChevronRight, Star, VolumeUp, Eye, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
const outfit = Outfit({ subsets: ['latin'] })

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-gray-100 ${inter.className}`}>
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${outfit.className}`}>Investe a.í</h1>
          <Button variant="ghost">Login</Button>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className={`${outfit.className} text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-teal-500 text-transparent bg-clip-text`}>
                Investe a.í
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-6">
                Decisões financeiras personalizadas com IA
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <Link href="/fluxo-inicial">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Comece Agora
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-purple-600 border-purple-600">
                  Saiba Mais
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center" aria-label="Ativar entrada de voz">
                <Mic className="mr-2" size={18} />
                Entrada de Voz
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg w-full aspect-video">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the component remains the same... */}
        {/* Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className={`${outfit.className} text-3xl font-bold text-center mb-12`}>Nossos Recursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Brain className="text-purple-600" size={32} />}
                title="Análise Personalizada"
                description="IA avançada para entender suas necessidades financeiras únicas."
              />
              <FeatureCard
                icon={<Eye className="text-purple-600" size={32} />}
                title="Acessibilidade Total"
                description="Ferramentas inclusivas para todos os usuários, independente das habilidades."
              />
              <FeatureCard
                icon={<TrendingUp className="text-purple-600" size={32} />}
                title="Decisões Inteligentes"
                description="Insights baseados em dados para otimizar seus investimentos."
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className={`${outfit.className} text-3xl font-bold text-center mb-12`}>Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              icon={<Mic className="text-purple-600" size={24} />}
              title="Compartilhe seus Objetivos"
              description="Use voz ou texto para nos contar sobre suas metas financeiras."
            />
            <StepCard
              number={2}
              icon={<Brain className="text-purple-600" size={24} />}
              title="Análise de IA"
              description="Nossa IA processa suas informações para criar um plano personalizado."
            />
            <StepCard
              number={3}
              icon={<FileText className="text-purple-600" size={24} />}
              title="Receba Recomendações"
              description="Ouça ou leia conselhos detalhados adaptados ao seu perfil."
            />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className={`${outfit.className} text-3xl font-bold text-center mb-12`}>O que Nossos Clientes Dizem</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                avatar="/placeholder.svg?height=60&width=60"
                name="Ana Silva"
                rating={5}
                review="A Investe a.í revolucionou minha abordagem financeira. As recomendações são incrivelmente precisas!"
              />
              <TestimonialCard
                avatar="/placeholder.svg?height=60&width=60"
                name="Carlos Mendes"
                rating={4}
                review="Como usuário com deficiência visual, aprecio muito a acessibilidade da plataforma. Finalmente posso gerenciar meus investimentos de forma independente."
              />
              <TestimonialCard
                avatar="/placeholder.svg?height=60&width=60"
                name="Juliana Costa"
                rating={5}
                review="A facilidade de uso e os insights personalizados me ajudaram a atingir meus objetivos financeiros mais rápido do que eu imaginava."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-purple-900 to-purple-400 rounded-lg shadow-xl p-8 md:p-12 text-center">
            <h2 className={`${outfit.className} text-3xl md:text-4xl font-bold text-white mb-6`}>
              Pronto para investir melhor?
            </h2>
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
              Começar Gratuitamente
            </Button>
            <div className="flex justify-center mt-6 space-x-4">
              <AccessibilityFeature icon={<Mic size={18} />} text="Entrada de Voz" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Investe a.í. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className={`${outfit.className} text-xl font-semibold mb-2 text-center`}>{title}</h3>
        <p className="text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, icon, title, description }) {
  return (
    <Card className="relative">
      <CardContent className="p-6">
        <div className="absolute top-4 left-4 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
          {number}
        </div>
        <div className="flex items-center justify-center mb-4 mt-8">
          {icon}
        </div>
        <h3 className={`${outfit.className} text-xl font-semibold mb-2 text-center`}>{title}</h3>
        <p className="text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ avatar, name, rating, review }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4" />
          <div>
            <h3 className={`${outfit.className} font-semibold`}>{name}</h3>
            <div className="flex">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="text-amber-500" size={16} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-600">{review}</p>
      </CardContent>
    </Card>
  )
}

function AccessibilityFeature({ icon, text }) {
  return (
    <div className="flex items-center text-white">
      {icon}
      <span className="ml-2 text-sm">{text}</span>
    </div>
  )
}