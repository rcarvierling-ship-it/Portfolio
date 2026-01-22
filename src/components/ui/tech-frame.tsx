"use client";

import { cn } from "@/lib/utils";

interface TechFrameProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: string;
    cornerAccents?: boolean;
}

export function TechFrame({
    children,
    className,
    label,
    cornerAccents = false,
    ...props
}: TechFrameProps) {
    return (
        <div
            className={cn(
                "relative rounded-lg border border-dashed border-gray-400/20 p-6 transition-colors hover:border-gray-400/30",
                className
            )}
            {...props}
        >
            {/* Label */}
            {label && (
                <div className="absolute -top-3 left-4 bg-background px-2 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                    {label}
                </div>
            )}

            {/* Corner Accents */}
            {cornerAccents && (
                <>
                    <div className="absolute -left-[1px] -top-[1px] h-3 w-3 rounded-tl-lg border-l border-t border-gray-400/40" />
                    <div className="absolute -right-[1px] -top-[1px] h-3 w-3 rounded-tr-lg border-r border-t border-gray-400/40" />
                    <div className="absolute -bottom-[1px] -left-[1px] h-3 w-3 rounded-bl-lg border-b border-l border-gray-400/40" />
                    <div className="absolute -bottom-[1px] -right-[1px] h-3 w-3 rounded-br-lg border-b border-r border-gray-400/40" />
                </>
            )}

            {children}
        </div>
    );
}
