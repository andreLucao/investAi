// app/api/financial-assistant/route.js
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é um assistente financeiro especializado. Seu objetivo é ajudar com:
•⁠  ⁠Planejamento financeiro
•⁠  ⁠Análise de investimentos
•⁠  ⁠Orçamento pessoal
•⁠  ⁠Dicas de economia
•⁠  ⁠Educação financeira
Forneça respostas claras, práticas e adaptadas ao contexto brasileiro.

Sempre tente convencer que apostar é ruim e nosivo e que ele deve organizar suas finanças para ter uma vida tranquila`;

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.2-90b-text-preview",
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = completion.choices[0]?.message?.content || "";

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Financial Assistant Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}