// src/app/actions/post.ts
'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { uploadImage } from "./upload" // IMPORT HELPER UPLOAD

const prisma = new PrismaClient()

// Schema Validasi (Hanya validasi teks)
const PostSchema = z.object({
  title: z.string().min(5, "Judul terlalu pendek"),
  content: z.string().min(10, "Isi konten terlalu pendek"),
  type: z.enum(["ARTICLE", "NEWS", "ANNOUNCEMENT"]),
})

// --- CREATE POST (Menggunakan Logic Anda yg Berhasil) ---
export async function createPost(prevState: any, formData: FormData) {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    type: formData.get('type'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { title, content, type } = validatedFields.data

  // 1. LOGIKA UPLOAD GAMBAR BARU
  let finalThumbnailUrl = null
  
  // Ambil file dari input name="file"
  const file = formData.get('file') as File | null

  // Cek apakah ada file yang dipilih dan ukurannya > 0
  if (file && file.size > 0) {
    const uploadRes = await uploadImage(formData) // Panggil helper

    if (uploadRes.success) {
      finalThumbnailUrl = uploadRes.url
    } else {
      // Jika gagal upload, return error dan jangan simpan ke DB
      return { message: `Gagal upload gambar: ${uploadRes.message}` }
    }
  }

  // 2. Simpan ke Database
  try {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now()

    await prisma.post.create({
      data: {
        title, slug, content, type,
        thumbnail: finalThumbnailUrl, // URL baru atau null
        published: true,
        authorId: "Admin",
      }
    })

    revalidatePath('/dashboard/posts')
    return { success: true, message: 'Artikel berhasil diterbitkan!' }
  } catch (error) {
    console.error(error)
    return { message: 'Gagal menyimpan artikel ke database.' }
  }
}


// --- UPDATE POST (PERBAIKAN DISINI) ---
export async function updatePost(prevState: any, formData: FormData) {
  const id = formData.get('id') as string

  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    type: formData.get('type'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { title, content, type } = validatedFields.data

  // --- LOGIKA UPLOAD SAAT EDIT (PENTING) ---
  let finalThumbnailUrl = null

  // 1. Cek apakah ada file BARU dipilih?
  const file = formData.get('file') as File | null
  
  if (file && file.size > 0) {
    // KASUS A: User memilih gambar baru -> Upload gambar baru
    const uploadRes = await uploadImage(formData)
    
    if (uploadRes.success) {
      finalThumbnailUrl = uploadRes.url
    } else {
       return { message: `Gagal upload gambar baru: ${uploadRes.message}` }
    }
  } else {
    // KASUS B: User TIDAK memilih gambar baru -> Pakai URL gambar lama
    // Kita ambil dari hidden input 'oldThumbnailUrl' di form
    const oldUrl = formData.get('oldThumbnailUrl') as string
    finalThumbnailUrl = oldUrl || null // Gunakan URL lama, atau null jika memang tidak ada
  }

  // 2. Update Database
  try {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now()

    await prisma.post.update({
      where: { id },
      data: {
        title, slug, content, type,
        // Update field thumbnail dengan keputusan di atas
        thumbnail: finalThumbnailUrl,
      }
    })

    revalidatePath('/dashboard/posts')
    return { success: true, message: 'Artikel berhasil diperbarui!' }
  } catch (error) {
    console.error(error)
    return { message: 'Gagal mengupdate artikel.' }
  }
}

export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } })
  revalidatePath('/dashboard/posts')
}