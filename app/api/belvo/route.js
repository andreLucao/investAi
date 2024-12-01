import { NextResponse } from 'next/server';
import belvo from 'belvo';

export async function POST() {
  if (!process.env.BELVO_CLIENT_ID || !process.env.BELVO_CLIENT_SECRET) {
    console.log('Missing credentials:', {
      hasClientId: !!process.env.BELVO_CLIENT_ID,
      hasClientSecret: !!process.env.BELVO_CLIENT_SECRET
    });
    return NextResponse.json(
      { error: 'Missing Belvo credentials in environment variables' },
      { status: 500 }
    );
  }

  try {
    console.log('Initializing Belvo client...');
    const client = new belvo({
      secretId: process.env.BELVO_CLIENT_ID,
      secretPassword: process.env.BELVO_CLIENT_SECRET,
      baseURL: 'https://development.belvo.com' // URL para ambiente de desenvolvimento Brasil
    });

    // Test the connection by getting institutions
    console.log('Testing connection...');
    const institutions = await client.connect();
    console.log('Retrieved institutions:', institutions);

    return NextResponse.json({ 
      success: true,
      message: 'Successfully connected to Belvo',
      connectionStatus: institutions
    });

  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: error.message,
        code: error.code,
        type: error.name
      },
      { status: 500 }
    );
  }
}