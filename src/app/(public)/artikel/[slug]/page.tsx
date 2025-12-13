import { getPostBySlug, getLatestPosts } from "@/app/actions/public-data"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Artikel Tidak Ditemukan' }
  return { title: post.title }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) notFound()

  // Ambil berita lain untuk sidebar (Rekomendasi)
  const otherPosts = await getLatestPosts(5)

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 mb-8 transition">
           <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* KONTEN UTAMA */}
           <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              
              {/* Gambar Utama */}
              {post.thumbnail && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                   <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                 <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {post.type}
                 </span>
                 <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                 </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
                 {post.title}
              </h1>

              {/* Isi Artikel (Render HTML) */}
              <div 
                className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
           </div>

           {/* SIDEBAR (Berita Lain) */}
           <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                 <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Berita Terbaru Lainnya</h3>
                 <div className="space-y-6">
                    {otherPosts.filter(p => p.id !== post.id).map((item) => (
                       <Link key={item.id} href={`/artikel/${item.slug}`} className="group flex gap-4 items-start">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                             <img src={item.thumbnail || '/placeholder.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-blue-600 transition">
                                {item.title}
                             </h4>
                             <p className="text-xs text-gray-400 mt-1">
                                {new Date(item.createdAt).toLocaleDateString()}
                             </p>
                          </div>
                       </Link>
                    ))}
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  )
}