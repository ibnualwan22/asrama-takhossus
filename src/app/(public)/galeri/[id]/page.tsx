// src/app/(public)/galeri/[id]/page.tsx

import { getGalleryDetail } from "@/app/actions/public-data"
import LightboxClient from "./_components/LightboxClient" // Kita buat komponen client terpisah

export default async function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gallery = await getGalleryDetail(id)

  if (!gallery) return <div className="p-20 text-center">Album tidak ditemukan.</div>

  return (
    <div className="container mx-auto px-4 py-16">
       <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2">{gallery.title}</h1>
          <p className="text-gray-500">{gallery.description}</p>
          <p className="text-xs text-gray-400 mt-2">{new Date(gallery.date).toLocaleDateString()}</p>
       </div>

       {/* Kita lempar data foto ke Client Component untuk interaksi Lightbox */}
       <LightboxClient items={gallery.items} />
    </div>
  )
}