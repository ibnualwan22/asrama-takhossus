'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { uploadImage } from "./upload" 

const prisma = new PrismaClient()

// FUNGSI SIMPAN (CREATE / UPDATE)
export async function saveKarya(formData: FormData) {
  const id = formData.get('id') as string // Jika ada ID, berarti Update
  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const year = parseInt(formData.get('year') as string) || new Date().getFullYear()
  const description = formData.get('description') as string
  
  // Handle File Upload
  let imageUrl = formData.get('oldImage') as string // Default gambar lama
  const file = formData.get('file') as File
  
  if (file && file.size > 0) {
      const uploadRes = await uploadImage(formData)
      if (uploadRes.success) imageUrl = uploadRes.url
  }

  try {
    if (id) {
      // --- LOGIC UPDATE ---
      await prisma.karya.update({
        where: { id },
        data: { title, author, year, description, image: imageUrl }
      })
    } else {
      // --- LOGIC CREATE ---
      await prisma.karya.create({
        data: { title, author, year, description, image: imageUrl }
      })
    }

    revalidatePath('/dashboard/karya') // Refresh Halaman Admin
    revalidatePath('/') // Refresh Halaman Depan (PENTING AGAR MUNCUL DI PUBLIC)
    
    return { success: true, message: "Data karya berhasil disimpan!" }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Gagal menyimpan data." }
  }
}

// FUNGSI DELETE
export async function deleteKarya(id: string) {
  try {
    await prisma.karya.delete({ where: { id } })
    revalidatePath('/dashboard/karya')
    revalidatePath('/') 
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}