'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Send } from 'lucide-react';
import { useEffect } from 'react';

export default function page1() {
  const router = useRouter();
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

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
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' }); // Changed to webm format
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        chunksRef.current = [];
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
    if (textInput.trim() || audioBlob) {
      // Here you would typically upload the audio file to your server
      // For example:
      // const formData = new FormData();
      // if (audioBlob) formData.append('audio', audioBlob);
      // if (textInput) formData.append('text', textInput);
      // await fetch('/api/submit', { method: 'POST', body: formData });
      
      router.push('/fluxo-inicial/segunda-etapa');
    }
  };

  // Cleanup function to revoke object URL when component unmounts
  const cleanup = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  };

  // Clean up the audio URL when the component unmounts
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
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Mic className="w-6 h-6" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <Square className="w-6 h-6" />
                    </button>
                  )}
                </div>
                
                {audioURL && (
                  <div className="w-full">
                    <p className="text-sm text-green-600 mb-2">Audio gravado com sucesso!</p>
                    <audio 
                      ref={audioRef}
                      src={audioURL} 
                      controls 
                      className="w-full"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ou digite sua resposta aqui..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors"
                disabled={!textInput.trim() && !audioBlob}
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}