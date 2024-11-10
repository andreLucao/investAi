import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch('https://api.codegpt.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CODEGPT_API_KEY}`,
      },
      body: JSON.stringify({
        ...body,
        agentId: process.env.NEXT_PUBLIC_CODEGPT_AGENT_ID,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = response.body;

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from CodeGPT API' },
      { status: 500 }
    );
  }
}