// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    
	pages: {
			signIn: '/login',
		},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	callbacks: {        
		async signIn({ user, account, profile, email, credentials }) {
  
		return true
	},
	}
    
  });

export { handler as GET, handler as POST };