'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Send } from 'lucide-react';

export default function page1() {
  const router = useRouter();
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
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
        // Navigate to the next route immediately after recording stops
        router.push('/fluxo-inicial/segunda-etapa');
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
    if (textInput.trim()) {
      router.push('/fluxo-inicial/segunda-etapa');
    }
  };

  const cleanup = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return (
<div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] max-w-md w-full space-y-8 text-center p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Me manda um audio me respondendo essas perguntas:
        </h1>
        <div className="space-y-6">
          <div className="transform transition-all duration-300 hover:scale-102">
            <p className="text-lg font-medium text-gray-800">Qual é sua renda media atual?</p>
          </div>
          <div className="transform transition-all duration-300 hover:scale-102">
            <p className="text-lg font-medium text-gray-800">Atualmente voce tem dividas?</p>
            <p className="text-sm text-gray-500 mt-1">(se sim, quanto)</p>
          </div>
          <div className="transform transition-all duration-300 hover:scale-102">
            <p className="text-lg font-medium text-gray-800">Me fale de onde você é.</p>
          </div>
          <div className="transform transition-all duration-300 hover:scale-102">
            <p className="text-lg font-medium text-gray-800">Voce ja apostou ou tem costume de apostar?</p>
          </div>
          <div className="transform transition-all duration-300 hover:scale-102">
            <p className="text-lg font-medium text-gray-800">Vc tem filhos?</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-4">
              <div className="relative flex items-center group">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ou digite sua resposta aqui..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 group-hover:bg-white"
                />
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className="absolute right-2 p-2 text-gray-500 hover:text-purple-600 transition-colors duration-300"
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
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white rounded-full py-3 px-4 hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Próximo
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}