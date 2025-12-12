'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { uploadImage } from "./upload" // Gunakan helper upload server yang sudah fix

const prisma = new PrismaClient()

// Schema Validasi (Hanya Text)
const AchievementSchema = z.object({
  title: z.string().min(3),
  level: z.string(),
  year: z.coerce.number(),
  category: z.enum(['SANTRI', 'ASRAMA']),
  studentId: z.string().optional().nullable(),
})

// 1. CREATE PRESTASI
export async function createAchievement(prevState: any, formData: FormData) {
  // Validasi Text Data
  const data = AchievementSchema.safeParse({
    title: formData.get('title'),
    level: formData.get('level'),
    year: formData.get('year'),
    category: formData.get('category'),
    studentId: formData.get('studentId'),
  })

  if (!data.success) return { message: "Data tidak valid" }

  const { category, studentId, title, level, year } = data.data

  // Validasi Kategori
  if (category === 'SANTRI' && !studentId) {
    return { message: "Harap pilih santri untuk prestasi individu." }
  }

  // --- LOGIKA UPLOAD ---
  let finalPhotoUrl = null
  const file = formData.get('file') as File | null

  if (file && file.size > 0) {
    const uploadRes = await uploadImage(formData) // Upload di Server
    if (uploadRes.success) {
      finalPhotoUrl = uploadRes.url
    } else {
      return { message: "Gagal upload foto dokumentasi." }
    }
  }

  try {
    await prisma.achievement.create({
      data: {
        title, level, year, 
        photo: finalPhotoUrl, // Simpan URL hasil upload
        studentId: category === 'SANTRI' ? studentId : null 
      }
    })
    revalidatePath('/dashboard/achievements')
    return { success: true, message: "Prestasi berhasil ditambahkan!" }
  } catch (e) {
    console.error(e)
    return { message: "Gagal menyimpan ke database" }
  }
}

// 2. UPDATE PRESTASI
export async function updateAchievement(prevState: any, formData: FormData) {
  const id = formData.get('id') as string
  
  const data = AchievementSchema.safeParse({
    title: formData.get('title'),
    level: formData.get('level'),
    year: formData.get('year'),
    category: formData.get('category'),
    studentId: formData.get('studentId'),
  })

  if (!data.success) return { message: "Data update tidak valid" }
  const { category, studentId, title, level, year } = data.data

  // --- LOGIKA UPLOAD UPDATE ---
  let finalPhotoUrl = null
  const file = formData.get('file') as File | null

  // Cek apakah user upload file baru?
  if (file && file.size > 0) {
    const uploadRes = await uploadImage(formData)
    if (uploadRes.success) {
      finalPhotoUrl = uploadRes.url
    } else {
      return { message: "Gagal upload foto baru." }
    }
  } else {
    // Jika tidak ada file baru, ambil URL lama dari hidden input
    // (Akan kita pasang di form nanti)
    finalPhotoUrl = formData.get('oldPhotoUrl') as string || null
  }

  try {
    await prisma.achievement.update({
      where: { id },
      data: {
        title, level, year,
        photo: finalPhotoUrl, // Update foto
        studentId: category === 'SANTRI' ? studentId : null 
      }
    })
    revalidatePath('/dashboard/achievements')
    return { success: true, message: "Prestasi berhasil diupdate!" }
  } catch (error) {
    return { message: "Gagal update prestasi" }
  }
}

// 3. DELETE
export async function deleteAchievement(id: string) {
  await prisma.achievement.delete({ where: { id } })
  revalidatePath('/dashboard/achievements')
}