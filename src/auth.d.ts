import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

// user 객체에 id와 acceessToken 프로퍼티 타입을 추가함
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
    } & DefaultSession['user'];
    refreshToken: string;
  }

  interface User extends DefaultUser {
    refreshToken?: string;
  }

}