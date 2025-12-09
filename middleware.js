import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname

    // 1. Define Public Paths (No Login Required)
    const publicPaths = ['/login', '/credits']
    const isPublicPath = publicPaths.includes(path) || path === '/api/auth/login'

    // 2. Check for Auth Token (userId cookie)
    const token = request.cookies.get('userId')?.value

    // 3. Logic: Redirect unauthenticated users to /login
    if (!token && !isPublicPath) {
        // Allow access to root '/' (it redirects to login in page.jsx anyway, or we can force it here)
        if (path === '/') {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Redirect to login for all other protected routes
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 4. Logic: (Optional) If logged in and visiting /login, could redirect to dashboard, 
    // but we'll leave it open as requested to ensuring they can just "go into the pages" is the main denied action.

    return NextResponse.next()
}

// Configure paths to match
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images/assets (common extensions)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
