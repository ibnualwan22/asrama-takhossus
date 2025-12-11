// src/app/dashboard/posts/[id]/edit/page.tsx
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import EditPostForm from "./_components/EditPostForm" // Kita buat komponen form terpisah

const prisma = new PrismaClient()

export default async function EditPostPage({ params }: { params: { id: string } }) {
  // 1. Ambil data artikel berdasarkan ID dari URL
  // Note: di Next.js 15 params harus di-await
  const { id } = await params
  
  const post = await prisma.post.findUnique({
    where: { id }
  })

  // Jika tidak ketemu, tampilkan 404
  if (!post) {
    notFound()
  }

  // 2. Oper data ke Form Client Component
  return (
    <div className="max-w-4xl mx-auto">
      <EditPostForm post={post} />
    </div>
  )
}