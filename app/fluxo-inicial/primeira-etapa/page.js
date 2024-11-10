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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [transcriptionHistory, setTranscriptionHistory] = useState([]);
  const [llamaAnalysis, setLlamaAnalysis] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const questions = [
    {
      id: 'income',
      question: 'Qual é sua renda média atual?',
      subtitle: null,
      placeholder: 'Ex: Minha renda mensal é R$ 3.000'
    },
    {
      id: 'children',
      question: 'Você tem filhos?',
      subtitle: null,
      placeholder:'Ex: Sim, tenho 2 filhos'
    },
    {
      id: 'debts',
      question: 'Atualmente você tem dívidas?',
      subtitle: '(se sim, quanto)',
      placeholder: 'Ex: Sim, tenho R$ 5.000 em dívidas no cartão'
    },
    {
      id: 'location',
      question: 'Me fale de onde você é.',
      subtitle: '(Isto nos ajudara a calcular mais precisamente os seus custos)',
      placeholder: 'Ex: Moro em São Paulo, SP'
    },
    {
      id: 'gambling',
      question: 'Você já apostou ou tem costume de apostar?',
      subtitle: '(se sim, por que você aposta?)',
      placeholder: 'Ex: Não, nunca apostei'
    }

  ];

  useEffect(() => {
    if (llamaAnalysis) {
      console.log('LLaMA Analysis Updated:', llamaAnalysis);
    }
  }, [llamaAnalysis]);

  const sendToLlama = async (history) => {
    try {
      const completeHistory = history.map(entry => ({
        ...entry,
        questionDetails: questions.find(q => q.id === entry.questionId) || {},
      }));

      const response = await fetch('/api/llama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transcriptionHistory: completeHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process with LLaMA');
      }

      const llamaResponse = await response.json();
      setLlamaAnalysis(llamaResponse);
      console.log('Complete LLaMA Response:', llamaResponse);
      
      localStorage.setItem('llamaParseStage1', JSON.stringify({
        timestamp: new Date().toISOString(),
        response: answers,
        transcriptionHistory: completeHistory,
        llamaAnalysis: llamaResponse,
        questionnaire: {
          totalQuestions: questions.length,
          completedQuestions: history.length,
          questionTopics: questions.map(q => q.id)
        }
      }));

    } catch (error) {
      console.error('Error sending to LLaMA:', error);
      setLlamaAnalysis({ error: 'Failed to get analysis' });
    }
  };

  const advanceToNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsLoading(false);
      setIsTranscribing(false);
    } else {
      await sendToLlama(transcriptionHistory);
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
    setIsTranscribing(true);
    
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
      const currentQuestion = questions[currentQuestionIndex];
      
      const newEntry = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        transcription: data.text,
        timestamp: new Date().toISOString(),
        metadata: {
          inputType: 'audio',
          questionNumber: currentQuestionIndex + 1,
          hasSubtitle: Boolean(currentQuestion.subtitle),
          subtitle: currentQuestion.subtitle
        }
      };

      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: data.text
      }));

      setTranscriptionHistory(prev => [...prev, newEntry]);

      setTimeout(() => {
        advanceToNextQuestion();
      }, 1000);

    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Erro ao processar o áudio. Por favor, tente novamente.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setIsLoading(true);
    try {
      const currentQuestion = questions[currentQuestionIndex];
      
      const newEntry = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        transcription: textInput,
        timestamp: new Date().toISOString(),
        metadata: {
          inputType: 'text',
          questionNumber: currentQuestionIndex + 1,
          hasSubtitle: Boolean(currentQuestion.subtitle),
          subtitle: currentQuestion.subtitle
        }
      };

      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: textInput
      }));

      setTranscriptionHistory(prev => [...prev, newEntry]);
      setTextInput('');
      await advanceToNextQuestion();
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Erro ao processar o texto. Por favor, tente novamente.');
      setIsLoading(false);
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
                  placeholder={currentQuestion.placeholder}
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

              {isRecording && (
                <div className="text-sm text-red-600">
                  Gravando...
                </div>
              )}
              
              {isTranscribing && (
                <div className="text-sm text-red-600">
                  Transcrevendo...
                </div>
              )}

              {llamaAnalysis && (
                <div className="text-sm text-gray-600">
                  Analysis complete! Check console for details.
                </div>
              )}
            </div>
          </form>
          
          <div className="text-sm text-gray-500">
            Questão {currentQuestionIndex} de {questions.length}
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-300 ease-in-out mt-5"
                  style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}