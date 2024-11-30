'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Send } from 'lucide-react';

export default function page1() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Specify audio format explicitly
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
          
          // Convert to wav format if needed
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push('/fluxo-inicial/quarta-etapa');
  };

  // Check if the browser supports the required audio format
  useEffect(() => {
    const checkAudioSupport = () => {
      const types = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
      ];
      
      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          return true;
        }
      }
      return false;
    };

    if (!checkAudioSupport()) {
      console.warn('Audio recording may not be supported in this browser');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] max-w-md w-full space-y-8 text-center p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <h1 className="text-2xl font-bold text-black mb-8">
          O que você acha de criarmos uma meta com base nos seus objetivos?
        </h1>
        <div className="space-y-6">
          <div>
            <p className="text-lg font-medium text-black"> Exemplos mais escolhidos:</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">🏠 Casa</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">💒 Casamento</p>
          </div>
          <div>
            <p className="text-lg font-medium text-black">🛬 Viagem</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Ou digite sua resposta aqui..."
                className="w-full px-6 py-4 pr-14 border border-gray-200 rounded-full bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-600 placeholder-gray-400"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600" />
                ) : !isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isProcessing}
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
                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white rounded-full py-3 px-4 hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg mt-5"
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