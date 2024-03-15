// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),

		CredentialsProvider({	
			credentials: {
				email: { label: "email", type: "text" },
				password: {  label: "Password", type: "password" }
			},
			
			async authorize(credentials, req) {
				// console.log('111111111111');
				// console.log(credentials, req);
				const res = await fetch("http://localhost:3002/test", {
					method: 'POST',
					body: JSON.stringify(credentials),
					headers: { "Content-Type": "application/json" }
				})
				
				const user = await res.json()
				console.log('user', user);
				console.log('여기 찍힘');
				// If no error and we have user data, return it
				if (res.ok) {
					console.log('성공');
					return user
				}
				console.log('실패');
				// Return null if user data could not be retrieved
				
				

				return null
			}
		})
	],
	callbacks: {        
		async signIn({ user, account, profile, email, credentials }) {
			console.log(user);
			return true;
		},
		// async redirect({ url, baseUrl }) {
		// 	console.log('url', url);
		// 	console.log('baseUrl', baseUrl);
		// 	return baseUrl
		// }
		// async jwt({ token, user }) {
    //         // console.log(token);
    //         return { ...token, ...user };
    //     },
	},
	// pages: {
	// 	signIn: "/", // 내가 원하는 커스텀 sign-in 페이지의 url 
	// },
    
  });

export { handler as GET, handler as POST };