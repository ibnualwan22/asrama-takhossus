'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { uploadImage } from "./upload" // Import helper upload Anda

const prisma = new PrismaClient()

// 1. SAVE (CREATE / UPDATE)
export async function saveStaff(formData: FormData) {
  const id = formData.get("id") as string
  const source = formData.get("source") as string
  const studentId = formData.get("studentId") as string
  const manualName = formData.get("manualName") as string
  const position = formData.get("position") as string
  const order = parseInt(formData.get("order") as string) || 0

  // --- LOGIC UPLOAD FOTO (Menggunakan Helper uploadImage) ---
  let photoUrl = null
  
  // Ambil file dari input bernama 'photo' (sesuai nama di Modal)
  const file = formData.get("photo") as File | null

  if (file && file.size > 0) {
    // Kita tambahkan key 'file' ke formData karena uploadImage biasanya mencari key 'file'
    formData.set("file", file) 

    const uploadRes = await uploadImage(formData)
    
    if (uploadRes.success) {
      photoUrl = uploadRes.url
    } else {
      // Opsional: Return error message atau throw
      console.error("Gagal upload foto:", uploadRes)
      throw new Error("Gagal mengupload foto profil.")
    }
  }

  // --- PERSIAPAN DATA ---
  let dataToSave: any = {
    position,
    order,
    isActive: true,
  }

  // Jika ada URL foto baru, simpan.
  if (photoUrl) {
    dataToSave.photo = photoUrl
  }

  // --- LOGIC SUMBER DATA ---
  if (source === "database" && studentId) {
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (student) {
      dataToSave.studentId = studentId
      dataToSave.name = student.name // Backup nama
      
      // Jika tidak ada foto baru, dan ini data baru (create), pakai foto santri
      if (!photoUrl && !id && student.photo) {
         dataToSave.photo = student.photo
      }
    }
  } else {
    dataToSave.studentId = null
    dataToSave.name = manualName
  }

  // --- EKSEKUSI DATABASE ---
  try {
    if (id) {
      // Mode UPDATE
      await prisma.staff.update({ where: { id }, data: dataToSave })
    } else {
      // Mode CREATE
      await prisma.staff.create({ data: dataToSave })
    }
    
    revalidatePath("/dashboard/struktur")
    return { success: true, message: "Data berhasil disimpan." }

  } catch (error) {
    console.error(error)
    return { success: false, message: "Gagal menyimpan data ke database." }
  }
}

// 2. DELETE
export async function deleteStaff(id: string) {
  // Mengikuti pattern settings.ts, kita hanya hapus data di DB.
  // Penghapusan gambar di Cloudinary ditangani manual atau oleh cron job jika perlu.
  try {
    await prisma.staff.delete({ where: { id } })
    revalidatePath("/dashboard/struktur")
  } catch (error) {
    console.error("Gagal menghapus staff:", error)
  }
}
export async function addStaff(formData: FormData) {
  const source = formData.get("source") as string
  const studentId = formData.get("studentId") as string
  const manualName = formData.get("manualName") as string
  const position = formData.get("position") as string
  const photoUrl = formData.get("photoUrl") as string

  let dataToSave: any = {
    position,
    photo: photoUrl || null,
    isActive: true,
  }

  // LOGIKA: Database vs Manual
  if (source === "database" && studentId) {
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (student) {
      dataToSave.studentId = studentId
      dataToSave.name = student.name
      if (!dataToSave.photo && student.photo) {
        dataToSave.photo = student.photo
      }
    }
  } else {
    dataToSave.studentId = null
    dataToSave.name = manualName
  }

  await prisma.staff.create({ data: dataToSave })
  revalidatePath("/dashboard/structure")
}
