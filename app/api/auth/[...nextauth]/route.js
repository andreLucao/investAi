import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoClient } from 'mongodb';


const clientPromise = new MongoClient(process.env.MONGO_URI).connect();

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user }) {
      try {
     
        const client = await clientPromise;
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
        
        return false; 
      }
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
