'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Outfit } from 'next/font/google'
import { Mic, Brain, UniversalAccess, TrendingUp, ChevronRight, Star, VolumeUp, Eye, FileText, X, Check } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
const outfit = Outfit({ subsets: ['latin'] })

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)

  const pricingPlans = [
    {
      name: 'Gratuito',
      price: '0',
      description: 'Perfeito para começar sua jornada financeira',
      features: [
        'Análise básica de perfil',
        'Recomendações gerais',
        'Acesso a conteúdo educacional',
        'Suporte por email'
      ],
      buttonText: 'Começar Grátis',
      highlighted: false
    },
    {
      name: 'Premium',
      price: '29,90',
      description: 'Para quem quer acelerar seus investimentos',
      features: [
        'Análise avançada de perfil',
        'Recomendações personalizadas',
        'Acesso a todos os conteúdos',
        'Suporte prioritário 24/7',
        'Consultas com especialistas',
        'Ferramentas avançadas de planejamento'
      ],
      buttonText: 'Assinar Premium',
      highlighted: true
    },
    {
      name: 'Empresarial',
      price: '4,90',
      description: 'Ideal para que seus funcionarios tenham organização financeira.',
      priceSubtext: 'por colaborador',
      features: [
        'Tudo do Premium',
        'Múltiplos usuários',
        'Dashboard personalizado',
        'Relatórios avançados',
        'API de integração',
        'Gerente de conta dedicado'
      ],
      buttonText: 'Falar com Vendas',
      highlighted: false
    }
  ]

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
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowModal(false)}
            />
            
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-[600px] w-full mx-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                  
                  <div className="p-6 pb-0">
                    <h3 className={`text-2xl font-semibold ${outfit.className}`}>
                      Sobre o Investe a.í
                    </h3>
                  </div>
                  
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

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className={`${outfit.className} text-3xl font-bold text-center mb-4`}>Planos e Preços</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades financeiras e comece sua jornada rumo à independência financeira.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-purple-50 to-white border-2 border-purple-500 shadow-xl transform hover:-translate-y-1'
                    : 'bg-white border border-gray-200 shadow-md hover:shadow-lg'
                }`}
              >
                <h3 className={`${outfit.className} text-xl font-bold mb-2`}>{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">R$</span>
                  <span className="text-4xl font-bold mx-1">{plan.price}</span>
                  {plan.price !== '0' && (
                    <span className="text-gray-600">
                      {plan.priceSubtext ? `/${plan.priceSubtext}` : '/mês'}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <Link href="https://calendly.com/marcos-prismma/30min">
                <button
                  className={`w-full py-3 px-4 rounded-md font-semibold mb-6 transition-colors ${
                    plan.highlighted
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </button></Link>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-purple-900 to-purple-400 rounded-lg shadow-xl p-8 md:p-12 text-center">
<h2 className={`${outfit.className} text-3xl md:text-4xl font-bold text-white mb-6`}>
              Pronto para investir no seu futuro?
            </h2>
            <p className="text-white text-xl mb-8">
              Comece hoje mesmo sua jornada para a independência financeira
            </p>
            <Link href="/fluxo-inicial/primeira-etapa">
              <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-lg font-semibold transition-colors">
                Começar Gratuitamente
              </button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className={`${outfit.className} text-lg font-bold mb-4`}>Investe a.í</h3>
              <p className="text-gray-400">
                Transformando o futuro financeiro através da tecnologia e acessibilidade.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guias</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Ferramentas</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Newsletter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Sobre</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Carreiras</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Parcerias</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Termos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Segurança</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Investe a.í. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}