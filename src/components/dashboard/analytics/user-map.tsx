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
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

    // Process data to group by location
    const locations = useMemo(() => {
        const locs: Record<string, { lat: number, lng: number, count: number, city: string, country: string, lastActive: string, events: AnalyticsEvent[] }> = {}

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
                        lastActive: event.timestamp,
                        events: []
                    }
                }
                locs[key].count += 1
                locs[key].events.push(event);
                // Update last active if newer
                if (new Date(event.timestamp) > new Date(locs[key].lastActive)) {
                    locs[key].lastActive = event.timestamp
                }
            }
        })

        // Sort events by time desc
        Object.values(locs).forEach(loc => {
            loc.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        });

        return locs
    }, [data])

    const sizeScale = scaleLinear()
        .domain([1, 20])
        .range([4, 12])

    const selectedData = selectedLocation ? locations[selectedLocation] : null;

    return (
        <div className="w-full h-[400px] bg-card rounded-xl border border-border overflow-hidden relative flex">
            {/* Map Container */}
            <div className="flex-1 relative h-full">
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <h3 className="text-lg font-bold">User Locations</h3>
                    <p className="text-sm text-muted-foreground">Active & Past Sessions</p>
                </div>

                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 120,
                        center: [0, 20]
                    }}
                    className="w-full h-full"
                    onClick={() => setSelectedLocation(null)} // Click background to deselect
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

                        {Object.entries(locations).map(([key, loc], i) => {
                            const isActive = (new Date().getTime() - new Date(loc.lastActive).getTime()) < 15 * 60 * 1000;
                            const isSelected = selectedLocation === key;

                            return (
                                <Marker
                                    key={i}
                                    coordinates={[loc.lng, loc.lat]}
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        setSelectedLocation(key);
                                    }}
                                >
                                    <circle
                                        r={sizeScale(loc.count)}
                                        fill={isActive ? "#10b981" : "hsl(var(--primary))"}
                                        stroke={isSelected ? "#ffffff" : "hsl(var(--background))"}
                                        strokeWidth={isSelected ? 3 : 2}
                                        className="cursor-pointer transition-all hover:opacity-80"
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
                                    <circle
                                        r={sizeScale(loc.count)}
                                        fill={isActive ? "#10b981" : "hsl(var(--primary))"}
                                        stroke={isSelected ? "#ffffff" : "hsl(var(--background))"}
                                        strokeWidth={isSelected ? 3 : 2}
                                        className="cursor-pointer"
                                    />
                                </Marker>
                            )
                        })}
                    </ZoomableGroup>
                </ComposableMap>
            </div>

            {/* Side Panel for Details */}
            {selectedData && (
                <div className="w-80 bg-card/95 backdrop-blur border-l border-border h-full absolute right-0 top-0 bottom-0 z-20 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
                    <div className="p-4 border-b border-border flex justify-between items-start bg-muted/50">
                        <div>
                            <h4 className="font-bold text-lg">{selectedData.city}</h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{selectedData.country}</p>
                        </div>
                        <button
                            onClick={() => setSelectedLocation(null)}
                            className="p-1 hover:bg-background rounded-full transition-colors"
                        >
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0">
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
                                <span>{selectedData.count} Session{selectedData.count !== 1 ? 's' : ''}</span>
                                <span>Last: {new Date(selectedData.lastActive).toLocaleTimeString()}</span>
                            </div>

                            {selectedData.events.map((event) => (
                                <div key={event.id} className="text-sm space-y-1 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${event.type === 'pageview' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                            {event.type}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[60px_1fr] gap-2 text-xs">
                                        <span className="text-muted-foreground font-medium">Path</span>
                                        <span className="font-mono text-foreground truncate" title={event.path}>{event.path}</span>

                                        <span className="text-muted-foreground font-medium">Device</span>
                                        <span className="text-foreground capitalize">{event.data?.device || "Desktop"}</span>

                                        <span className="text-muted-foreground font-medium">Session</span>
                                        <span className="font-mono text-[10px] text-muted-foreground truncate" title={event.sessionId}>{event.sessionId ? event.sessionId.slice(0, 8) : 'N/A'}...</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
