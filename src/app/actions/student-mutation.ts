'use server'

import { PrismaClient, StudentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

// 1. MUTASI DARI SANTRI AKTIF
export async function mutateStudent(prevState: any, formData: FormData) {
  const studentId = formData.get('studentId') as string
  const statusType = formData.get('statusType') as string
  const inputNumber = formData.get('inputNumber') // Angka dari form

  if (!studentId || !statusType) return { success: false, message: 'Data tidak lengkap.' }

  try {
    const numberVal = inputNumber ? parseInt(inputNumber as string) : new Date().getFullYear()

    if (statusType === 'MUTAKHORIJIN') {
      // KASUS A: JADI MUTAKHORIJIN
      // Simpan Angkatan, Tahun Keluar (graduationYear) NULL dulu karena masih di asrama
      await prisma.student.update({
        where: { id: studentId },
        data: { 
          status: StudentStatus.MUTAKHORIJIN,
          mutakhorijinBatch: numberVal, 
          graduationYear: null 
        }
      })
    } else {
      // KASUS B: LANGSUNG BOYONG (DROPOUT)
      // Simpan Tahun Keluar, Angkatan Mutakhorijin NULL
      await prisma.student.update({
        where: { id: studentId },
        data: { 
          status: StudentStatus.ALUMNI_DROPOUT,
          graduationYear: numberVal,
          mutakhorijinBatch: null
        }
      })
    }

    revalidatePath('/dashboard/students') 
    revalidatePath('/dashboard/mutakhorijin') 
    revalidatePath('/dashboard/alumni')   
    
    return { success: true, message: 'Status santri berhasil diperbarui!' }
  } catch (error) {
    return { success: false, message: 'Gagal update status santri.' }
  }
}

// 2. MUTASI DARI MUTAKHORIJIN KE ALUMNI (BOYONG)
export async function graduateMutakhorijin(prevState: any, formData: FormData) {
  const studentId = formData.get('studentId') as string
  const exitYear = formData.get('exitYear') // Tahun Keluar

  if (!studentId || !exitYear) {
    return { success: false, message: 'Tahun keluar wajib diisi.' }
  }

  try {
    // Status berubah jadi ALUMNI_GRADUATED
    // Kita UPDATE graduationYear (Tahun Keluar), tapi JANGAN HAPUS mutakhorijinBatch
    await prisma.student.update({
      where: { id: studentId },
      data: { 
        status: StudentStatus.ALUMNI_GRADUATED, 
        graduationYear: parseInt(exitYear as string) 
      }
    })

    revalidatePath('/dashboard/mutakhorijin')
    revalidatePath('/dashboard/alumni')
    
    return { success: true, message: 'Status berhasil diperbarui jadi Alumni!' }
  } catch (error) {
    return { success: false, message: 'Gagal memproses data.' }
  }
}