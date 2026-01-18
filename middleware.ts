import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
    // We can't confuse this with the API routes that need public access (e.g. initial fetches)
    // BUT all our API routes are currently public GET, private POST.
    // We'll enforce POST protection inside the API routes themselves or refine this middleware.

    // For now, let's strictly protect /dashboard
    if (isDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/api/auth/signin', req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/dashboard/:path*", "/api/((?!auth).*)"],
}
