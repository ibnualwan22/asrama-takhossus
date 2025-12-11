// src/app/dashboard/posts/page.tsx
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { Newspaper, Plus, Trash2, Calendar, Edit, Filter } from "lucide-react"
import { deletePost } from "@/app/actions/post"

const prisma = new PrismaClient()

// Tambahkan prop searchParams
export default async function PostsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const params = await searchParams
  const category = params?.category || 'ALL'

  // Logic Filter Database
  const whereCondition = category !== 'ALL' ? { type: category } : {}

  const posts = await prisma.post.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' }
  })

  // Daftar Tab Filter
  const tabs = [
    { label: 'Semua', value: 'ALL' },
    { label: 'Artikel', value: 'ARTICLE' },
    { label: 'Berita', value: 'NEWS' },
    { label: 'Pengumuman', value: 'ANNOUNCEMENT' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 text-orange-700 rounded-lg">
             <Newspaper size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Artikel & Berita</h1>
            <p className="text-gray-500 text-sm font-medium">Kelola publikasi website</p>
          </div>
        </div>
        
        <Link 
          href="/dashboard/posts/create" 
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Tulis Baru
        </Link>
      </div>

      {/* --- FILTER TABS --- */}
      <div className="flex overflow-x-auto pb-2 gap-2">
        {tabs.map((tab) => {
          const isActive = category === tab.value
          return (
            <Link
              key={tab.value}
              href={`/dashboard/posts?category=${tab.value}`}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Grid Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow group">
            {/* Thumbnail */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {post.thumbnail ? (
                <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">No Image</div>
              )}
              {/* Badge Kategori di Pojok */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800 uppercase shadow-sm border border-white/50">
                {post.type}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Calendar size={14} />
                {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                {post.content}
              </p>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                {/* TOMBOL EDIT */}
                <Link 
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"
                >
                  <Edit size={16} /> Edit
                </Link>

                {/* TOMBOL HAPUS */}
                <form action={deletePost.bind(null, post.id)}>
                   <button className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1">
                     <Trash2 size={16} /> Hapus
                   </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="col-span-3 text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada konten untuk kategori ini.</p>
            {category !== 'ALL' && (
              <Link href="/dashboard/posts" className="text-blue-600 font-bold text-sm mt-2 block hover:underline">
                Reset Filter
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}