'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Send } from 'lucide-react';

export default function FirstStage() {
  const router = useRouter();
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const questions = [
    {
      id: 'income',
      question: 'Qual é sua renda média atual?',
      subtitle: null
    },
    {
      id: 'debts',
      question: 'Atualmente você tem dívidas?',
      subtitle: '(se sim, quanto)'
    },
    {
      id: 'location',
      question: 'Me fale de onde você é.',
      subtitle: null
    },
    {
      id: 'gambling',
      question: 'Você já apostou ou tem costume de apostar?',
      subtitle: null
    },
    {
      id: 'children',
      question: 'Você tem filhos?',
      subtitle: null
    }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        chunksRef.current = [];
        handleAudioSubmission(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please make sure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleAudioSubmission = async (blob) => {
    setIsLoading(true);
    try {
      const base64Audio = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
      });

      const response = await processInput(base64Audio, true);
      handleResponse(response);
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Erro ao processar o áudio. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await processInput(textInput, false);
      handleResponse(response);
      setTextInput('');
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Erro ao processar o texto. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const processInput = async (input, isAudio) => {
    const response = await fetch('/api/chatbot-marcos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that processes user input and extracts key information about financial status, debts, location, gambling habits, and family status."
          },
          {
            role: "user",
            content: isAudio ? `Process this audio transcription: ${input}` : input
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    let accumulatedResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = new TextDecoder().decode(value);
      try {
        JSON.parse(chunk);
        accumulatedResponse = chunk;
      } catch {
        accumulatedResponse += chunk;
      }
    }

    try {
      return JSON.parse(accumulatedResponse);
    } catch (error) {
      console.error('Error parsing response:', error);
      return { error: 'Failed to parse response' };
    }
  };

  const handleResponse = (response) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: response
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, save to localStorage and redirect
      localStorage.setItem('llamaParseStage1', JSON.stringify({
        timestamp: new Date().toISOString(),
        response: answers
      }));
      router.push('/fluxo-inicial/segunda-etapa');
    }
  };

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioURL]);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] max-w-md w-full space-y-8 text-center p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <div className="space-y-6">
          <div>
            <p className="text-lg font-medium text-gray-900">{currentQuestion.question}</p>
            {currentQuestion.subtitle && (
              <p className="text-sm text-gray-600 mt-1">{currentQuestion.subtitle}</p>
            )}
          </div>
          
          <form onSubmit={handleTextSubmit} className="mt-8">
            <div className="space-y-4">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isLoading || isRecording}
                />
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`absolute right-2 p-2 transition-colors ${
                    isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <Square className="w-5 h-5 text-red-600" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              </div>

              {textInput.trim() && (
                <button
                  type="submit"
                  disabled={isLoading || isRecording}
                  className={`w-full flex items-center justify-center gap-2 rounded-full py-3 px-4 transition-colors ${
                    isLoading || isRecording
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white`}
                >
                  <Send className="w-4 h-4" />
                  Enviar
                </button>
              )}

              {isLoading && (
                <div className="text-sm text-gray-600">Processando...</div>
              )}
            </div>
          </form>
          
          <div className="text-sm text-gray-500">
            Questão {currentQuestionIndex + 1} de {questions.length}
          </div>
        </div>
      </div>
    </div>
  );
}