"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, createContext, useContext } from "react"
import { AnalyticsEvent } from "@/lib/types"

interface AnalyticsContextType {
    trackEvent: (type: AnalyticsEvent['type'], data?: any) => void;
    sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function useAnalytics() {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error("useAnalytics must be used within AnalyticsProvider");
    }
    return context;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [sessionId, setSessionId] = useState<string>("");
    const trackedScrollDepth = useRef<Set<number>>(new Set());

    // Initialize Session
    useEffect(() => {
        let sid = sessionStorage.getItem("analytics_session_id");
        if (!sid) {
            sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem("analytics_session_id", sid);
        }
        setSessionId(sid);
    }, []);

    const trackEvent = async (type: AnalyticsEvent['type'], data: any = {}) => {
        if (!sessionId) return; // Wait for session

        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    type,
                    path: pathname,
                    data: {
                        ...data,
                        device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
                    }
                })
            });
        } catch (err) {
            console.error("[Analytics] Failed to track:", err);
        }
    };

    // Track Pageviews
    useEffect(() => {
        if (sessionId) {
            trackEvent('pageview', { referrer: document.referrer });
            // Reset scroll tracking on page change
            trackedScrollDepth.current = new Set();
        }
    }, [pathname, sessionId]);

    // Track Scroll
    useEffect(() => {
        if (!sessionId) return;

        const handleScroll = () => {
            const h = document.documentElement;
            const b = document.body;
            const st = 'scrollTop';
            const sh = 'scrollHeight';

            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;

            [25, 50, 75, 100].forEach(milestone => {
                if (percent >= milestone && !trackedScrollDepth.current.has(milestone)) {
                    trackedScrollDepth.current.add(milestone);
                    trackEvent('scroll', { depth: milestone });
                }
            });
        };

        let timeout: NodeJS.Timeout;
        const throttledScroll = () => {
            if (timeout) return;
            timeout = setTimeout(() => {
                handleScroll();
                clearTimeout(timeout as any); // cast for node types
                (timeout as any) = null;
            }, 500);
        };

        window.addEventListener('scroll', throttledScroll);
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [pathname, sessionId]);

    // Track Clicks (Delegation)
    useEffect(() => {
        if (!sessionId) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickable = target.closest('a, button, [data-track]');

            if (clickable) {
                const trackName = clickable.getAttribute('data-track');
                const href = clickable.getAttribute('href');
                const ariaLabel = clickable.getAttribute('aria-label');

                // Track social/external links
                if (href && (href.startsWith('http') || href.startsWith('mailto'))) {
                    trackEvent('social', { target: href, label: ariaLabel || trackName });
                }
                // Track specific data-track elements
                else if (trackName) {
                    trackEvent('click', { target: trackName, label: ariaLabel });
                }
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [sessionId]);

    return (
        <AnalyticsContext.Provider value={{ trackEvent, sessionId }}>
            {children}
        </AnalyticsContext.Provider>
    );
}
