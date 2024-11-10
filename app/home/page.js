'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Outfit } from 'next/font/google'
import { Mic, Brain, UniversalAccess, TrendingUp, ChevronRight, Star, VolumeUp, Eye, FileText, X } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
const outfit = Outfit({ subsets: ['latin'] })

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-gray-100 ${inter.className}`}>
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${outfit.className}`}>Investe a.í</h1>
          <button className="px-4 py-2 hover:bg-gray-100 rounded-md">Login</button>
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
                Aposte no seu futuro! <br />Se livre das dividas e alcance seus sonhos.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="/fluxo-inicial/primeira-etapa">
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-lg">
                    Comece Agora
                  </button>
                </Link>
                <button 
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-md text-lg"
                >
                  Saiba Mais
                </button>
              </div>
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
                  <source src="/demo.mov" type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Modal */}
        {showModal && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowModal(false)}
            />
            
            {/* Modal Content */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-[600px] w-full mx-4">
                  {/* Close button */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                  
                  {/* Modal header */}
                  <div className="p-6 pb-0">
                    <h3 className={`text-2xl font-semibold ${outfit.className}`}>
                      Sobre o Investe a.í
                    </h3>
                  </div>
                  
                  {/* Modal body */}
                  <div className="p-6 space-y-4">
                    <p className="text-gray-600">
                      O Investe a.í é uma plataforma inovadora que combina inteligência artificial com acessibilidade para ajudar você a tomar melhores decisões financeiras.
                    </p>
                    
                    <h4 className="font-semibold text-lg mt-4">Nossos Diferenciais:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Análise personalizada baseada no seu perfil</li>
                      <li>Interface acessível com suporte a voz</li>
                      <li>Recomendações adaptadas aos seus objetivos</li>
                      <li>Acompanhamento contínuo do seu progresso</li>
                    </ul>
                    
                    <p className="text-gray-600">
                      Nossa missão é democratizar o acesso à educação financeira e ajudar mais pessoas a alcançarem seus objetivos financeiros.
                    </p>
                  </div>
                  
                  {/* Modal footer */}
                  <div className="p-6 pt-0">
                    <button
                      className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                      onClick={() => setShowModal(false)}
                    >
                      Entendi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className={`${outfit.className} text-3xl font-bold text-center mb-12`}>Nossos Recursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="text-purple-600" size={32} />
                </div>
                <h3 className={`${outfit.className} text-xl font-semibold mb-2 text-center`}>Análise Personalizada</h3>
                <p className="text-gray-600 text-center">IA avançada para entender suas necessidades financeiras únicas.</p>
              </div>
              <div className="bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <Eye className="text-purple-600" size={32} />
                </div>
                <h3 className={`${outfit.className} text-xl font-semibold mb-2 text-center`}>Acessibilidade Total</h3>
                <p className="text-gray-600 text-center">Ferramentas inclusivas para todos os usuários, independente das habilidades.</p>
              </div>
              <div className="bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="text-purple-600" size={32} />
                </div>
                <h3 className={`${outfit.className} text-xl font-semibold mb-2 text-center`}>Decisões Inteligentes</h3>
                <p className="text-gray-600 text-center">Insights baseados em dados para otimizar seus investimentos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className={`${outfit.className} text-3xl font-bold text-center mb-12`}>Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md relative p-6">
              <div className="absolute top-4 left-4 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex items-center justify-center mb-4 mt-8">
                <Mic className="text-purple-600" size={24} />
              </div>
              <h3 className={`${outfit.className} text-xl font-semibold mb-2 text-center`}>Compartilhe seus Objetivos</h3>
              <p className="text-gray-600 text-center">Use voz ou texto para nos contar sobre suas metas financeiras.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md relative p-6">
              <div className="absolute top-4 left-4 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex items-center justify-center mb-4 mt-8">
                <Brain className="text-purple-600" size={24} />
              </div>
              <h3 className={`${outfit.className} text-xl font-semibold mb-2 text-center`}>Análise de IA</h3>
              <p className="text-gray-600 text-center">Nossa IA processa suas informações para criar um plano personalizado.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md relative p-6">
              <div className="absolute top-4 left-4 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex items-center justify-center mb-4 mt-8">
                <FileText className="text-purple-600" size={24} />
              </div>
              <h3 className={`${outfit.className} text-xl font-semibold mb-2 text-center`}>Receba Recomendações</h3>
              <p className="text-gray-600 text-center">Ouça ou leia conselhos detalhados adaptados ao seu perfil.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-purple-900 to-purple-400 rounded-lg shadow-xl p-8 md:p-12 text-center">
            <h2 className={`${outfit.className} text-3xl md:text-4xl font-bold text-white mb-6`}>
              Pronto para investir melhor?
            </h2>
            <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-lg">
              Começar Gratuitamente
            </button>
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