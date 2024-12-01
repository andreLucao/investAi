"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Send, Moon, Sun } from 'lucide-react';
import { Card, CardContent } from '@/app/components/Card';

export default function Page1() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const commonGoals = [
    { emoji: '🏠', name: 'Casa' },
    { emoji: '💒', name: 'Casamento' },
    { emoji: '🛬', name: 'Viagem' }
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Recording functions remain the same
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        try {
          setIsProcessing(true);
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
          chunksRef.current = [];
          
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

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
            setTextInput(data.text);
          } else {
            throw new Error('No transcription text received');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          alert(error.message || 'Failed to transcribe audio. Please try again or type your response.');
        } finally {
          setIsProcessing(false);
        }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/fluxo-inicial/quarta-etapa');
  };

  useEffect(() => {
    const checkAudioSupport = () => {
      const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
      return types.some(type => MediaRecorder.isTypeSupported(type));
    };

    if (!checkAudioSupport()) {
      console.warn('Audio recording may not be supported in this browser');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      <Card className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              O que você acha de criarmos uma meta com base nos seus objetivos?
            </h1>

            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Exemplos mais escolhidos:
              </p>

              <div className="space-y-4">
                {commonGoals.map((goal, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 
                             border border-purple-100 dark:border-purple-800
                             transition-all duration-300 hover:scale-105"
                  >
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {goal.emoji} {goal.name}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-8">
                <div className="relative">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Ou digite sua resposta aqui..."
                    className="w-full px-6 py-4 pr-14 border border-gray-300 dark:border-gray-600 
                             rounded-lg bg-white dark:bg-gray-700 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                             text-gray-900 dark:text-gray-100 
                             placeholder-gray-400 dark:placeholder-gray-500
                             transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 dark:border-gray-300" />
                    ) : !isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        disabled={isProcessing}
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Square className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>

                {textInput.trim() && (
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 
                             bg-gradient-to-r from-purple-500 to-purple-600 
                             hover:from-purple-600 hover:to-purple-700 
                             dark:from-purple-600 dark:to-purple-800
                             dark:hover:from-purple-700 dark:hover:to-purple-900
                             text-white rounded-lg py-3 px-4 mt-5
                             transition-all duration-300 transform 
                             hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </button>
                )}
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
