import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Define public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/api/auth'];
  
  // Check if the path is a public path
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // Allow public paths and static assets
  if (isPublicPath || request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/)) {
    return NextResponse.next();
  }
  
  // Allow API calls to auth routes without redirection
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  
  // Redirect to login if not authenticated and trying to access protected routes
  if (!token) {
    const url = new URL(`/auth/signin`, request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};