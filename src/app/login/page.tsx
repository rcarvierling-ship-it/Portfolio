import { signIn } from "@/auth"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login | RCV.Media",
    description: "Admin access only.",
}

export default async function LoginPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
                    <p className="text-muted-foreground text-sm">Enter your PIN code or password to continue.</p>
                </div>

                <form
                    action={async (formData) => {
                        "use server"
                        const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";
                        await signIn("credentials", {
                            password: formData.get("password"),
                            redirectTo,
                        })
                    }}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-secondary/30 border border-border focus:ring-1 focus:ring-primary outline-none transition-all text-center tracking-widest"
                    />

                    {/* Preserve callbackUrl if present */}
                    {params?.callbackUrl && (
                        <input type="hidden" name="redirectTo" value={params.callbackUrl as string} />
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                        Unlock Dashboard
                    </button>

                    {params?.error && (
                        <div className="text-red-500 text-xs text-center font-medium bg-red-500/10 p-2 rounded">
                            {params.error === "CredentialsSignin"
                                ? "Invalid password. Access denied."
                                : "Authentication failed. Please try again."}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
