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
            <div className="space-y-4">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ou digite sua resposta aqui..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className="absolute right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
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
               className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white rounded-md py-2 px-4 hover:bg-purple-500 transition-colors"
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