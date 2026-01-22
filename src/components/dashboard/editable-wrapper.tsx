"use client";

import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface EditableWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: string;
    helperText?: string;
    isDirty?: boolean;
}

export function EditableWrapper({
    children,
    className,
    label,
    helperText,
    isDirty,
    ...props
}: EditableWrapperProps) {
    return (
        <div
            className={cn(
                "group relative rounded-lg border border-transparent hover:border-dashed hover:border-primary/40 transition-all duration-200 p-2 -m-2",
                isDirty && "border-yellow-500/50 hover:border-yellow-500 bg-yellow-500/5",
                className
            )}
            {...props}
        >
            {/* Label Badge (Visible on Hover) */}
            {label && (
                <div className="absolute -top-3 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="flex items-center gap-1.5 bg-background border border-primary/20 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider text-muted-foreground shadow-sm">
                        <span>Edit: {label}</span>
                    </div>
                </div>
            )}

            {/* Helper Text (Visible on Hover if provided) */}
            {helperText && (
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-background/90 backdrop-blur px-2 py-1 rounded border border-border text-[10px] text-muted-foreground max-w-[200px]">
                        {helperText}
                    </div>
                </div>
            )}

            {/* Dirty Indicator */}
            {isDirty && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-500 animate-pulse pointer-events-none" />
            )}

            {children}
        </div>
    );
}
