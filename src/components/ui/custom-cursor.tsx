"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
    const [isHoveringLink, setIsHoveringLink] = useState(false)
    const [viewText, setViewText] = useState("")

    // Mouse position
    const mouseX = useMotionValue(-100)
    const mouseY = useMotionValue(-100)

    // Smooth physics
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
    const cursorX = useSpring(mouseX, springConfig)
    const cursorY = useSpring(mouseY, springConfig)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement

            // Check for magnetism or pointer interaction
            const isClickable = target.closest("button") ||
                target.closest("a") ||
                target.closest("[data-magnet='true']") ||
                target.tagName === "BUTTON" ||
                target.tagName === "A"

            setIsHoveringLink(!!isClickable)

            // Check for custom cursor text
            const cursorTextElement = target.closest("[data-cursor]") as HTMLElement
            if (cursorTextElement) {
                setViewText(cursorTextElement.getAttribute("data-cursor") || "")
            } else {
                setViewText("")
            }
        }

        window.addEventListener("mousemove", moveCursor)
        window.addEventListener("mouseover", handleMouseOver)

        return () => {
            window.removeEventListener("mousemove", moveCursor)
            window.removeEventListener("mouseover", handleMouseOver)
        }
    }, [mouseX, mouseY])

    // Hide on touch devices or if not safe
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null

    return (
        <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center mix-blend-difference"
            style={{
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%"
            }}
        >
            <motion.div
                className="bg-white rounded-full flex items-center justify-center text-black font-bold text-[10px] tracking-wider"
                animate={{
                    width: viewText ? 80 : isHoveringLink ? 20 : 12,
                    height: viewText ? 80 : isHoveringLink ? 20 : 12,
                    opacity: 1
                }}
            >
                {viewText && (
                    <span className="opacity-100">{viewText}</span>
                )}
            </motion.div>
        </motion.div>
    )
}
