
import { cn } from "@/lib/utils";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    label?: string;
    iconOnly?: boolean;
}

export function AiButton({ loading, label = "AI Generate", iconOnly = false, className, ...props }: AiButtonProps) {
    return (
        <Button
            size={iconOnly ? "icon" : "sm"}
            variant="outline"
            className={cn(
                "group border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5 text-purple-400 hover:text-purple-300 transition-all",
                className
            )}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
            )}
            {!iconOnly && <span className="ml-2 font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300">{label}</span>}
        </Button>
    );
}
