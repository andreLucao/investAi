
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
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [showTranscriptionPreview, setShowTranscriptionPreview] = useState(false);
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
      subtitle: '(Isto nos ajudara a calcular mais precisamente os seus custos)'
    },
    {
      id: 'gambling',
      question: 'Você já apostou ou tem costume de apostar?',
      subtitle: '(se sim, por que você aposta?)'
    },
    {
      id: 'children',
      question: 'Você tem filhos?',
      subtitle: null
    }
  ];

  const advanceToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowTranscriptionPreview(false);
      setTranscriptionResult('');
    } else {
      localStorage.setItem('llamaParseStage1', JSON.stringify({
        timestamp: new Date().toISOString(),
        response: answers
      }));
      router.push('/fluxo-inicial/segunda-etapa');
    }
  };

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
      setShowTranscriptionPreview(false);
      setTranscriptionResult('');
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
    setTranscriptionResult('Transcribing...');
    setShowTranscriptionPreview(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setTranscriptionResult(data.text);
      
      // Store the transcribed text in answers
      const currentQuestion = questions[currentQuestionIndex];
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: data.text
      }));

    } catch (error) {
      console.error('Error processing audio:', error);
      setTranscriptionResult('Error: Failed to transcribe audio');
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
      const currentQuestion = questions[currentQuestionIndex];
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: textInput
      }));

      advanceToNextQuestion();
      setTextInput('');
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Erro ao processar o texto. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTranscription = () => {
    advanceToNextQuestion();
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

          {/* Transcription Preview */}
          {showTranscriptionPreview && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Transcription:</p>
              <p className="text-sm text-gray-600">{transcriptionResult}</p>
              {transcriptionResult && transcriptionResult !== 'Transcribing...' && !transcriptionResult.includes('Error') && (
                <div className="mt-4 space-x-4">
                  <button
                    onClick={handleConfirmTranscription}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirm & Continue
                  </button>
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Record Again
                  </button>
                </div>
              )}
            </div>
          )}
          
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