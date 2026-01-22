"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Smartphone, Tablet, Monitor, RotateCcw, ExternalLink } from "lucide-react"

interface LivePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LivePreviewModal({ isOpen, onClose }: LivePreviewModalProps) {
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [key, setKey] = useState(0); // Used to force reload iframe

    // Device dimensions configuration
    const devices = {
        desktop: { width: '100%', height: '100%', label: 'Desktop' },
        tablet: { width: '768px', height: '100%', label: 'Tablet' }, // iPad Mini ish
        mobile: { width: '375px', height: '100%', label: 'Mobile' }  // iPhone SE ish
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center isolate">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-[95vw] h-[90vh] bg-zinc-950 border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Toolbar */}
                        <div className="h-14 border-b border-white/10 bg-zinc-900 px-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Live Preview
                                </span>
                                <div className="h-4 w-px bg-white/10" />

                                {/* Device Toggles */}
                                <div className="flex bg-black/50 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('desktop')}
                                        className={`p-2 rounded transition-all ${viewMode === 'desktop' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        title="Desktop"
                                    >
                                        <Monitor size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('tablet')}
                                        className={`p-2 rounded transition-all ${viewMode === 'tablet' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        title="Tablet"
                                    >
                                        <Tablet size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('mobile')}
                                        className={`p-2 rounded transition-all ${viewMode === 'mobile' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        title="Mobile"
                                    >
                                        <Smartphone size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setKey(k => k + 1)}
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                    title="Reload"
                                >
                                    <RotateCcw size={16} />
                                </button>
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <div className="h-4 w-px bg-white/10" />
                                <button
                                    onClick={onClose}
                                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden relative">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{
                                    backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
                                    backgroundSize: '20px 20px'
                                }}
                            />

                            {/* Iframe Container */}
                            <div
                                className="bg-white transition-all duration-300 ease-in-out shadow-2xl relative"
                                style={{
                                    width: devices[viewMode].width,
                                    height: viewMode === 'desktop' ? '100%' : '90%', // Add some breathing room for non-desktop
                                    borderRadius: viewMode === 'desktop' ? 0 : 16,
                                    border: viewMode === 'desktop' ? 'none' : '1px solid #333'
                                }}
                            >
                                <iframe
                                    key={key}
                                    src="/"
                                    className="w-full h-full bg-white"
                                    style={{
                                        borderRadius: viewMode === 'desktop' ? 0 : 15
                                    }}
                                    title="Live Preview"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
