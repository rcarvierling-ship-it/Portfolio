"use client"

import { useMemo, useState } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import { AnalyticsEvent } from "@/lib/types"

// GeoURL for world map topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface UserMapProps {
    data: AnalyticsEvent[]
}

export function UserMap({ data }: UserMapProps) {
    const [tooltipContent, setTooltipContent] = useState("")

    // Process data to group by location
    const locations = useMemo(() => {
        const locs: Record<string, { lat: number, lng: number, count: number, city: string, country: string, lastActive: string }> = {}

        data.forEach(event => {
            if (event.data?.geo?.lat && event.data?.geo?.lng) {
                const key = `${event.data.geo.lat},${event.data.geo.lng}`
                if (!locs[key]) {
                    locs[key] = {
                        lat: parseFloat(event.data.geo.lat),
                        lng: parseFloat(event.data.geo.lng),
                        count: 0,
                        city: event.data.geo.city || "Unknown City",
                        country: event.data.geo.country || "Unknown",
                        lastActive: event.timestamp
                    }
                }
                locs[key].count += 1
                // Update last active if newer
                if (new Date(event.timestamp) > new Date(locs[key].lastActive)) {
                    locs[key].lastActive = event.timestamp
                }
            }
        })

        return Object.values(locs)
    }, [data])

    const sizeScale = scaleLinear()
        .domain([1, 20])
        .range([4, 12])

    return (
        <div className="w-full h-[400px] bg-card rounded-xl border border-border overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-lg font-bold">User Locations</h3>
                <p className="text-sm text-muted-foreground">Active & Past Sessions</p>
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 120, // Slightly zoomed out
                    center: [0, 20]     // Center on equator-ish
                }}
                className="w-full h-full"
            >
                <ZoomableGroup zoom={1}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="hsl(var(--muted))"
                                    stroke="hsl(var(--background))"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "hsl(var(--muted-foreground))", outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {locations.map((loc, i) => {
                        // Check if "active" (within last 15 mins)
                        const isActive = (new Date().getTime() - new Date(loc.lastActive).getTime()) < 15 * 60 * 1000;

                        return (
                            <Marker key={i} coordinates={[loc.lng, loc.lat]}>
                                <circle
                                    r={sizeScale(loc.count)}
                                    fill={isActive ? "#10b981" : "hsl(var(--primary))"} // Green for active, Primary for past
                                    stroke="hsl(var(--background))"
                                    strokeWidth={2}
                                    className="cursor-pointer transition-all hover:opacity-80"
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={`${loc.city}, ${loc.country} (${loc.count})`}
                                >
                                    {isActive && (
                                        <animate
                                            attributeName="r"
                                            from={sizeScale(loc.count)}
                                            to={sizeScale(loc.count) + 4}
                                            dur="1.5s"
                                            repeatCount="indefinite"
                                            begin="0s"
                                            calcMode="spline"
                                            keyTimes="0;1"
                                            keySplines="0.4 0 0.2 1"
                                            values={`${sizeScale(loc.count)};${sizeScale(loc.count) * 1.5}`}
                                        />
                                    )}
                                    {isActive && (
                                        <animate
                                            attributeName="opacity"
                                            from="1"
                                            to="0"
                                            dur="1.5s"
                                            repeatCount="indefinite"
                                        />
                                    )}
                                </circle>
                                {/* Static circle on top so user can hover easily while animation plays */}
                                <circle
                                    r={sizeScale(loc.count)}
                                    fill={isActive ? "#10b981" : "hsl(var(--primary))"}
                                    stroke="hsl(var(--background))"
                                    strokeWidth={2}
                                />
                                <title>{`${loc.city}, ${loc.country} • ${loc.count} sessions • Last active: ${new Date(loc.lastActive).toLocaleTimeString()}`}</title>
                            </Marker>
                        )
                    })}
                </ZoomableGroup>
            </ComposableMap>
        </div>
    )
}
