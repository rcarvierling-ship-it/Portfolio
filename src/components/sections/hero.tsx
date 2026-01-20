import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { ArrowDown } from "lucide-react"
import Link from "next/link"
import { TextReveal } from "@/components/animations/text-reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import Image from "next/image"

interface HeroProps {
    title: string;
    description: string;
    images?: string[];
}

export function Hero({ title, description, images }: HeroProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    // Mouse tracking for Lens Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    // Smooth spring animation for the lens movement so it doesn't feel jittery
    const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        }
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Default image if none provided
    const bgImage = images && images.length > 0 ? images[0] : "/uploads/hero-placeholder.jpg";
    // Note: User might need to upload an image first. I'll use a placeholder or rely on what's there. 
    // Ideally we should handle the case where no image is present gracefully (maybe fall back to gradient).

    // Mask logic: Use CSS mask-image to reveal the sharp layer
    // We update CSS variables via style or motion values for performance

    return (
        <section
            ref={ref}
            className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-20 overflow-hidden"
        >
            {/* Layer 1: Blurred, Dimmed Background (Always Visible) */}
            <motion.div
                className="absolute inset-0 z-[-2]"
                style={{ y: backgroundY, opacity }}
            >
                {bgImage && (
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={bgImage}
                            alt="Background"
                            fill
                            className="object-cover filter blur-[20px] scale-110 brightness-[0.4] grayscale-[0.3]"
                            priority
                        />
                    </div>
                )}
            </motion.div>

            {/* Layer 2: Sharp, Vivid Focus Layer (Revealed by Mask) */}
            <motion.div
                className="absolute inset-0 z-[-1]"
                style={{
                    y: backgroundY,
                    opacity,
                    WebkitMaskImage: useTransform(
                        [springX, springY],
                        ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, black, transparent 90%)`
                    ),
                    maskImage: useTransform(
                        [springX, springY],
                        ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, black, transparent 90%)`
                    )
                }}
            >
                {bgImage && (
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={bgImage}
                            alt="Background Focus"
                            fill
                            className="object-cover scale-110 brightness-110 contrast-110"
                            priority
                        />
                    </div>
                )}
            </motion.div>


            <div className="flex flex-col items-center gap-8 max-w-4xl text-center z-10 w-full pointer-events-none">
                {/* Pointer events none on container so mouse can pass through to track, but buttons need pointer-events-auto */}

                <div className="pointer-events-auto">
                    <TextReveal
                        text={title}
                        className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tighter justify-center px-4 mix-blend-overlay opacity-90"
                    />
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl text-center px-4 font-light tracking-wide pointer-events-auto"
                >
                    {description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto px-6 sm:px-0 pointer-events-auto"
                >
                    <Link href="/work" className="w-full sm:w-auto">
                        <MagneticButton className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-white/90 rounded-full text-lg font-medium transition-colors">
                            View Gallery
                        </MagneticButton>
                    </Link>
                    <Link href="/contact" className="w-full sm:w-auto">
                        <MagneticButton className="w-full sm:w-auto px-8 py-4 border border-white/20 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full text-lg font-medium transition-colors">
                            Contact Me
                        </MagneticButton>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ArrowDown size={20} />
                </motion.div>
            </motion.div>
        </section >
    )
}
