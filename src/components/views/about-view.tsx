"use client"

import { Gear, TimelineItem, AboutData } from "@/lib/types"
// ... imports ... (Keeping existing imports from client_view if possible, but defining fresh file content below is safer)
import { motion } from "framer-motion"
import Image from "next/image"
import { TextReveal } from "@/components/animations/text-reveal"

interface AboutViewProps {
    data: AboutData;
}

export function AboutView({ data }: AboutViewProps) {
    const { headline, bio, portrait, gear = [], timeline = [] } = data;

    return (
        {
            gearGroup.items.map(item => (
                <li key={item} className="text-sm text-muted-foreground border-b border-border/50 pb-1 last:border-0 last:pb-0">
                    {item}
                </li>
            ))
        }
                            </ul >
                        </motion.div >
                    ))
}
                </div >
            </section >

    {/* Timeline Section */ }
    < section className = "flex flex-col gap-8" >
                <h2 className="text-3xl font-bold">Journey</h2>
                <div className="border-l-2 border-border ml-3 pl-8 flex flex-col gap-12 relative">
                    {timeline.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-background border-4 border-primary" />
                            <span className="text-sm font-mono text-muted-foreground">{item.year}</span>
                            <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                            <h4 className="text-lg text-primary font-medium mb-2">{item.location}</h4>
                            <p className="text-muted-foreground max-w-2xl">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section >

        </div >
    )
}
