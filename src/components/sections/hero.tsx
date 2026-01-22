import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown } from "lucide-react"
import Link from "next/link"
import { TextReveal } from "@/components/animations/text-reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { ParallaxGrid } from "@/components/ui/parallax-grid"

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

    return (
        <section
            ref={ref}
            className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-20 overflow-hidden"
        >
            {/* Ambient Parallax Grid Background */}
            <motion.div
                className="absolute inset-0 z-[-1]"
                style={{ y: backgroundY, opacity }}
            >
                {images && images.length > 0 && (
                    <ParallaxGrid images={images} />
                )}
            </motion.div>

            <div className="flex flex-col items-center gap-8 max-w-4xl text-center z-10 w-full relative">
                {/* Technical Decorators */}
                <div className="absolute -top-12 left-0 hidden md:block">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-60">
                        <span className="w-2 h-2 rounded-full border border-current" />
                        <span>_SYS_ONLINE</span>
                    </div>
                </div>

                <div className="absolute -top-12 right-0 hidden md:block">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-60">
                        <span>v3.0.4-RC</span>
                        <span className="w-2 h-2 bg-green-500/50 rounded-full animate-pulse" />
                    </div>
                </div>

                <TextReveal
                    text={title}
                    className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tighter justify-center px-4"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl text-center px-4 font-light"
                >
                    {description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto px-6 sm:px-0"
                >
                    <Link href="/work" className="w-full sm:w-auto">
                        <MagneticButton className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-colors">
                            _ENTER_SYSTEM
                        </MagneticButton>
                    </Link>
                    <Link href="/contact" className="w-full sm:w-auto">
                        <MagneticButton className="w-full sm:w-auto px-8 py-4 border border-input bg-background/50 backdrop-blur-sm hover:bg-muted text-foreground rounded-full text-lg font-medium">
                            <span className="font-mono text-sm mr-2">[01]</span> Contact
                        </MagneticButton>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono opacity-50">_Initialize_Scroll</span>
                    <motion.div
                        className="h-12 w-[1px] bg-gradient-to-b from-muted-foreground/0 via-muted-foreground/50 to-muted-foreground/0"
                        animate={{ scaleY: [0.5, 1.5, 0.5], opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                </div>
            </motion.div>
        </section >
    )
}
