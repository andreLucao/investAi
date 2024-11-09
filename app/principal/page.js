'use client'
import { useState } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setIsTyping(true)
      setMessages([...messages, { id: Date.now(), role: 'user', content: input.trim() }])
      setInput('')
      // Simulate response delay
      setTimeout(() => {
        setMessages(msgs => [...msgs, { 
          id: Date.now(), 
          role: 'system', 
          content: 'This is a sample response' 
        }])
        setIsTyping(false)
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      
      <div className="flex-grow mb-4 p-4 border rounded-md overflow-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="text-left">
            <span className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800">
              Typing...
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          className="flex-grow p-2 border rounded-md"
        />
        <button 
          type="submit" 
          disabled={isTyping}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}