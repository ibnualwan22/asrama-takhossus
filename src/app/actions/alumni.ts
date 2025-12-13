'use server'

import { PrismaClient, StudentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requirePermission } from "@/lib/auth-guard" // <--- Import Guard

const prisma = new PrismaClient()

// --- 1. GET DATA (Public/Read) ---
export async function getAlumni(query: string = '', page: number = 1) {
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const whereCondition = {
    status: { in: [StudentStatus.ALUMNI_GRADUATED, StudentStatus.ALUMNI_DROPOUT] },
    OR: query ? [
      { name: { contains: query, mode: 'insensitive' as const } },
      { address: { contains: query, mode: 'insensitive' as const } },
    ] : undefined
  }

  const [data, total] = await prisma.$transaction([
    prisma.student.findMany({
      where: whereCondition,
      orderBy: { graduationYear: 'desc' }, 
      skip,
      take: pageSize,
    }),
    prisma.student.count({ where: whereCondition })
  ])

  return { data, total, totalPages: Math.ceil(total / pageSize) }
}

// --- 2. CREATE MANUAL (Butuh Izin Create) ---
const AlumniSchema = z.object({
  name: z.string().min(3),
  nis: z.string().min(1),
  entryYear: z.coerce.number().min(1900),
  graduationYear: z.coerce.number().min(1900),
  address: z.string().optional(),
  status: z.enum(['ALUMNI_GRADUATED', 'ALUMNI_DROPOUT']),
})

export async function createManualAlumni(prevState: any, formData: FormData) {
  // Cek Izin Create
  try { await requirePermission("student.create") } catch (e: any) { return { message: e.message } }

  const validatedFields = AlumniSchema.safeParse({
    name: formData.get('name'),
    nis: formData.get('nis'),
    entryYear: formData.get('entryYear'),
    graduationYear: formData.get('graduationYear'),
    address: formData.get('address'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) return { message: "Input tidak valid." }

  const { name, nis, entryYear, graduationYear, address, status } = validatedFields.data

  try {
    const existing = await prisma.student.findUnique({ where: { nis } })
    if (existing) return { message: `NIS ${nis} sudah terdaftar.` }

    await prisma.student.create({
      data: {
        name, nis, entryYear, graduationYear, address,
        status: status as StudentStatus,
        activeDormitory: 'TAKHOSSUS',
        formalClass: 'Alumni Manual',
        fatherName: '-', motherName: '-',
      }
    })

    revalidatePath('/dashboard/alumni')
    return { success: true, message: 'Alumni berhasil ditambahkan!' }
  } catch (error) {
    return { message: 'Terjadi kesalahan server.' }
  }
}

// --- 3. UPDATE ALUMNI (Butuh Izin Update) ---
export async function updateAlumni(prevState: any, formData: FormData) {
  // CEK IZIN UPDATE
  try { await requirePermission("student.update") } catch (e: any) { return { message: e.message } }

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const nis = formData.get('nis') as string
  const entryYear = Number(formData.get('entryYear'))
  const graduationYear = formData.get('graduationYear') ? Number(formData.get('graduationYear')) : null
  const mutakhorijinBatch = formData.get('mutakhorijinBatch') ? Number(formData.get('mutakhorijinBatch')) : null
  const address = formData.get('address') as string

  try {
    await prisma.student.update({
      where: { id },
      data: { name, nis, entryYear, graduationYear, mutakhorijinBatch, address }
    })
    revalidatePath('/dashboard/alumni')
    return { success: true, message: 'Data alumni berhasil diupdate!' }
  } catch (error) {
    return { success: false, message: 'Gagal update data.' }
  }
}

// --- 4. REACTIVATE / UNDO (Butuh Izin Mutasi) ---
export async function reactivateStudent(studentId: string) {
  // CEK IZIN MUTASI
  try { await requirePermission("student.mutate") } catch (e: any) { return { success: false, message: e.message } }

  try {
    await prisma.student.update({
      where: { id: studentId },
      data: {
        status: StudentStatus.ACTIVE, 
        graduationYear: null,         
        mutakhorijinBatch: null       
      }
    })

    revalidatePath('/dashboard/alumni')
    revalidatePath('/dashboard/students')
    return { success: true, message: 'Santri berhasil diaktifkan kembali!' }
  } catch (error) {
    return { success: false, message: 'Gagal mengaktifkan kembali.' }
  }
}