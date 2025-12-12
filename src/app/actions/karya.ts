'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { uploadImage } from "./upload" // Import helper upload Anda

const prisma = new PrismaClient()

// 1. SAVE (CREATE / UPDATE)
export async function saveKarya(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const year = parseInt(formData.get("year") as string)
  const description = formData.get("description") as string
  
  // Validasi sederhana
  if (!title || !author || !year) {
    return { success: false, message: "Nama, Penyusun, dan Tahun wajib diisi." }
  }

  // --- LOGIC UPLOAD FOTO ---
  let imageUrl = null
  const file = formData.get("file") as File | null // Pastikan input name di form adalah 'file'

  if (file && file.size > 0) {
    const uploadRes = await uploadImage(formData)
    
    if (uploadRes.success) {
      imageUrl = uploadRes.url
    } else {
      console.error("Gagal upload foto:", uploadRes)
      return { success: false, message: "Gagal mengupload foto kitab." }
    }
  }

  // Data Payload
  let dataToSave: any = {
    title,
    author,
    year,
    description,
  }

  // Jika ada foto baru, update field image
  if (imageUrl) {
    dataToSave.image = imageUrl
  }

  try {
    if (id) {
      // UPDATE
      await prisma.karya.update({ where: { id }, data: dataToSave })
    } else {
      // CREATE
      await prisma.karya.create({ data: dataToSave })
    }

    revalidatePath("/dashboard/karya")
    return { success: true, message: "Data karya berhasil disimpan." }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Terjadi kesalahan saat menyimpan data." }
  }
}

// 2. DELETE
export async function deleteKarya(id: string) {
  try {
    await prisma.karya.delete({ where: { id } })
    revalidatePath("/dashboard/karya")
    return { success: true, message: "Data berhasil dihapus" }
  } catch (error) {
    return { success: false, message: "Gagal menghapus data" }
  }
}