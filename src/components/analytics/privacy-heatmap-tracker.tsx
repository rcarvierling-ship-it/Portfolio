"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

// Config
const TRACKING_INTERVAL = 1000;
const GRID_SIZE = 50; // px

export function PrivacyHeatmapTracker() {
    const pathname = usePathname();
    const counters = useRef<Record<string, number>>({});
    const maxScroll = useRef(0);
    const lastTrackTime = useRef(Date.now());

    useEffect(() => {
        // Reset on page change
        counters.current = {};
        maxScroll.current = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastTrackTime.current < 50) return; // Throttle 50ms

            // Bucket coordinates
            const x = Math.floor(e.clientX / GRID_SIZE);
            const y = Math.floor((e.clientY + window.scrollY) / GRID_SIZE);
            const key = `${x},${y}`;

            counters.current[key] = (counters.current[key] || 0) + 1;
            lastTrackTime.current = now;
        };

        const handleScroll = () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
            if (scrollPercent > maxScroll.current) {
                maxScroll.current = scrollPercent;
            }
        };

        // Flush data periodically or on exit
        const interval = setInterval(() => {
            if (Object.keys(counters.current).length > 0) {
                // Send batch to API (Fire and forget)
                fetch('/api/analytics/heatmap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: pathname,
                        grid: counters.current,
                        maxScroll: maxScroll.current
                    })
                }).catch(() => { }); // Ignore errors

                // Clear buffer (optional, or accumulate?) 
                // For this tracking logic, we might want to clear sent data?
                // Let's keep it simple: we just send whatever we have.
                // In a real app we'd clear.
                counters.current = {};
            }
        }, 5000);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, [pathname]);

    return null; // Invisible
}
