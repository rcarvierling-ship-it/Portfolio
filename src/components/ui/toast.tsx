"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react"
import { useEffect, useState } from "react"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastProps {
    id: string
    type: ToastType
    title: string
    description?: string
    duration?: number
    onClose: (id: string) => void
}

export function Toast({ id, type, title, description, duration = 4000, onClose }: ToastProps) {
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev - (100 / (duration / 50))
                if (newProgress <= 0) {
                    clearInterval(interval)
                    // Defer the onClose call to avoid updating parent during render
                    setTimeout(() =>  onClose(id), 0)
                    return 0
                }
                return newProgress
            })
        }, 50)

        return () => clearInterval(interval)
    }, [duration, id, onClose])

    const icons = {
        success: CheckCircle2,
        error: XCircle,
        warning: AlertCircle,
        info: Info,
    }

    const colors = {
        success: "from-green-500/20 to-emerald-500/20 border-green-500/50",
        error: "from-red-500/20 to-rose-500/20 border-red-500/50",
        warning: "from-yellow-500/20 to-orange-500/20 border-yellow-500/50",
        info: "from-blue-500/20 to-cyan-500/20 border-blue-500/50",
    }

    const iconColors = {
        success: "text-green-500",
        error: "text-red-500",
        warning: "text-yellow-500",
        info: "text-blue-500",
    }

    const progressColors = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500",
    }

    const Icon = icons[type]

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`relative overflow-hidden rounded-xl border bg-gradient-to-br backdrop-blur-md shadow-2xl ${colors[type]} bg-black/80 min-w-[320px] max-w-[420px]`}
        >
            <div className="p-4 flex items-start gap-3">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
                    className={iconColors[type]}
                >
                    <Icon size={24} />
                </motion.div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm mb-0.5">{title}</h4>
                    {description && (
                        <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
                    )}
                </div>
                <button
                    onClick={() => onClose(id)}
                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-white/10">
                <motion.div
                    className={`h-full ${progressColors[type]}`}
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.05, ease: "linear" }}
                />
            </div>
        </motion.div>
    )
}

export interface ToastContainerProps {
    toasts: ToastProps[]
    onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast {...toast} onClose={onClose} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    )
}
