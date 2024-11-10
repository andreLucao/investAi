'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Send } from 'lucide-react';

export default function page1() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
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
        chunksRef.current = [];
        
        // Create FormData and submit immediately
        const formData = new FormData();
        formData.append('audio', blob);
        if (textInput) formData.append('text', textInput);
        
        router.push('/fluxo-inicial/quinta-etapa');
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
    const formData = new FormData();
    if (textInput) formData.append('text', textInput);
    router.push('/fluxo-inicial/quinta-etapa');
  };

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
          
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Ou digite sua resposta aqui..."
                className="w-full px-6 py-4 pr-14 border border-gray-200 rounded-full bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Square className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            {textInput.trim() && (
              <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white rounded-md py-2 px-4 hover:bg-purple-500 transition-colors mt-4"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}