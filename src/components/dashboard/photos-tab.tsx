"use client"

import { useState, useEffect } from "react"
import { Reorder } from "framer-motion"
import { Image as ImageIcon, Trash2, Link as LinkIcon, Edit2, Clock } from "lucide-react"
import { Photo } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { HistoryModal } from "@/components/dashboard/history-modal"
import { ImageUploader } from "@/components/ui/image-uploader"
import { TagInput } from "@/components/ui/tag-input"
import { cn } from "@/lib/utils"

import { MediaLibrary } from "@/components/dashboard/media-library"

export function PhotosTab() {
    return <MediaLibrary />
}
