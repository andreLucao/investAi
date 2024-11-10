// app/api/llama/route.js
import { LlamaAI } from 'llamaai';
import { NextResponse } from 'next/server';

const systemPrompt = `Você está analisando respostas de um questionário financeiro.
As perguntas cobrem temas como renda, dívidas, localização, hábitos de apostas e situação familiar.
Por favor, analise as respostas a seguir e forneça:

1- Uma avaliação de risco baseada na situação e nos hábitos financeiros
2- Principais preocupações financeiras identificadas
3- Recomendações potenciais para melhoria financeira
4- Quaisquer alertas que devam ser abordados
5- Formate sua resposta em seções claras com títulos.
6- Para a avaliação de risco, forneça um nível de risco claro (Baixo, Médio ou Alto) com justificativa.
7- Baseie sua análise nos seguintes fatores principais:

Estabilidade e nível da renda
Peso e gerenciamento das dívidas
Localização geográfica e custo de vida associado
Histórico de apostas (se houver) e riscos associados
Obrigações familiares e responsabilidades financeiras
Forneça recomendações práticas e específicas para a situação do usuário.`;

export async function POST(request) {
  try {
    const llama = new LlamaAI({
      apiKey: process.env.LLAMA_API_KEY,
    });

    const { transcriptionHistory } = await request.json();

    // Create a comprehensive context string with all Q&A pairs
    const questionsContext = transcriptionHistory.map((entry, index) => 
      `Question ${index + 1}: ${entry.question}
       Answer ${index + 1}: ${entry.transcription}
       Topic: ${entry.questionId}
      `
    ).join('\n\n');

    // Send to LLaMA with structured prompt
    const response = await llama.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Here are the questionnaire responses to analyze:\n\n${questionsContext}`
        }
      ],
      model: 'llama-2-70b',
      temperature: 0.7,
      max_tokens: 1000
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error communicating with LLaMA:', error);
    return NextResponse.json(
      { error: 'Failed to process with LLaMA' },
      { status: 500 }
    );
  }
}