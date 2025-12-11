// src/app/dashboard/gallery/page.tsx
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { Image as ImageIcon, Plus, FolderOpen } from "lucide-react"
import DeleteAlbumButton from "./_components/DeleteAlbumButton" // <--- Import Komponen Baru

const prisma = new PrismaClient()

export default async function GalleryPage() {
  const albums = await prisma.gallery.findMany({
    include: {
      _count: {
        select: { items: true }
      },
      items: {
        where: { type: 'PHOTO' },
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { date: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-100 text-pink-700 rounded-lg">
             <ImageIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Galeri Kegiatan</h1>
            <p className="text-gray-500 text-sm font-medium">Kumpulan album foto & video</p>
          </div>
        </div>
        
        <Link 
          href="/dashboard/gallery/create" 
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Buat Album
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            <Link href={`/dashboard/gallery/${album.id}`} className="block relative h-48 bg-gray-100 overflow-hidden">
              {album.items[0] ? (
                <img 
                  src={album.items[0].url} 
                  alt={album.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <FolderOpen size={48} className="opacity-50 mb-2" />
                  <span className="text-xs font-bold">Album Kosong</span>
                </div>
              )}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
                {album._count.items} Item
              </div>
            </Link>

            <div className="p-4 flex justify-between items-start">
              <Link href={`/dashboard/gallery/${album.id}`} className="flex-1">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {album.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {album.description || "Tidak ada deskripsi"}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(album.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </Link>

              {/* GUNAKAN KOMPONEN BARU DISINI */}
              <DeleteAlbumButton id={album.id} />
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}