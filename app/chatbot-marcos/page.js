// app/chatbot-marcos/page.js
"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError(""); // Limpar erros anteriores
    
    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setStreamingContent("");

    try {
      const response = await fetch("/api/chatbot-marcos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar a requisição');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;
        setStreamingContent(accumulatedContent);
      }

      if (accumulatedContent) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: accumulatedContent },
        ]);
      }
      setStreamingContent("");
      
    } catch (error) {
      console.error("Failed to send message:", error);
      setError(error.message || "Erro ao enviar mensagem");
      // Remover a última mensagem do usuário em caso de erro
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
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
          <div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
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
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border rounded"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </main>
  );
}