// src/app/actions/settings.ts
'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { uploadImage } from "./upload" // Import helper upload yang sudah fix

const prisma = new PrismaClient()

// --- 1. KEPALA ASRAMA (LEADERS) ---

const LeaderSchema = z.object({
  name: z.string().min(3),
  periodStart: z.coerce.number().min(1900),
  periodEnd: z.coerce.number().optional().nullable(),
  bio: z.string().optional(),
})

// CREATE
export async function createLeader(prevState: any, formData: FormData) {
  const data = LeaderSchema.safeParse({
    name: formData.get('name'),
    periodStart: formData.get('periodStart'),
    periodEnd: formData.get('periodEnd') || null,
    bio: formData.get('bio'),
  })

  if (!data.success) return { message: "Data tidak valid" }

  // LOGIKA UPLOAD FOTO (Server Side)
  let finalPhotoUrl = null
  const file = formData.get('file') as File | null

  if (file && file.size > 0) {
    const uploadRes = await uploadImage(formData)
    if (uploadRes.success) {
      finalPhotoUrl = uploadRes.url
    } else {
      return { message: "Gagal upload foto profil" }
    }
  }

  try {
    await prisma.leader.create({
      data: { 
        ...data.data, 
        bio: data.data.bio || '',
        photo: finalPhotoUrl // Simpan URL
      }
    })
    revalidatePath('/dashboard/leaders')
    return { success: true, message: "Data pimpinan berhasil ditambahkan!" }
  } catch (e) {
    return { message: "Gagal menyimpan data" }
  }
}

// UPDATE
export async function updateLeader(prevState: any, formData: FormData) {
  const id = formData.get('id') as string
  
  const data = LeaderSchema.safeParse({
    name: formData.get('name'),
    periodStart: formData.get('periodStart'),
    periodEnd: formData.get('periodEnd') || null,
    bio: formData.get('bio'),
  })

  if (!data.success) return { message: "Data update tidak valid" }

  // Logic Upload Update
  let finalPhotoUrl = null
  const file = formData.get('file') as File | null

  if (file && file.size > 0) {
    const uploadRes = await uploadImage(formData)
    if (uploadRes.success) finalPhotoUrl = uploadRes.url
    else return { message: "Gagal upload foto baru" }
  } else {
    finalPhotoUrl = formData.get('oldPhotoUrl') as string || null
  }

  try {
    await prisma.leader.update({
      where: { id },
      data: {
        ...data.data,
        bio: data.data.bio || '',
        photo: finalPhotoUrl
      }
    })
    revalidatePath('/dashboard/leaders')
    return { success: true, message: "Data pimpinan berhasil diperbarui!" }
  } catch (e) {
    return { message: "Gagal update data" }
  }
}

// DELETE
export async function deleteLeader(id: string) {
  await prisma.leader.delete({ where: { id } })
  revalidatePath('/dashboard/leaders')
}



// --- 2. ORGANISASI ---
const OrgSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  order: z.coerce.number().default(0),
  category: z.enum(['KEILMUAN', 'KESENIAN']),
  leaderId: z.string().optional().nullable(),
  advisorId: z.string().optional().nullable(),
})

// 1. CREATE ORGANISASI
export async function createOrganization(prevState: any, formData: FormData) {
  const data = OrgSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    order: formData.get('order'),
    category: formData.get('category'),
    leaderId: formData.get('leaderId'),
    advisorId: formData.get('advisorId'),
  })

  if (!data.success) return { message: "Data tidak valid" }

  // Upload Logo
  let logoUrl = null
  const file = formData.get('file') as File | null
  if (file && file.size > 0) {
    const uploadRes = await uploadImage(formData)
    if (uploadRes.success) logoUrl = uploadRes.url
    else return { message: "Gagal upload logo" }
  }

  try {
    await prisma.organization.create({ 
      data: {
        ...data.data,
        logo: logoUrl,
        leaderId: data.data.leaderId || null,
        advisorId: data.data.advisorId || null,
      } 
    })
    revalidatePath('/dashboard/organization')
    return { success: true, message: "Organisasi berhasil dibuat!" }
  } catch (e) {
    return { message: "Gagal menyimpan data" }
  }
}

// 2. UPDATE ORGANISASI
export async function updateOrganization(prevState: any, formData: FormData) {
  const id = formData.get('id') as string
  
  const data = OrgSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    order: formData.get('order'),
    category: formData.get('category'),
    leaderId: formData.get('leaderId'),
    advisorId: formData.get('advisorId'),
  })

  if (!data.success) return { message: "Data tidak valid" }

  // Upload Logo Baru (Optional)
  let logoUrl = null
  const file = formData.get('file') as File | null
  if (file && file.size > 0) {
    const uploadRes = await uploadImage(formData)
    if (uploadRes.success) logoUrl = uploadRes.url
    else return { message: "Gagal upload logo baru" }
  } else {
    logoUrl = formData.get('oldLogoUrl') as string || null
  }

  try {
    await prisma.organization.update({ 
      where: { id },
      data: {
        ...data.data,
        logo: logoUrl,
        leaderId: data.data.leaderId || null,
        advisorId: data.data.advisorId || null,
      } 
    })
    revalidatePath('/dashboard/organization')
    return { success: true, message: "Data diperbarui!" }
  } catch (e) {
    return { message: "Gagal update data" }
  }
}

export async function deleteOrganization(id: string) {
  await prisma.organization.delete({ where: { id } })
  revalidatePath('/dashboard/organization')
}

// --- STAFF / PENGURUS (SIMPLE CRUD UNTUK DATA PEMBIMBING) ---
// Kita buat fungsi create sederhana agar Anda bisa isi data pengurus nanti
export async function createStaffSimple(name: string, position: string) {
  await prisma.staff.create({ data: { name, position } })
  revalidatePath('/dashboard/organization')
}


// --- 3. JADWAL HARIAN ---
const ScheduleSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  activity: z.string(),
})

export async function createSchedule(prevState: any, formData: FormData) {
  const data = ScheduleSchema.safeParse({
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    activity: formData.get('activity'),
  })

  if (!data.success) return { message: "Data jadwal tidak valid" }

  await prisma.dailySchedule.create({ data: data.data })
  revalidatePath('/dashboard/schedules')
  return { success: true }
}

export async function deleteSchedule(id: string) {
  await prisma.dailySchedule.delete({ where: { id } })
  revalidatePath('/dashboard/schedules')
}