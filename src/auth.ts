import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Password",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const correctPassword = process.env.ADMIN_PASSWORD;
                if (credentials.password === correctPassword) {
                    // Return a user object that mimics what the API routes expect
                    // We reuse ADMIN_EMAIL so existing checks pass perfectly
                    return {
                        name: "Admin",
                        email: process.env.ADMIN_EMAIL || "admin@example.com"
                    };
                }
                return null;
            }
        })
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminPath = nextUrl.pathname.startsWith("/dashboard");

            // API route protection is handled individually in each route file 
            // by checking `auth()` session.

            if (isAdminPath) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        // No need for signIn callback checking email anymore, authorize handles it
    },
    pages: {
        signIn: '/login',
    }
})
