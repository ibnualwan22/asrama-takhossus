// src/app/actions/alumni.ts
'use server'

import { PrismaClient, StudentStatus } from "@prisma/client"

const prisma = new PrismaClient()

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
      orderBy: { graduationYear: 'desc' }, // Urutkan dari lulusan terbaru
      skip,
      take: pageSize,
    }),
    prisma.student.count({ where: whereCondition })
  ])

  return { data, total, totalPages: Math.ceil(total / pageSize) }
}

import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema Validasi Input Manual
const AlumniSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  nis: z.string().min(1, "NIS/ID wajib diisi"),
  entryYear: z.coerce.number().min(1900, "Tahun masuk tidak valid"),
  graduationYear: z.coerce.number().min(1900, "Tahun lulus tidak valid"),
  address: z.string().optional(),
  status: z.enum(['ALUMNI_GRADUATED', 'ALUMNI_DROPOUT']),
})

export async function createManualAlumni(prevState: any, formData: FormData) {
  const validatedFields = AlumniSchema.safeParse({
    name: formData.get('name'),
    nis: formData.get('nis'),
    entryYear: formData.get('entryYear'),
    graduationYear: formData.get('graduationYear'),
    address: formData.get('address'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return { 
      error: validatedFields.error.flatten().fieldErrors,
      message: "Gagal validasi input."
    }
  }

  const { name, nis, entryYear, graduationYear, address, status } = validatedFields.data

  try {
    // Cek duplikasi NIS
    const existing = await prisma.student.findUnique({ where: { nis } })
    if (existing) {
      return { message: `NIS ${nis} sudah terdaftar di database.` }
    }

    await prisma.student.create({
      data: {
        name,
        nis,
        entryYear,
        graduationYear,
        address,
        status: status as StudentStatus, // Casting ke Enum Prisma
        activeDormitory: 'TAKHOSSUS', // Default
        formalClass: 'Alumni Manual',
        fatherName: '-', // Default karena manual
        motherName: '-', // Default
      }
    })

    revalidatePath('/dashboard/alumni')
    return { success: true, message: 'Data alumni berhasil ditambahkan!' }
  } catch (error) {
    console.error(error)
    return { message: 'Terjadi kesalahan server.' }
  }
}