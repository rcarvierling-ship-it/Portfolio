"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function useAnalytics() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Debounce or simple check to avoid double counting in dev strict mode
        // For now, we accept double counts in dev for simplicity of display
        const track = async () => {
            try {
                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: pathname })
                });
            } catch (err) {
                console.error("Failed to track view", err);
            }
        };

        track();
    }, [pathname, searchParams])

    const trackEvent = (name: string, data?: Record<string, any>) => {
        // console.log(`[Analytics] Event: ${name}`, data)
        // Could extend API to handle events
    }

    return { trackEvent }
}
