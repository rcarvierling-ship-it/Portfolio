"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Check, AlertCircle, Loader2 } from "lucide-react"

export type ToastType = 'success' | 'error' | 'loading' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(2);
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

function ToastItem({ message, type, onClose }: Toast & { onClose: () => void }) {
    const icons = {
        success: <Check size={16} className="text-green-500" />,
        error: <AlertCircle size={16} className="text-red-500" />,
        loading: <Loader2 size={16} className="text-blue-500 animate-spin" />,
        info: <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto bg-background/80 backdrop-blur-md text-foreground border border-border shadow-2xl rounded-xl px-4 py-3 flex items-center gap-3 min-w-[300px]"
        >
            <div className="p-2 rounded-full bg-secondary/50">
                {icons[type]}
            </div>
            <span className="text-sm font-medium flex-1">{message}</span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
            </button>
        </motion.div>
    )
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}
