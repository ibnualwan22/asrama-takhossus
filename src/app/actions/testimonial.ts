'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { uploadImage } from "./upload" // Pastikan fungsi upload ini sudah ada dari modul sebelumnya

const prisma = new PrismaClient()

// 1. GET ALL (Untuk Tampilan Depan & Admin)
export async function getTestimonials() {
  return await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

// 2. CREATE (Upload Foto WA)
export async function createTestimonial(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string // Misal: "Wali Santri"
  const file = formData.get('file') as File

  if (!file || file.size === 0) {
    return { message: "Foto screenshot wajib diupload!" }
  }

  try {
    // 1. Upload Gambar
    const uploadRes = await uploadImage(formData)
    if (!uploadRes.success) return { message: "Gagal upload gambar" }

    // 2. Simpan ke DB
    await prisma.testimonial.create({
      data: {
        name,
        role,
        image: uploadRes.url,
        isShow: true
      }
    })

    revalidatePath('/dashboard/content')
    revalidatePath('/') // Refresh halaman depan
    return { success: true, message: "Testimoni berhasil ditambahkan!" }
  } catch (error) {
    return { message: "Terjadi kesalahan server" }
  }
}

// 3. DELETE
export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } })
    revalidatePath('/dashboard/content')
    revalidatePath('/')
    return { success: true, message: "Dihapus!" }
  } catch (error) {
    return { success: false, message: "Gagal hapus" }
  }
}