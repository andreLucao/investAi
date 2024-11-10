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
              content: Process this audio transcription and extract key information about: income, debts, location, gambling habits, and children. Audio content: ${base64Audio}
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const reader = response.body.getReader();
      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedResponse += chunk;
      }

      // Store the parsed response in localStorage for next stages
      localStorage.setItem('llamaParseStage1', JSON.stringify({
        timestamp: new Date().toISOString(),
        response: accumulatedResponse
      }));

      // Navigate to next stage
      router.push('/fluxo-inicial/segunda-etapa');
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Error processing audio. Please try again.');
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
        throw new Error('Failed to process text input');
      }

      const reader = response.body.getReader();
      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedResponse += chunk;
      }

      // Store the parsed response in localStorage for next stages
      localStorage.setItem('llamaParseStage1', JSON.stringify({
        timestamp: new Date().toISOString(),
        response: accumulatedResponse
      }));

      // Navigate to next stage
      router.push('/fluxo-inicial/segunda-etapa');
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Error processing text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-8">
          Me manda um audio me respondendo essas perguntas:
        </h1>
        <div className="space-y-6">
          <div>
            <p className="text-lg font-medium text-black">Qual é sua renda media atual?</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Atualmente voce tem dividas?</p>
            <p className="text-sm text-gray-600 mt-1">(se sim, quanto)</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Me fale de onde você é.</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Voce ja apostou ou tem costume de apostar?</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">Vc tem filhos?</p>
          </div>
          
          <form onSubmit={handleTextSubmit} className="mt-8">
            <div className="space-y-4">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ou digite sua resposta aqui..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className="absolute right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {!isRecording ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5 text-red-600" />
                  )}
                </button>
              </div>

              {textInput.trim() && (
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-full py-3 px-4 hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Enviar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}