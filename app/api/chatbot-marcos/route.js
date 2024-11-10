// app/api/chatbot-marcos/route.js
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Verificar se a chave API está configurada
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY não está configurada");
    return NextResponse.json(
      { error: "API key não configurada" },
      { status: 500 }
    );
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    // Verificar se o corpo da requisição é válido
    const body = await request.json();
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Formato de mensagem inválido" },
        { status: 400 }
      );
    }

    // Garantir que há pelo menos uma mensagem
    if (body.messages.length === 0) {
      body.messages.push({
        role: "system",
        content: "Você é um assistente chamado 'Investe a.í' que foi feito para dar dicas financeiras"
      });
    }

    // Criar o stream de resposta
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: body.messages,
            model: "llama-3.2-90b-text-preview", // Mudei para um modelo mais estável
            temperature: 0.7, // Reduzindo a temperatura para respostas mais consistentes
            max_tokens: 1024,
            top_p: 1,
            stream: true,
            stop: null
          });

          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(content);
            }
          }
          controller.close();
        } catch (error) {
          console.error("Erro no streaming:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("[CHAT ERROR]", error);
    return NextResponse.json(
      { 
        error: "Erro no servidor", 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; // Opcional: usar edge runtime para melhor performance