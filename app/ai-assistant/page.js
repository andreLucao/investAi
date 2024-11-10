"use client";

import { useState, useRef, useEffect } from "react";
import { CodeGPTPlus } from 'judini';

export default function ChatPage() {
  const [messages, setMessages] = useState([{
    role: "system",
    content: "Você é um assistente financeiro chamado 'Investe a.í' especializado em educação financeira e investimentos. Sua missão é ajudar as pessoas a tomarem melhores decisões financeiras através de uma linguagem simples e direta, mas sempre mantendo o rigor técnico.\n\nComportamento:\n- Seja amigável mas profissional\n- Use uma linguagem simples e acessível\n- Faça perguntas para entender melhor o contexto do usuário\n- Dê exemplos práticos quando possível\n- Sempre destaque os riscos envolvidos\n- Evite dar dicas muito específicas de investimentos\n- Incentive boas práticas financeiras\n\nÁreas de conhecimento:\n- Educação financeira básica\n- Planejamento financeiro\n- Controle de gastos e orçamento\n- Investimentos (renda fixa e variável)\n- Aposentadoria e previdência\n- Proteção financeira\n- Impostos e tributação"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  
  const codegpt = new CodeGPTPlus({ 
    apiKey: process.env.NEXT_PUBLIC_CODEGPT_API_KEY 
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleStreamChunk = (chunk) => {
    // Just return the chunk as is, without any parsing
    console.log('Raw chunk:', chunk);
    return chunk;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError("");
    
    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setStreamingContent("");

    let fullResponse = '';

    try {
      // Create headers for fetch request
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CODEGPT_API_KEY}`
      };

      // Create request body
      const body = {
        messages: [...messages, userMessage],
        agentId: process.env.NEXT_PUBLIC_CODEGPT_AGENT_ID,
        stream: true
      };

      // Make fetch request directly instead of using SDK
      const response = await fetch('https://api.codegpt.co/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      // Create reader for streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and log it
        const chunk = decoder.decode(value);
        console.log('Received chunk:', chunk);
        
        // Split the chunk by newlines to handle multiple events
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.includes('[DONE]')) continue;
          
          // Remove 'data: ' prefix if it exists
          const data = line.replace(/^data: /, '').trim();
          console.log('Processed data:', data);
          
          if (data) {
            fullResponse += data + '\n';
            setStreamingContent(fullResponse);
          }
        }
      }

      if (fullResponse) {
        setMessages((prev) => [
          ...prev,
          { 
            role: "assistant", 
            content: fullResponse
          },
        ]);
      }
      setStreamingContent("");
      
    } catch (error) {
      console.error("Failed to send message:", error);
      setError(error.message || "Erro ao enviar mensagem");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-gray-50">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-blue-600">Investe a.í - Seu Assistente Financeiro</h1>
        <p className="text-gray-600">Tire suas dúvidas sobre finanças e investimentos</p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 bg-white p-4 rounded-lg shadow">
        {messages.slice(1).map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 ml-auto max-w-[80%]"
                : "bg-gray-100 max-w-[80%]"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        {streamingContent && (
          <div className="bg-gray-100 p-4 rounded-lg max-w-[80%] font-mono text-sm">
            <p className="whitespace-pre-wrap">{streamingContent}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida sobre finanças..."
            className="flex-1 p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </main>
  );
}