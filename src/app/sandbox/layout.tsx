import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SandboxProvider } from "@/lib/sandbox/context"

export default async function SandboxLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/sandbox")
    }

    return (
        <SandboxProvider>
            <div className="min-h-screen bg-background flex flex-col">
                {/* Safety Banner */}
                <div className="bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest text-center py-2 relative z-50">
                    🚧 Sandbox Mode — Mock Data Only — Changes vanish on reload 🚧
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col relative">
                    {/* Optional: Add distinctive watermarks or border */}
                    <div className="absolute inset-0 pointer-events-none border-[6px] border-yellow-500/5 z-0" />
                    <div className="relative z-10 flex-1 flex flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </SandboxProvider>
    )
}
