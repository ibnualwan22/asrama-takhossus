'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const prisma = new PrismaClient()

// --- 1. KEPALA ASRAMA (LEADERS) ---
const LeaderSchema = z.object({
  name: z.string().min(3),
  periodStart: z.coerce.number().min(1990),
  periodEnd: z.coerce.number().optional().nullable(),
  bio: z.string().optional(),
  photo: z.string().optional().nullable(), // URL dari Client Upload
})

export async function createLeader(prevState: any, formData: FormData) {
  const data = LeaderSchema.safeParse({
    name: formData.get('name'),
    periodStart: formData.get('periodStart'),
    periodEnd: formData.get('periodEnd') || null,
    bio: formData.get('bio'),
    photo: formData.get('photoUrl'), // Ambil dari Hidden Input
  })

  if (!data.success) return { message: "Data tidak valid" }

  await prisma.leader.create({
    data: { ...data.data, bio: data.data.bio || '' }
  })
  revalidatePath('/dashboard/leaders')
  return { success: true }
}

export async function deleteLeader(id: string) {
  await prisma.leader.delete({ where: { id } })
  revalidatePath('/dashboard/leaders')
}


// --- 2. ORGANISASI ---
const OrgSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  order: z.coerce.number().default(0),
  logo: z.string().optional().nullable(),
})

export async function createOrganization(prevState: any, formData: FormData) {
  const data = OrgSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    order: formData.get('order'),
    logo: formData.get('logoUrl'), // Ambil dari Hidden Input
  })

  if (!data.success) return { message: "Data tidak valid" }

  await prisma.organization.create({ data: data.data })
  revalidatePath('/dashboard/organization')
  return { success: true }
}

export async function deleteOrganization(id: string) {
  await prisma.organization.delete({ where: { id } })
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