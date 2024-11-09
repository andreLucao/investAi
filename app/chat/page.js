'use client'
import { useState, useEffect } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isWidgetReady, setIsWidgetReady] = useState(false)

  useEffect(() => {
    // Carrega o widget
    const loadWidget = async () => {
      try {
        const existingScript = document.getElementById('codeGPTWidgetScript')
        if (existingScript) {
          existingScript.remove()
        }

        const script = document.createElement('script')
        script.id = 'codeGPTWidgetScript'
        script.type = 'module'
        script.async = true
        script.src = 'https://widget.codegpt.co/chat-widget.js'
        script.defer = true
        script.setAttribute('data-widget-id', '6afbb446-f192-4225-8643-c4b6ff4a45a5')

        await new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('Widget script loaded successfully')
            resolve()
          }
          script.onerror = (error) => {
            console.error('Error loading widget script:', error)
            reject(error)
          }
          document.body.appendChild(script)
        })

        let attempts = 0
        while (attempts < 10 && !window.CodeGPTWidget) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          attempts++
        }

        if (window.CodeGPTWidget) {
          setIsWidgetReady(true)
          console.log('Widget initialized successfully')
        } else {
          throw new Error('Widget not initialized after multiple attempts')
        }

      } catch (error) {
        console.error('Failed to initialize widget:', error)
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'system',
          content: 'Failed to initialize chat widget. Please refresh the page.'
        }])
      }
    }

    loadWidget()

    return () => {
      const script = document.getElementById('codeGPTWidgetScript')
      if (script) {
        script.remove()
      }
    }
  }, [])

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || !isWidgetReady) return

    const userMessage = input.trim()
    setInput('')
    setIsTyping(true)

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      content: userMessage
    }])

    try {
      if (window.CodeGPTWidget) {
        const response = await window.CodeGPTWidget.sendMessage(userMessage)
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: response.text
        }])
      } else {
        throw new Error('Widget not available')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'system',
        content: 'Error sending message. Please try again.'
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      
      <div className="flex-grow mb-4 p-4 border rounded-md overflow-auto">
        {!isWidgetReady && messages.length === 0 && (
          <div className="text-center text-gray-500">
            Initializing chat widget...
          </div>
        )}
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
          placeholder={isWidgetReady ? "Type your message here..." : "Waiting for widget to initialize..."}
          disabled={!isWidgetReady || isTyping}
          className="flex-grow p-2 border rounded-md disabled:bg-gray-100"
        />
        <button 
          type="submit" 
          disabled={!isWidgetReady || isTyping || !input.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
