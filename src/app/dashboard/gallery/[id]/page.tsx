// src/app/dashboard/gallery/[id]/page.tsx
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, FolderOpen } from "lucide-react"
import AddMediaForm from "../_components/AddMediaForm"
import DeleteMediaButton from "../_components/DeleteMediaButton"

const prisma = new PrismaClient()

// Helper untuk ambil ID YouTube dari URL
function getYouTubeEmbedUrl(url: string) {
  let videoId = ''
  // Support format: youtu.be/ID atau youtube.com/watch?v=ID
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  
  if (match && match[1]) {
    videoId = match[1]
    return `https://www.youtube.com/embed/${videoId}`
  }
  return null
}

export default async function AlbumDetailPage({ params }: { params: { id: string } }) {
  // Await params di Next.js 15
  const { id } = await params

  const album = await prisma.gallery.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!album) notFound()

  return (
    <div className="space-y-6">
      {/* Tombol Kembali */}
      <Link href="/dashboard/gallery" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-bold transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Kembali ke Galeri
      </Link>

      {/* Header Album */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{album.title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar size={16} />
          {new Date(album.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          <span className="mx-2">•</span>
          <span className="font-bold text-blue-600">{album.items.length} Item</span>
        </div>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          {album.description || "Tidak ada deskripsi."}
        </p>
      </div>

      {/* Form Tambah Media */}
      <AddMediaForm albumId={album.id} />

      {/* Grid Galeri */}
      {album.items.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Album ini masih kosong.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.items.map((item) => (
            <div key={item.id} className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-sm aspect-square hover:shadow-md transition-all">
              
              {/* JIKA FOTO */}
              {item.type === 'PHOTO' && (
                <img 
                  src={item.url} 
                  alt="Gallery Item" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              )}

              {/* JIKA VIDEO (Embed YouTube) */}
              {item.type === 'VIDEO' && (
                <div className="w-full h-full bg-black">
                   {getYouTubeEmbedUrl(item.url) ? (
                     <iframe 
                       src={getYouTubeEmbedUrl(item.url)!} 
                       className="w-full h-full"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                       allowFullScreen
                     />
                   ) : (
                     <div className="flex items-center justify-center h-full text-white text-xs p-2 text-center">Link Video Rusak</div>
                   )}
                </div>
              )}

              {/* Tombol Hapus (Muncul saat Hover) */}
              <DeleteMediaButton id={item.id} albumId={album.id} />
              
              {/* Badge Tipe */}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-sm pointer-events-none">
                {item.type === 'VIDEO' ? 'VIDEO' : 'FOTO'}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}