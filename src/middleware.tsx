// middleware.tsx
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from "next/server";
import { transaction } from '@/app/utils/axios';
//
export function middleware(request: NextRequest) {
  console.log('미들웨어::', request.url);   
  // 
  
  // if (request.nextUrl.pathname.startsWith('/home')) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }
  if (request.nextUrl.pathname === '/blog') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  // console.log("요청URL", request.nextUrl.pathname);

}
 
export const config = {
  matcher: ['/', '/home/:path*', '/blog/:path*'],
}