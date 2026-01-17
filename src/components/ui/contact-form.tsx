"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Check, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ContactForm() {
    const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("submitting");

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFormState("success");
    };

    return (
        <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
                {formState === "success" ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-8 text-center bg-secondary/50 rounded-2xl border border-border"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4">
                            <Check size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground">I'll get back to you as soon as possible.</p>
                        <button
                            onClick={() => setFormState("idle")}
                            className="mt-6 text-sm text-primary underline"
                        >
                            Send another message
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                            <input
                                required
                                type="text"
                                id="name"
                                className="px-4 py-3 rounded-lg bg-secondary/30 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input
                                required
                                type="email"
                                id="email"
                                className="px-4 py-3 rounded-lg bg-secondary/30 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <textarea
                                required
                                id="message"
                                rows={4}
                                className="px-4 py-3 rounded-lg bg-secondary/30 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                                placeholder="Tell me about your project..."
                            />
                        </div>

                        <MagneticButton
                            type="submit"
                            disabled={formState === "submitting"}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-full font-medium flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                        >
                            {formState === "submitting" ? (
                                <>
                                    <Loader2 className="animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    Send Message <Send size={16} />
                                </>
                            )}
                        </MagneticButton>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}
