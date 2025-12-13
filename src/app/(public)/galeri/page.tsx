import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { Image as ImageIcon } from "lucide-react"

const prisma = new PrismaClient()
export const revalidate = 60

export const metadata = { title: "Galeri Kegiatan" }

export default async function GalleryPage() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { date: 'desc' },
    include: {
        items: { take: 1 },
        _count: { select: { items: true } }
    }
  })

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900">Galeri Album</h1>
          <p className="text-gray-500 mt-2 text-lg">Dokumentasi kegiatan dan kenangan santri.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {galleries.map((album) => (
             <Link key={album.id} href={`/galeri/${album.id}`} className="group block">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative mb-4 shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                    {album.items[0] ? (
                       <img src={album.items[0].url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={40}/></div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md">
                       {album._count.items} Foto
                    </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition leading-tight">
                   {album.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                   {new Date(album.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </p>
             </Link>
           ))}
        </div>

        {galleries.length === 0 && (
           <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
              Belum ada album galeri.
           </div>
        )}
      </div>
    </div>
  )
}