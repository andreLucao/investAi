import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Log do ambiente e variáveis
    console.log('Environment check:', {
      hasApiKey: !!process.env.NEXT_PUBLIC_CODEGPT_API_KEY,
      hasAgentId: !!process.env.NEXT_PUBLIC_CODEGPT_AGENT_ID,
    });

    // Parse do body
    const body = await req.json();

    // Construção dos headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CODEGPT_API_KEY}`,
    };

    // Log da requisição
    console.log('Making request to CodeGPT API with:', {
      endpoint: 'https://api.codegpt.co/v1/chat/completions',
      method: 'POST',
      headersPresent: !!headers.Authorization,
      messageCount: body.messages?.length,
    });

    // Fazendo a requisição para a API do CodeGPT
    const response = await fetch('https://api.codegpt.co/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        messages: body.messages,
        agentId: process.env.NEXT_PUBLIC_CODEGPT_AGENT_ID,
        stream: true,
      }),
    });

    // Log da resposta
    console.log('CodeGPT API response:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    // Retorna o stream
    const stream = response.body;
    
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch from CodeGPT API',
        details: error.message,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}