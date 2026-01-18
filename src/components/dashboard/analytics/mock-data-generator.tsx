"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"

export function MockDataGenerator({ onGenerate }: { onGenerate: () => void }) {
    const [loading, setLoading] = useState(false);

    const generateData = async () => {
        setLoading(true);
        try {
            // Generate 20 random sessions
            const locations = [
                { city: "New York", country: "US", lat: "40.7128", lng: "-74.0060" },
                { city: "London", country: "GB", lat: "51.5074", lng: "-0.1278" },
                { city: "Tokyo", country: "JP", lat: "35.6762", lng: "139.6503" },
                { city: "Sydney", country: "AU", lat: "-33.8688", lng: "151.2093" },
                { city: "Paris", country: "FR", lat: "48.8566", lng: "2.3522" },
                { city: "Berlin", country: "DE", lat: "52.5200", lng: "13.4050" },
                { city: "San Francisco", country: "US", lat: "37.7749", lng: "-122.4194" },
                { city: "Toronto", country: "CA", lat: "43.65107", lng: "-79.347015" },
                { city: "Singapore", country: "SG", lat: "1.3521", lng: "103.8198" },
                { city: "Mumbai", country: "IN", lat: "19.0760", lng: "72.8777" }
            ];

            const events = Array.from({ length: 20 }).map((_, i) => {
                const loc = locations[Math.floor(Math.random() * locations.length)];
                const isRecent = Math.random() > 0.5;
                const timestamp = isRecent
                    ? new Date(Date.now() - Math.random() * 1000 * 60 * 15).toISOString() // Last 15 mins
                    : new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(); // Last 7 days

                return {
                    type: 'pageview',
                    sessionId: `mock-session-${Math.random().toString(36).substr(2, 9)}`,
                    path: '/',
                    timestamp,
                    data: {
                        geo: loc
                    }
                };
            });

            // Send sequentially (or bulk if API supported it, here just loop)
            for (const event of events) {
                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(event)
                });
            }

            onGenerate();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={generateData} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Generate Mock Traffic
        </Button>
    )
}
