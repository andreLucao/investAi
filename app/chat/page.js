'use client'
import { useState, useEffect } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Function to handle script loading
    const loadCodeGPTWidget = () => {
      return new Promise((resolve, reject) => {
        try {
          // Check if script already exists
          if (document.getElementById('codeGPTWidgetScript')) {
            resolve()
            return
          }

          const script = document.createElement('script')
          script.id = 'codeGPTWidgetScript'
          script.type = 'module'
          script.async = true
          script.src = 'https://widget.codegpt.co/chat-widget.js'
          script.defer = true
          script.setAttribute('data-widget-id', '6afbb446-f192-4225-8643-c4b6ff4a45a5')
          script.setAttribute('data-api-key', 'e4645c9b-2b6a-4d7e-ba74-02560eb51d2c')
          
          // Initialize CodeGPT configuration
          window.codeGPTConfig = {
            apiKey: 'e4645c9b-2b6a-4d7e-ba74-02560eb51d2c',
            widgetId: '6afbb446-f192-4225-8643-c4b6ff4a45a5',
            // Adding default configuration
            position: 'bottom-right',
            theme: 'light'
          }

          // Handle script load success
          script.onload = () => {
            console.log('CodeGPT Widget script loaded successfully')
            // Initialize the widget with configuration
            if (window.CodeGPTWidget) {
              window.CodeGPTWidget.init(window.codeGPTConfig)
            }
            resolve()
          }

          // Handle script load error
          script.onerror = (error) => {
            console.error('Error loading CodeGPT Widget script:', error)
            reject(error)
          }

          document.body.appendChild(script)
        } catch (error) {
          console.error('Error in script initialization:', error)
          reject(error)
        }
      })
    }

    // Initialize the widget
    loadCodeGPTWidget().catch(error => {
      console.error('Failed to load CodeGPT Widget:', error)
    })

    // Cleanup function
    return () => {
      const existingScript = document.getElementById('codeGPTWidgetScript')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
      // Clean up the global config
      delete window.codeGPTConfig
    }
  }, [])

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setIsTyping(true)
      setMessages([...messages, { id: Date.now(), role: 'user', content: input.trim() }])
      setInput('')
      
      // Use CodeGPT Widget API if available
      if (window.CodeGPTWidget) {
        window.CodeGPTWidget.sendMessage(input.trim())
          .then(response => {
            setMessages(msgs => [...msgs, { 
              id: Date.now(), 
              role: 'system', 
              content: response.text 
            }])
          })
          .catch(error => {
            console.error('Error sending message to CodeGPT:', error)
            setMessages(msgs => [...msgs, { 
              id: Date.now(), 
              role: 'system', 
              content: 'Sorry, there was an error processing your message.' 
            }])
          })
          .finally(() => {
            setIsTyping(false)
          })
      } else {
        // Fallback for when widget is not available
        setTimeout(() => {
          setMessages(msgs => [...msgs, { 
            id: Date.now(), 
            role: 'system', 
            content: 'CodeGPT Widget is not initialized yet.' 
          }])
          setIsTyping(false)
        }, 1000)
      }
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