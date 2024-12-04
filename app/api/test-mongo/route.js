import { MongoClient } from 'mongodb';

const uri = 'mongodb://rwuser:%40Leo290405@192.168.0.106:8635,192.168.0.115:8635/test?authSource=admin&replicaSet=replica';



export async function GET(request) {
  try {
    const client = new MongoClient(uri);
    await client.connect(); // Tenta conectar ao MongoDB
    await client.db('test').command({ ping: 1 }); // Verifica se o banco está respondendo
    await client.close(); // Fecha a conexão

    return new Response(JSON.stringify({ message: 'Conexão bem-sucedida com o MongoDB!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    return new Response(JSON.stringify({ message: `Erro ao conectar: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
