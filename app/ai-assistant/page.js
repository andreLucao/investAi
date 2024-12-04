'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SideBar from '../components/SideBar';

export default function FinancialAssistant() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const suggestions = [
    "Como posso começar a investir com pouco dinheiro?",
    "Quais são as melhores estratégias para sair das dívidas?",
    "Como criar um plano de aposentadoria eficiente?"
  ];

  useEffect(() => {
    // Initialize dark mode by default
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gray-900', 'text-gray-100');

    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-gray-100');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900', 'text-gray-100');
    }

    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioURL, darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const webmBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        const url = URL.createObjectURL(webmBlob);
        setAudioURL(url);
        chunksRef.current = [];
        await handleAudioSubmission(webmBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Error accessing microphone: ' + err.message);
    }
  };

  const handleAudioSubmission = async (blob) => {
    setIsTranscribing(true);
    
    try {
      const timestamp = new Date().getTime();
      const filename = `audio_${timestamp}.webm`;
      
      const formData = new FormData();
      formData.append('audio', blob, filename);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const data = await response.json();
      
      if (data.text) {
        const userMessage = data.text;
        const newMessage = {
          type: 'user',
          content: userMessage
        };

        const assistantResponse = await handleFinancialAssistantAPI(userMessage);
        
        const assistantMessage = {
          type: 'assistant',
          content: assistantResponse
        };

        setChatHistory(prev => [...prev, newMessage, assistantMessage]);
        setMessage('');
      } else {
        throw new Error('No transcription text received');
      }

    } catch (err) {
      console.error('Error processing audio:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFinancialAssistantAPI = async (userMessage) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/financial-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Algo deu errado');
      }

      return data.response;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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
      const assistantResponse = await handleFinancialAssistantAPI(message);
      
      const assistantMessage = {
        type: 'assistant',
        content: assistantResponse
      };

      setChatHistory(prev => [...prev, newMessage, assistantMessage]);
      setMessage('');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div 
      className={`
        min-h-screen 
        w-full 
        ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-black'}
        flex flex-col 
        max-w-4xl 
        mx-auto 
        p-4
      `}
    >
      <SideBar expanded={expanded} setExpanded={setExpanded} />
      
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={toggleDarkMode} 
          className={`
            p-2 
            rounded-full 
            transition-colors 
            ${darkMode 
              ? 'hover:bg-gray-700 bg-gray-800' 
              : 'hover:bg-gray-100 bg-white'}
          `}
          aria-label={darkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          {darkMode 
            ? <Sun className="w-6 h-6 text-yellow-500" /> 
            : <Moon className="w-6 h-6 text-purple-600" />}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => router.push('/dashboard')}
          className={`
            p-2 
            rounded-full 
            transition-colors 
            group
            ${darkMode 
              ? 'hover:bg-gray-700' 
              : 'hover:bg-purple-50'}
          `}
          aria-label="Voltar para o dashboard"
        >
          <ArrowLeft 
            className={`
              w-6 h-6 
              ${darkMode 
                ? 'text-purple-300 group-hover:text-purple-200' 
                : 'text-purple-600 group-hover:text-purple-700'}
            `} 
          />
        </button>
        <h1 
          className={`
            text-2xl 
            font-bold 
            ${darkMode 
              ? 'text-purple-300' 
              : 'text-purple-700'}
          `}
        >
          Assistente Investe Aí
        </h1>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`
              px-4 py-2 
              rounded-lg 
              text-sm 
              transition-colors
              ${darkMode 
                ? 'bg-gray-700 text-purple-200 hover:bg-gray-600' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}
            `}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div 
        className={`
          flex-1 
          overflow-y-auto 
          mb-4 
          space-y-4 
          p-4 
          rounded-lg
          ${darkMode 
            ? 'bg-gray-800' 
            : 'bg-gray-50'}
        `}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] 
                p-3 
                rounded-lg 
                ${msg.type === 'user'
                  ? (darkMode 
                      ? 'bg-purple-700 text-white rounded-br-none' 
                      : 'bg-purple-600 text-white rounded-br-none')
                  : (darkMode 
                      ? 'bg-gray-700 text-gray-200 border-gray-600' 
                      : 'bg-white text-black border-gray-200 border')}
              `}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {(isLoading || isTranscribing) && (
          <div className="flex justify-start">
            <div 
              className={`
                p-3 
                rounded-lg 
                rounded-bl-none
                ${darkMode 
                  ? 'bg-gray-700 text-gray-200 border-gray-600' 
                  : 'bg-white border-gray-200 border'}
              `}
            >
              <p>Digitando...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div 
          className={`
            mb-4 
            p-4 
            rounded-lg
            ${darkMode 
              ? 'bg-red-900 text-red-200' 
              : 'bg-red-100 text-red-700'}
          `}
        >
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isTranscribing || isLoading}
          className={`
            p-3 
            rounded-lg 
            flex 
            items-center 
            gap-2 
            transition-colors
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : (darkMode 
                  ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white')}
            ${(isTranscribing || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isRecording ? <Square size={18} /> : <Mic size={18} />}
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`
            flex-1 
            p-3 
            rounded-lg 
            focus:outline-none 
            focus:border-purple-500
            ${darkMode 
              ? 'bg-gray-800 text-white border-gray-600' 
              : 'bg-white text-black border-gray-300'}
          `}
          placeholder="Digite sua mensagem..."
          disabled={isLoading || isRecording || isTranscribing}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim() || isRecording || isTranscribing}
          className={`
            px-6 
            py-3 
            rounded-lg 
            transition-colors 
            flex 
            items-center 
            gap-2
            ${darkMode 
              ? 'bg-purple-700 hover:bg-purple-600 text-white' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'}
            ${(isLoading || !message.trim() || isRecording || isTranscribing) 
              ? 'opacity-50 cursor-not-allowed' 
              : ''}
          `}
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