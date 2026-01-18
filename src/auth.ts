import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminPath = nextUrl.pathname.startsWith("/dashboard");
            const isApiWrite = nextUrl.pathname.startsWith("/api") && ["POST", "PUT", "DELETE", "PATCH"].includes(nextUrl.searchParams.get("method") || ""); // Basic check, middleware handles method better

            // Allow admin only if email matches env
            if (isLoggedIn && auth.user?.email !== process.env.ADMIN_EMAIL) {
                return false; // Redirect to signin/error
            }

            if (isAdminPath) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async signIn({ user }) {
            if (user.email === process.env.ADMIN_EMAIL) {
                return true;
            }
            return false; // Deny sign in
        }
    },
})
