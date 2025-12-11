// src/app/actions/gallery.ts
'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { uploadImage } from "./upload" // Helper upload yang sudah kita punya

const prisma = new PrismaClient()

// --- SCHEMA VALIDASI ---
const AlbumSchema = z.object({
  title: z.string().min(3, "Nama album minimal 3 karakter"),
  description: z.string().optional(),
})

const MediaSchema = z.object({
  albumId: z.string(),
  type: z.enum(["PHOTO", "VIDEO"]),
  videoUrl: z.string().optional(), // Hanya wajib jika type == VIDEO
})

// --- 1. MANAJEMEN ALBUM ---

export async function createAlbum(prevState: any, formData: FormData) {
  const validatedFields = AlbumSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    await prisma.gallery.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
      }
    })

    revalidatePath('/dashboard/gallery')
    return { success: true, message: 'Album berhasil dibuat!' }
  } catch (error) {
    return { message: 'Gagal membuat album.' }
  }
}

export async function deleteAlbum(id: string) {
  try {
    await prisma.gallery.delete({ where: { id } }) // Foto di dalamnya otomatis terhapus (Cascade)
    revalidatePath('/dashboard/gallery')
  } catch (error) {
    console.error(error)
  }
}

// --- 2. MANAJEMEN MEDIA (FOTO & VIDEO) ---

export async function addMedia(prevState: any, formData: FormData) {
  const albumId = formData.get('albumId') as string
  const type = formData.get('type') as "PHOTO" | "VIDEO"
  const videoUrl = formData.get('videoUrl') as string

  // Validasi manual sederhana
  if (!albumId) return { message: "ID Album tidak valid" }

  let finalUrl = ""

  // LOGIKA 1: JIKA VIDEO
  if (type === "VIDEO") {
    if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      return { message: "Harap masukkan link YouTube yang valid." }
    }
    // Kita simpan URL aslinya, nanti di frontend kita convert jadi embed
    finalUrl = videoUrl
  } 
  
  // LOGIKA 2: JIKA FOTO
  else if (type === "PHOTO") {
    const file = formData.get('file') as File
    if (!file || file.size === 0) {
      return { message: "Anda belum memilih foto." }
    }
    
    // Upload ke Cloudinary pakai helper yg sudah ada
    const uploadRes = await uploadImage(formData)
    if (!uploadRes.success) {
      return { message: uploadRes.message }
    }
    finalUrl = uploadRes.url
  }

  try {
    await prisma.galleryItem.create({
      data: {
        galleryId: albumId,
        type: type,
        url: finalUrl
      }
    })

    revalidatePath(`/dashboard/gallery/${albumId}`) // Refresh halaman detail album
    return { success: true, message: 'Media berhasil ditambahkan!' }
  } catch (error) {
    console.error(error)
    return { message: 'Gagal menyimpan media ke database.' }
  }
}

export async function deleteMedia(id: string, albumId: string) {
  await prisma.galleryItem.delete({ where: { id } })
  revalidatePath(`/dashboard/gallery/${albumId}`)
}