import { getPhotos } from "@/lib/cms"
import { RecentPhotosClient } from "./recent-photos-client"

export async function RecentPhotos() {
    const photos = await getPhotos(false) // Only published
    const recentPhotos = photos.slice(0, 6) // Get 6 most recent

    if (recentPhotos.length === 0) return null

    return <RecentPhotosClient photos={recentPhotos} />
}
