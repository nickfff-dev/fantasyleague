import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import TwitchProvider from 'next-auth/providers/twitch';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@lib/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  
});
