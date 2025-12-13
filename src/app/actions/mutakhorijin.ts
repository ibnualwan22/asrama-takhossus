'use server'

import { PrismaClient, StudentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { requirePermission } from "@/lib/auth-guard" // <--- Import Guard

const prisma = new PrismaClient()

// 1. GET DATA (Read Only - Public/Auth user)
export async function getMutakhorijin(query: string = '', page: number = 1) {
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const whereCondition = {
    status: StudentStatus.MUTAKHORIJIN,
    OR: query ? [
      { name: { contains: query, mode: 'insensitive' as const } },
      { nis: { contains: query, mode: 'insensitive' as const } },
    ] : undefined
  }

  const [data, total] = await prisma.$transaction([
    prisma.student.findMany({
      where: whereCondition,
      orderBy: { mutakhorijinBatch: 'desc' }, // Urutkan angkatan terbaru
      skip,
      take: pageSize,
    }),
    prisma.student.count({ where: whereCondition })
  ])

  return { data, total, totalPages: Math.ceil(total / pageSize) }
}

// 2. FINALIZE ALUMNI (Mutakhorijin -> Alumni Lulus)
export async function graduateMutakhorijin(prevState: any, formData: FormData) {
  // --- CEK IZIN MUTASI ---
  try { await requirePermission("student.mutate") } catch (e: any) { return { message: e.message } }

  const studentId = formData.get('studentId') as string
  const graduationYear = formData.get('graduationYear')

  if (!studentId || !graduationYear) return { message: "Tahun lulus wajib diisi" }

  try {
    await prisma.student.update({
      where: { id: studentId },
      data: {
        status: StudentStatus.ALUMNI_GRADUATED,
        graduationYear: Number(graduationYear)
      }
    })
    
    revalidatePath('/dashboard/mutakhorijin')
    revalidatePath('/dashboard/alumni')
    return { success: true, message: "Santri resmi menjadi Alumni!" }
  } catch (error) {
    return { message: "Gagal memproses data." }
  }
}

// 3. EDIT DATA (Opsional, jika ingin edit angkatan/nama)
export async function updateMutakhorijin(prevState: any, formData: FormData) {
  // --- CEK IZIN UPDATE ---
  try { await requirePermission("student.update") } catch (e: any) { return { message: e.message } }

  const id = formData.get('id') as string
  const mutakhorijinBatch = Number(formData.get('mutakhorijinBatch'))

  try {
    await prisma.student.update({
      where: { id },
      data: { mutakhorijinBatch }
    })
    revalidatePath('/dashboard/mutakhorijin')
    return { success: true, message: "Data berhasil diupdate." }
  } catch (error) {
    return { message: "Gagal update." }
  }
}