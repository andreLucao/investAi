
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoClient } from 'mongodb';

let clientPromise;

async function connectToDatabase() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGO_URI);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
   
        const client = await connectToDatabase();
        const db = client.db(process.env.MONGO_DB_NAME);

      
        const existingUser = await db.collection('users').findOne({ email: user.email });

        if (!existingUser) {
          
          await db.collection('users').insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date(),
          });
        }

        return true; 
      } catch (error) {
        console.error('Erro ao salvar o usuário no MongoDB:', error);
        return false; 
      }
    },
  },
});
