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
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

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
      // Convert audio blob to base64
      const base64Audio = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
      });

      const response = await fetch('/api/chatbot-marcos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that processes audio transcriptions and extracts key information about financial status, debts, location, gambling habits, and family status."
            },
            {
              role: "user",
              content: `Process this audio transcription and extract key information about: income, debts, location, gambling habits, and children. Audio content: ${base64Audio}`
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
          // Attempt to parse the chunk as JSON
          JSON.parse(chunk);
          accumulatedResponse = chunk;
        } catch {
          // If it's not valid JSON, accumulate it
          accumulatedResponse += chunk;
        }
      }

      // Try to parse the final response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(accumulatedResponse);
      } catch (error) {
        console.error('Error parsing response:', error);
        parsedResponse = { error: 'Failed to parse response' };
      }

      // Store the parsed response in localStorage
      localStorage.setItem('llamaParseStage1', JSON.stringify({
        timestamp: new Date().toISOString(),
        response: parsedResponse
      }));

      router.push('/fluxo-inicial/segunda-etapa');
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
              content: textInput
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
          // Attempt to parse the chunk as JSON
          JSON.parse(chunk);
          accumulatedResponse = chunk;
        } catch {
          // If it's not valid JSON, accumulate it
          accumulatedResponse += chunk;
        }
      }

      // Try to parse the final response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(accumulatedResponse);
      } catch (error) {
        console.error('Error parsing response:', error);
        parsedResponse = { error: 'Failed to parse response' };
      }

      localStorage.setItem('llamaParseStage1', JSON.stringify({
        timestamp: new Date().toISOString(),
        response: parsedResponse
      }));

      router.push('/fluxo-inicial/segunda-etapa');
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Erro ao processar o texto. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      // Clean up media stream on unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioURL]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] max-w-md w-full space-y-8 text-center p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Me manda um áudio me respondendo essas perguntas:
        </h1>
        <div className="space-y-6">
          <div>
            <p className="text-lg font-medium text-gray-900">Qual é sua renda média atual?</p>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">Atualmente você tem dívidas?</p>
            <p className="text-sm text-gray-600 mt-1">(se sim, quanto)</p>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">Me fale de onde você é.</p>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">Você já apostou ou tem costume de apostar?</p>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">Você tem filhos?</p>
          </div>
          
          <form onSubmit={handleTextSubmit} className="mt-8">
            <div className="space-y-4">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ou digite sua resposta aqui..."
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
        </div>
      </div>
    </div>
  );
}