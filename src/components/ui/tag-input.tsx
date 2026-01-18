"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
    placeholder?: string;
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    className?: string;
}

export function TagInput({ placeholder = "Add tag...", tags, onTagsChange, className }: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onTagsChange([...tags, trimmed]);
            setInputValue("");
        }
    };

    const removeTag = (index: number) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        onTagsChange(newTags);
    };

    return (
        <div className={cn("flex flex-wrap items-center gap-2 p-2 rounded-md border border-border bg-background focus-within:ring-1 focus-within:ring-ring", className)}>
            {tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                    {tag}
                    <button onClick={() => removeTag(index)} className="hover:text-red-500 focus:outline-none">
                        <X size={12} />
                    </button>
                </span>
            ))}
            <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-sm min-w-[80px]"
                placeholder={tags.length === 0 ? placeholder : ""}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
            />
        </div>
    )
}
