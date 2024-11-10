import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Log das variáveis de ambiente (sem expor valores completos)
    console.log('Environment check:', {
      hasApiKey: !!process.env.NEXT_PUBLIC_CODEGPT_API_KEY,
      hasAgentId: !!process.env.NEXT_PUBLIC_CODEGPT_AGENT_ID,
      apiKeyPrefix: process.env.NEXT_PUBLIC_CODEGPT_API_KEY?.slice(0, 5),
    });

    // Parse e log do body da requisição
    const body = await req.json();
    console.log('Request body:', {
      messageCount: body.messages?.length,
      lastMessage: body.messages?.[body.messages.length - 1]?.content,
    });

    // Construir e logar os headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CODEGPT_API_KEY}`,
    };
    console.log('Request headers:', {
      contentType: headers['Content-Type'],
      hasAuth: !!headers['Authorization'],
    });

    // Fazer a requisição para a API do CodeGPT
    const response = await fetch('https://api.codegpt.co/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...body,
        agentId: process.env.NEXT_PUBLIC_CODEGPT_AGENT_ID,
        stream: true,
      }),
    });

    // Log da resposta
    console.log('CodeGPT API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      // Se a resposta não for ok, tenta ler o corpo do erro
      const errorText = await response.text();
      console.error('API error response:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch from CodeGPT API',
          details: errorText,
          status: response.status
        }, 
        { status: response.status }
      );
    }

    // Se chegou aqui, a resposta está ok
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    // Log detalhado do erro
    console.error('API Route Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        type: error.name,
      },
      { status: 500 }
    );
  }
}

// Configuração para aceitar requests maiores
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};