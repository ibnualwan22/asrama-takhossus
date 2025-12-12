// src/app/actions/settings.ts
'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { uploadImage } from "./upload" 

const prisma = new PrismaClient()

// ============================================================================
// 1. KEPALA ASRAMA (LEADERS) - Tidak Berubah
// ============================================================================

const LeaderSchema = z.object({
  name: z.string().min(3),
  periodStart: z.coerce.number().min(1900),
  periodEnd: z.coerce.number().optional().nullable(),
  bio: z.string().optional(),
})

export async function createLeader(prevState: any, formData: FormData) {
  const data = LeaderSchema.safeParse({
    name: formData.get('name'),
    periodStart: formData.get('periodStart'),
    periodEnd: formData.get('periodEnd') || null,
    bio: formData.get('bio'),
  })

  if (!data.success) return { message: "Data tidak valid" }

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
        photo: finalPhotoUrl 
      }
    })
    revalidatePath('/dashboard/leaders')
    return { success: true, message: "Data pimpinan berhasil ditambahkan!" }
  } catch (e) {
    return { message: "Gagal menyimpan data" }
  }
}

export async function updateLeader(prevState: any, formData: FormData) {
  const id = formData.get('id') as string
  
  const data = LeaderSchema.safeParse({
    name: formData.get('name'),
    periodStart: formData.get('periodStart'),
    periodEnd: formData.get('periodEnd') || null,
    bio: formData.get('bio'),
  })

  if (!data.success) return { message: "Data update tidak valid" }

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

export async function deleteLeader(id: string) {
  await prisma.leader.delete({ where: { id } })
  revalidatePath('/dashboard/leaders')
}


// ============================================================================
// 2. ORGANISASI (UPDATE LOGIC UNTUK PERIOD & RIWAYAT)
// ============================================================================

const OrgSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  order: z.coerce.number().default(0),
  category: z.enum(['KEILMUAN', 'KESENIAN']),
  // leaderId dan advisorId tidak divalidasi disini karena tidak masuk tabel Organization
})

// --- CREATE ORGANISASI ---
export async function createOrganization(prevState: any, formData: FormData) {
  const data = OrgSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    order: formData.get('order'),
    category: formData.get('category'),
  })

  if (!data.success) return { message: "Data tidak valid" }

  // Ambil data Relasi Manual
  const leaderId = formData.get('leaderId') as string
  const advisorId = formData.get('advisorId') as string
  const periodStart = parseInt(formData.get('periodStart') as string) || new Date().getFullYear()

  // Upload Logo
  let logoUrl = null
  const file = formData.get('file') as File | null
  if (file && file.size > 0) {
    const uploadRes = await uploadImage(formData)
    if (uploadRes.success) logoUrl = uploadRes.url
    else return { message: "Gagal upload logo" }
  }

  try {
    await prisma.$transaction(async (tx) => {
        // A. Buat Organisasi Induk
        const newOrg = await tx.organization.create({ 
            data: {
                ...data.data,
                logo: logoUrl,
            } 
        })

        // B. Buat Periode dengan Tahun yang DIPILIH USER
        if (leaderId || advisorId) {
            await tx.orgPeriod.create({
                data: {
                    organizationId: newOrg.id,
                    periodStart: periodStart, // <--- GUNAKAN INPUT USER
                    leaderId: leaderId || null,
                    advisorId: advisorId || null,
                    isActive: true
                }
            })
        }
    })
    revalidatePath('/dashboard/organization')
    return { success: true, message: "Organisasi berhasil dibuat!" }
  } catch (e) {
    return { message: "Gagal menyimpan data" }
  }
}

// --- UPDATE ORGANISASI ---
export async function updateOrganization(prevState: any, formData: FormData) {
  const id = formData.get('id') as string
  
  const data = OrgSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    order: formData.get('order'),
    category: formData.get('category'),
  })

  if (!data.success) return { message: "Data tidak valid" }

  // Ambil data Relasi
  const leaderId = formData.get('leaderId') as string
  const advisorId = formData.get('advisorId') as string
  const periodStart = parseInt(formData.get('periodStart') as string) || new Date().getFullYear()

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
    await prisma.$transaction(async (tx) => {
        // A. Update Induk
        await tx.organization.update({ 
            where: { id },
            data: {
                ...data.data,
                logo: logoUrl,
            } 
        })

        // B. Update Struktur Aktif
        const activePeriod = await tx.orgPeriod.findFirst({
            where: { organizationId: id, isActive: true }
        })

        if (activePeriod) {
            // Update Data & TAHUNNYA JUGA
            await tx.orgPeriod.update({
                where: { id: activePeriod.id },
                data: {
                    periodStart: periodStart, // <--- Update tahun jika user menggantinya
                    leaderId: leaderId || null,
                    advisorId: advisorId || null
                }
            })
        } else {
            // Jika belum ada, buat baru dengan tahun inputan
            if (leaderId || advisorId) {
                await tx.orgPeriod.create({
                    data: {
                        organizationId: id,
                        periodStart: periodStart, // <--- Gunakan input user
                        leaderId: leaderId || null,
                        advisorId: advisorId || null,
                        isActive: true
                    }
                })
            }
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


// ============================================================================
// 3. JADWAL HARIAN - Tidak Berubah
// ============================================================================

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