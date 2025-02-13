// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import { transaction } from '@/app/utils/axios';
import { cookies } from 'next/headers';

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
				let user = {id:"", email:"", refreshToken:""};
				let success = 'n';
				await transaction("post", "signin", credentials, signinCallback, true, false, "", null);
				
				function signinCallback(obj:any){
					if(obj.sendObj.success === 'y'){
						success = obj.sendObj.success;
						user.id = obj.sendObj.resObj.id
						user.email = obj.sendObj.resObj.email
						user.refreshToken = obj.refreshToken
					}
					// console.log(backendCookies.toString());
					if(obj.refreshToken){
					// 	const cookiesArray = backendCookies.toString().split(/[;,]/);
						const cookiesList = cookies();
						const expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24 * 30); // 24 hour 30일
						cookiesList.set({
							name: 'refreshtoken',
							value: obj.refreshToken,
							expires:expiryDate, 
							httpOnly: true,
							sameSite : true,
							path: '/',
							})

					// 	user.accessToken = accesstoken;
					}
				}

				if(success === "y"){
					return user
				}
				
				// const user =  res.json()
				// If no error and we have user data, return it
				// if (res.ok) {
				// 	// console.log('성공');
				// 	return user
				// }
				// console.log('실패');
				// Return null if user data could not be retrieved
				return null
			}
		})
	],
	callbacks: {        
		async signIn({ user, account, profile, email, credentials }) {
			if(account){
				if(account.provider === "google"){
					try{
						const obj = await transaction("post", "googlesignin", user, "", false, false, "", null);
						// obj.refreshToken;
						
						if(obj.refreshToken){
						// 	const cookiesArray = backendCookies.toString().split(/[;,]/);
							const cookiesList = cookies();
							const expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24 * 30); // 24 hour 30일
							cookiesList.set({
								name: 'refreshtoken',
								value: obj.refreshToken,
								expires:expiryDate,
								httpOnly: true,
								sameSite : true,
								path: '/',
							})
								
						// 	user.accessToken = accesstoken;
						}else{
							return false;
						}
					}catch(e){
						return false;
					}
					

				}				
			}
			return true;
		},

		async jwt({ token, account, user }) {
			// console.log("접근");
			// if(user){
			// 	token.refreshToken = user.refreshToken;
			// }
			return token;
		},
		async session({ session }) {
			// console.log(session);
			// if(token){
			// 	session.refreshToken = token.refreshToken as string;
			// }
			return session;
		},
		
	},
	pages: {
		signIn: "/home", // 내가 원하는 커스텀 sign-in 페이지의 url 
		error: '/home',
	},
    
  });

export { handler as GET, handler as POST };