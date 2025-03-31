import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) {
          return null;
        }

        
        return user;
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
};