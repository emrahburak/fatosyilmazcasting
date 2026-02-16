import { NextRequest, NextResponse } from 'next/server';

/**
 * Hostname-based Routing Middleware
 * 
 * - fatosyilmazcasting.com       → main-site (Public Site)
 * - panel.fatosyilmazcasting.com → panel-admin (Admin Panel)
 * 
 * Çalışma Prensibi:
 * 1. Hostname'e göre subdomain tespit edilir
 * 2. İstek ilgili klasöre rewrite edilir
 * 3. URL değişmez (user görmez)
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Path'i al
  const path = url.pathname;
  
  // API routes, static files ve Next.js internal'lerini atla
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/static/') ||
    path.includes('.') // favicon.ico, images, etc.
  ) {
    return NextResponse.next();
  }
  
  // Panel subdomain kontrolü
  // - panel.fatosyilmazcasting.com
  // - localhost:3001 (panel için local dev port - package.json'dan)
  const isPanel = 
    hostname.startsWith('panel.') || 
    hostname === 'localhost:3001';
  
  // Rewrite to appropriate folder
  if (isPanel) {
    // Panel → panel-admin klasörüne
    url.pathname = '/panel-admin' + (path === '/' ? '' : path);
  } else {
    // Ana domain → main-site klasörüne
    url.pathname = '/main-site' + (path === '/' ? '' : path);
  }
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Tüm path'leri match et, ancak şunları hariç tut:
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
