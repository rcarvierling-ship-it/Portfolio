"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Archive, FileText, Briefcase, Image as ImageIcon, Settings, ArrowRight, Layers, ZoomIn, ZoomOut } from "lucide-react"
import { Project, Page, SiteSettings, Photo } from "@/lib/types"

export function SystemMap() {
    // Data State
    const [nodes, setNodes] = useState<any[]>([]);
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [pagesRes, projectsRes, photosRes, globalRes] = await Promise.all([
                fetch('/api/pages'),
                fetch('/api/projects'),
                fetch('/api/photos'),
                fetch('/api/global')
            ]);

            const pages: Page[] = await pagesRes.json();
            const projects: Project[] = await projectsRes.json();
            const photos: Photo[] = await photosRes.json();
            const settings: SiteSettings = await globalRes.json();

            // Build Graph
            const newNodes: any[] = [];
            const newLinks: any[] = [];

            // Layer 1: Root / Application
            newNodes.push({ id: 'root', type: 'root', label: 'Application Root', x: 50, y: 300 });

            // Layer 2: Settings & Global
            newNodes.push({ id: 'settings', type: 'settings', label: 'Global Config', x: 300, y: 150 });
            newLinks.push({ source: 'root', target: 'settings' });

            // Layer 2: Content Types
            const pageStartY = 100;
            pages.forEach((page, i) => {
                const id = `page-${page.id}`;
                newNodes.push({ id, type: 'page', label: page.title, x: 300, y: 300 + (i * 80) });
                newLinks.push({ source: 'root', target: id });

                // Link Page to Assets
                // Simple regex or structured check
                const contentStr = JSON.stringify(page);
                photos.forEach(photo => {
                    if (contentStr.includes(photo.url) || contentStr.includes(photo.id)) {
                        // We don't want to clutter, so maybe we group assets or only show significant ones?
                        // Let's create an "Asset Group" node for the page if it uses media
                        const assetGroupId = `assets-${page.id}`;
                        // Check if we already added a link for this page to media?
                        // For visual simplicity, let's link directly to "Media Library" node? 
                        // Or create specific nodes for heavily used images?
                        // Let's create a specialized node for the photo if strictly needed, otherwise skip to avoid node explosion.
                        // BETTER: Link Page -> Asset Node (Layer 3)
                        // Only show assets that are used.
                        const assetNodeId = `asset-${photo.id}`;
                        if (!newNodes.find(n => n.id === assetNodeId)) {
                            // Determine Y dynamically later? For now, we push to array and process layout later
                            newNodes.push({ id: assetNodeId, type: 'asset', label: 'Image', thumbnail: photo.url, x: 600, y: 0 }); // Y will be fixed
                        }
                        newLinks.push({ source: id, target: assetNodeId });
                    }
                });
            });

            const projectStartY = newNodes[newNodes.length - 1].y + 100;
            projects.forEach((proj, i) => {
                const id = `project-${proj.id}`;
                newNodes.push({ id, type: 'project', label: proj.title, x: 300, y: projectStartY + (i * 80) });
                newLinks.push({ source: 'root', target: id });

                // Check usage
                const contentStr = JSON.stringify(proj);
                photos.forEach(photo => {
                    if (contentStr.includes(photo.url) || contentStr.includes(photo.id)) {
                        const assetNodeId = `asset-${photo.id}`;
                        if (!newNodes.find(n => n.id === assetNodeId)) {
                            newNodes.push({ id: assetNodeId, type: 'asset', label: 'Image', thumbnail: photo.url, x: 600, y: 0 });
                        }
                        newLinks.push({ source: id, target: assetNodeId });
                    }
                });
            });

            // Post-process Layout for Layer 3 (Assets)
            const assets = newNodes.filter(n => n.type === 'asset');
            const totalAssetHeight = assets.length * 60;
            const startY = 300 - (totalAssetHeight / 2); // Center vertically roughly
            assets.forEach((node, i) => {
                node.y = startY + (i * 60);
            });

            setNodes(newNodes);
            setLinks(newLinks);
            setLoading(false);

        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <div className="h-full min-h-screen bg-[#0a0a0a] text-white p-8 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-8 z-10 relative">
                <div>
                    <h1 className="text-2xl font-bold font-mono tracking-tight flex items-center gap-2">
                        <Layers className="text-blue-500" />
                        SYSTEM_ID: ARCHITECTURE
                    </h1>
                    <p className="text-xs text-white/40 font-mono mt-1">Dependency Visualization V1.0</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 bg-white/5 rounded hover:bg-white/10"><ZoomOut size={16} /></button>
                    <span className="text-xs font-mono w-12 text-center">{(scale * 100).toFixed(0)}%</span>
                    <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 bg-white/5 rounded hover:bg-white/10"><ZoomIn size={16} /></button>
                </div>
            </div>

            <div className="flex-1 border border-white/10 rounded-xl bg-black relative overflow-auto custom-scrollbar shadow-inner">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 font-mono animate-pulse">
                        SCANNING SYSTEM ARCHITECTURE...
                    </div>
                ) : (
                    <div
                        className="absolute top-0 left-0 min-w-full min-h-full p-20 origin-top-left transition-transform duration-200"
                        style={{ transform: `scale(${scale})`, width: 2000, height: Math.max(1000, nodes.length * 60) }}
                    >
                        <svg className="absolute inset-0 pointer-events-none w-full h-full">
                            {links.map((link, i) => {
                                const source = nodes.find(n => n.id === link.source);
                                const target = nodes.find(n => n.id === link.target);
                                if (!source || !target) return null;

                                return (
                                    <motion.path
                                        key={i}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.2 }}
                                        transition={{ duration: 1, delay: i * 0.05 }}
                                        d={`M ${source.x + 200} ${source.y + 25} C ${source.x + 300} ${source.y + 25}, ${target.x - 100} ${target.y + 25}, ${target.x} ${target.y + 25}`}
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="1"
                                    />
                                );
                            })}
                        </svg>

                        {nodes.map((node, i) => (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.02 }}
                                className="absolute w-[200px] h-[50px] bg-[#111] border border-white/10 rounded-lg flex items-center p-2 gap-3 hover:border-blue-500/50 hover:bg-[#151515] transition-colors z-10 group"
                                style={{ left: node.x, top: node.y }}
                            >
                                <div className={`w-8 h-8 rounded flex items-center justify-center bg-black/50 border border-white/5 shrink-0 group-hover:border-blue-500/30 transition-colors`}>
                                    {node.type === 'root' && <Archive size={14} className="text-white/50" />}
                                    {node.type === 'settings' && <Settings size={14} className="text-orange-500" />}
                                    {node.type === 'page' && <FileText size={14} className="text-purple-500" />}
                                    {node.type === 'project' && <Briefcase size={14} className="text-blue-500" />}
                                    {node.type === 'asset' && (
                                        node.thumbnail ?
                                            <img src={node.thumbnail} className="w-full h-full object-cover rounded opacity-80" alt="" /> :
                                            <ImageIcon size={14} className="text-pink-500" />
                                    )}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[10px] uppercase text-white/30 font-bold leading-none mb-1">{node.type}</span>
                                    <span className="text-xs font-mono truncate text-white/80">{node.label}</span>
                                </div>

                                {/* Connection Points */}
                                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-black border border-white/20 rounded-full" />
                                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-black border border-white/20 rounded-full" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
