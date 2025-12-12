'use server'

import { PrismaClient, StudentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

// 1. GET DATA (Dengan Pagination)
export async function getMutakhorijin(query: string = '', page: number = 1) {
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const whereCondition = {
    status: StudentStatus.MUTAKHORIJIN,
    OR: query ? [
      { name: { contains: query, mode: 'insensitive' as const } },
      { address: { contains: query, mode: 'insensitive' as const } },
    ] : undefined
  }

  const [data, total] = await prisma.$transaction([
    prisma.student.findMany({
      where: whereCondition,
      orderBy: { graduationYear: 'desc' }, // Sort by Angkatan Mutakhorijin (disimpan di graduationYear atau mutakhorijinBatch sesuai update terakhir)
      skip,
      take: pageSize,
    }),
    prisma.student.count({ where: whereCondition })
  ])

  return { data, total, totalPages: Math.ceil(total / pageSize) }
}

// 2. UPDATE DATA
export async function updateMutakhorijin(prevState: any, formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const nis = formData.get('nis') as string
  const entryYear = Number(formData.get('entryYear'))
  const mutakhorijinBatch = Number(formData.get('mutakhorijinBatch'))
  const address = formData.get('address') as string

  try {
    await prisma.student.update({
      where: { id },
      data: {
        name, nis, entryYear, mutakhorijinBatch, address
      }
    })
    revalidatePath('/dashboard/mutakhorijin')
    return { success: true, message: 'Data mutakhorijin diperbarui!' }
  } catch (error) {
    return { success: false, message: 'Gagal update data.' }
  }
}

// 3. HAPUS PERMANEN (Delete)
export async function deleteMutakhorijin(id: string) {
  try {
    await prisma.student.delete({ where: { id } })
    revalidatePath('/dashboard/mutakhorijin')
    return { success: true, message: 'Data dihapus permanen.' }
  } catch (error) {
    return { success: false, message: 'Gagal menghapus data.' }
  }
}