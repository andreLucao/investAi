'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

export default function FinancialAssistant() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const suggestions = [
    "Como posso começar a investir com pouco dinheiro?",
    "Quais são as melhores estratégias para sair das dívidas?", 
    "Como criar um plano de aposentadoria eficiente?"
  ];

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError('');

    const newMessage = {
      type: 'user',
      content: message
    };

    try {
      const res = await fetch('/api/financial-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Algo deu errado');
      }

      const assistantMessage = {
        type: 'assistant',
        content: data.response
      };

      setChatHistory(prev => [...prev, newMessage, assistantMessage]);
      setMessage('');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-700">Assistente Investe Aí</h1>
      
      {/* Sugestões */}
      <div className="flex flex-wrap gap-3 mb-6">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 p-4 rounded-lg">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none">
              <p>Digitando...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          placeholder="Digite sua mensagem..."
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? 'Enviando...' : (
            <>
              Enviar
              <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}