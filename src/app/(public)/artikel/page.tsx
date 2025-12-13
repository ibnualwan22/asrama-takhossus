// src/app/(public)/artikel/page.tsx
import { PrismaClient } from "@prisma/client"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function ArtikelIndex() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Artikel & Berita</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/artikel/${post.slug}`} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden border">
             <div className="h-48 bg-gray-200 overflow-hidden">
                <img src={post.thumbnail || '/placeholder.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
             </div>
             <div className="p-6">
                <span className="text-xs font-bold text-blue-600 uppercase">{post.type}</span>
                <h2 className="text-xl font-bold mt-2 mb-2 group-hover:text-blue-600 transition">{post.title}</h2>
                <p className="text-gray-500 text-sm line-clamp-3">{post.content.replace(/<[^>]*>?/gm, '')}</p>
             </div>
          </Link>
        ))}
      </div>
    </div>
  )
}