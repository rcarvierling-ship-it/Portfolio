"use client"

import { useMemo, useState } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { scaleSqrt } from "d3-scale"
import { AnalyticsEvent } from "@/lib/types"
import { Info, Layers, Minus, Plus } from "lucide-react"

// GeoURL for world map topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface UserMapProps {
    data: AnalyticsEvent[]
}

export function UserMap({ data }: UserMapProps) {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
    const [zoom, setZoom] = useState(1);
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    // Process data to group by rounded location buckets (approx 111km precision)
    const locations = useMemo(() => {
        const locs: Record<string, { lat: number, lng: number, count: number, activeCount: number, city: string, country: string, lastActive: string, isCluster: boolean, events: AnalyticsEvent[] }> = {}
        const now = new Date().getTime();
        const ACTIVE_THRESHOLD = 15 * 60 * 1000; // 15 mins

        data.forEach(event => {
            if (event.data?.geo?.lat && event.data?.geo?.lng) {
                // Determine if event is "active"
                const eventTime = new Date(event.timestamp).getTime();
                const isActive = (now - eventTime) < ACTIVE_THRESHOLD;

                if (showActiveOnly && !isActive) return;

                // Round coordinates to create buckets (1.0 degree ~ 111km)
                // This clusters users from the same city/region effectively
                const lat = Math.round(parseFloat(event.data.geo.lat) * 1) / 1;
                const lng = Math.round(parseFloat(event.data.geo.lng) * 1) / 1;
                const key = `${lat},${lng}`;

                if (!locs[key]) {
                    locs[key] = {
                        lat,
                        lng,
                        count: 0,
                        activeCount: 0,
                        // Use the most precise available location name for the cluster
                        city: event.data.geo.city ? decodeURIComponent(event.data.geo.city) : "Unknown Region",
                        country: event.data.geo.country ? decodeURIComponent(event.data.geo.country) : "Unknown",
                        lastActive: event.timestamp,
                        isCluster: true,
                        events: []
                    }
                }

                locs[key].count += 1;
                if (isActive) locs[key].activeCount += 1;
                locs[key].events.push(event);

                // Update last active if newer
                if (eventTime > new Date(locs[key].lastActive).getTime()) {
                    locs[key].lastActive = event.timestamp;
                }
            }
        })

        // Sort events within each cluster by time desc
        Object.values(locs).forEach(loc => {
            loc.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        });

        return locs
    }, [data, showActiveOnly])

    // Scale marker size based on count (Square Root scale for better distribution)
    const maxCount = Math.max(...Object.values(locations).map(l => l.count), 1);
    const sizeScale = scaleSqrt()
        .domain([0, maxCount]) // Start at 0 to handle empty states gracefully
        .range([4, 24])        // Clamp between 4px and 24px
        .clamp(true);

    const selectedData = selectedLocation ? locations[selectedLocation] : null;

    return (
        <div className="w-full h-[500px] bg-[#0c121c] rounded-xl border border-border/50 overflow-hidden relative flex flex-col shadow-2xl group">

            {/* Header / Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <h3 className="text-lg font-bold text-white drop-shadow-md">Global Audience</h3>
                    <div className="flex items-center gap-2 text-xs text-white/70">
                        <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {Object.values(locations).reduce((acc, curr) => acc + curr.activeCount, 0)} Active
                        </span>
                        <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            {Object.values(locations).reduce((acc, curr) => acc + curr.count, 0)} Total
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 pointer-events-auto">
                    <button
                        onClick={() => setShowActiveOnly(!showActiveOnly)}
                        className={`p-2 rounded-lg border backdrop-blur-md transition-all ${showActiveOnly ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-black/40 border-white/10 text-white/60 hover:text-white'}`}
                        title="Toggle Active Only"
                    >
                        <Layers size={18} />
                    </button>
                    <div className="flex flex-col bg-black/40 rounded-lg border border-white/10 backdrop-blur-md overflow-hidden">
                        <button onClick={() => setZoom(z => Math.min(z * 1.5, 8))} className="p-2 hover:bg-white/10 transition-colors text-white/70"><Plus size={18} /></button>
                        <button onClick={() => setZoom(z => Math.max(z / 1.5, 1))} className="p-2 hover:bg-white/10 transition-colors text-white/70"><Minus size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none z-[5] bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

            {/* Map Container */}
            <div className="flex-1 w-full h-full cursor-move bg-[#09090b]">
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 140, // Slightly zoomed out default
                    }}
                    className="w-full h-full"
                    onClick={() => setSelectedLocation(null)}
                >
                    <ZoomableGroup
                        zoom={zoom}
                        onMoveEnd={({ zoom }: { zoom: number }) => setZoom(zoom)}
                        minZoom={1}
                        maxZoom={8}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        // High contrast styling
                                        fill="#1c1c1c"
                                        stroke="#333"
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none" },
                                            hover: { fill: "#2a2a2a", outline: "none", transition: "all 0.3s" },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>

                        {Object.entries(locations).map(([key, loc], i) => {
                            const isSelected = selectedLocation === key;
                            const hasActive = loc.activeCount > 0;

                            // Color logic: Green if active users present, Blue if only past
                            const color = hasActive ? "#10b981" : "#3b82f6";
                            const radius = sizeScale(loc.count);

                            return (
                                <Marker
                                    key={key}
                                    coordinates={[loc.lng, loc.lat]}
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        setSelectedLocation(key);
                                    }}
                                >
                                    {/* Pulse effect for active clusters */}
                                    {hasActive && (
                                        <circle
                                            r={radius}
                                            fill={color}
                                            className="animate-ping opacity-75"
                                            style={{ animationDuration: '3s' }}
                                        />
                                    )}

                                    {/* Main Marker */}
                                    <g className="cursor-pointer group/marker transition-all duration-500 ease-spring">
                                        <circle
                                            r={radius}
                                            fill={color}
                                            fillOpacity={0.8}
                                            stroke={isSelected ? "#fff" : color}
                                            strokeWidth={isSelected ? 2 : 1}
                                            strokeOpacity={isSelected ? 1 : 0.5}
                                            className="transition-all duration-300 hover:fill-opacity-100 hover:stroke-white/50"
                                        />

                                        {/* Count Label (only visible on large markers or selected) */}
                                        {(radius > 8 || isSelected) && (
                                            <text
                                                textAnchor="middle"
                                                y={radius + 12}
                                                style={{ fontSize: '8px', fill: 'white', fontWeight: 'bold', textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}
                                                className="pointer-events-none opacity-0 group-hover/marker:opacity-100 transition-opacity"
                                            >
                                                {loc.city}
                                            </text>
                                        )}
                                    </g>
                                </Marker>
                            )
                        })}
                    </ZoomableGroup>
                </ComposableMap>
            </div>

            {/* Side Panel for Details */}
            {selectedData && (
                <div className="absolute right-4 bottom-4 z-20 w-64 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-4 animate-in slide-in-from-right-10 fade-in duration-300">
                    <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
                        <div>
                            <h4 className="font-bold text-white text-sm">{selectedData.city}</h4>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">{selectedData.country}</p>
                        </div>
                        <button onClick={() => setSelectedLocation(null)} className="text-white/50 hover:text-white"><Minus size={14} className="rotate-45" /></button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-white/70">Total Sessions</span>
                            <span className="font-bold text-white">{selectedData.count}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-emerald-400">Active Now</span>
                            <span className="font-bold text-emerald-400">{selectedData.activeCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-white/70">Last Seen</span>
                            <span className="text-white">{new Date(selectedData.lastActive).toLocaleTimeString()}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 max-h-[150px] overflow-y-auto custom-scrollbar">
                        <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Recent Events</p>
                        <div className="space-y-2">
                            {selectedData.events.slice(0, 5).map(e => (
                                <div key={e.id} className="text-[10px] flex justify-between items-center text-white/80">
                                    <span className="truncate max-w-[120px] opacity-70">{e.path}</span>
                                    <span className="opacity-50">{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="absolute left-4 bottom-4 z-10 p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] text-white/70 flex flex-col gap-1.5 pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active (15m)
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Historical
                </div>
                <div className="flex items-center gap-2 mt-1 pt-1 border-t border-white/10">
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-white/50" />
                        <div className="w-2 h-2 rounded-full bg-white/50" />
                        <div className="w-3 h-3 rounded-full bg-white/50" />
                    </div>
                    <span>Size = Volume</span>
                </div>
            </div>
        </div>
    )
}

