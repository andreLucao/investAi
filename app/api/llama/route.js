// app/api/llama/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Log the incoming request
    console.log('Received request');
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
    
    // Validate GROQ_API_KEY
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not defined');
      throw new Error('API key is not configured');
    }

    // Parse request body and log it
    const { transcriptionHistory } = await request.json();
    console.log('Received transcription history:', JSON.stringify(transcriptionHistory, null, 2));

    if (!transcriptionHistory || !Array.isArray(transcriptionHistory)) {
      throw new Error('Invalid transcription history format');
    }

    // Create context string
    const questionsContext = transcriptionHistory.map((entry, index) => 
      `Question ${index + 1}: ${entry.question}
       Answer ${index + 1}: ${entry.transcription}
       Topic: ${entry.questionId}
      `
    ).join('\n\n');

    console.log('Sending request to Groq API...');
    
    const groqRequest = {
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
      model: 'llama-3.2-90b-text-preview',  // Updated model name
      temperature: 0.7,
      max_tokens: 1000
    };

    console.log('Groq API request payload:', JSON.stringify(groqRequest, null, 2));

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groqRequest)
    });

    console.log('Groq API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Groq API response data:', JSON.stringify(data, null, 2));

    // Ensure we have the expected response structure
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Unexpected response format from Groq API');
    }

    const analysis = data.choices[0].message.content;

    // Parse the response into structured sections
    // You might want to add more sophisticated parsing based on your needs
    const structuredResponse = {
      riskAssessment: analysis.match(/(?:Risk Assessment|Risk Level):[^\n]*([\s\S]*?)(?=\n\n|$)/i)?.[1]?.trim() || 'Not available',
      financialConcerns: analysis.match(/(?:Financial Concerns|Concerns):[^\n]*([\s\S]*?)(?=\n\n|$)/i)?.[1]?.trim() || 'Not available',
      recommendations: analysis.match(/(?:Recommendations|Suggested Actions):[^\n]*([\s\S]*?)(?=\n\n|$)/i)?.[1]?.trim() || 'Not available',
      redFlags: analysis.match(/(?:Red Flags|Alerts|Warnings):[^\n]*([\s\S]*?)(?=\n\n|$)/i)?.[1]?.trim() || 'Not available',
      rawResponse: analysis // Include the raw response for debugging
    };

    console.log('Structured response:', JSON.stringify(structuredResponse, null, 2));

    return NextResponse.json(structuredResponse);

  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return NextResponse.json(
      { 
        error: 'Failed to process with LLaMA',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}