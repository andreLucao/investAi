import { MongoClient } from 'mongodb';

const clientPromise = new MongoClient(process.env.MONGO_URI).connect();

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB_NAME);
    
    // Your MongoDB query logic here
    const data = await db.collection('your_collection').find().toArray();
    
    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB_NAME);
    
    const body = await request.json();
    
    // Your MongoDB insert/update logic here
    const result = await db.collection('your_collection').insertOne(body);
    
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
//redeploy
