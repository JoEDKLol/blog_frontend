// middleware.tsx
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from "next/server";

//
export function middleware(request: NextRequest) {
  console.log('미들웨어::', request.url);
  // if (request.nextUrl.pathname.startsWith('/home')) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

}
 
export const config = {
  matcher: ['/', '/home/:path*', '/blog/:path*'],
}