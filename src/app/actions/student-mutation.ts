// src/app/actions/student-mutation.ts
'use server'

import { PrismaClient, StudentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function mutateStudent(prevState: any, formData: FormData) {
  const studentId = formData.get('studentId') as string
  const statusType = formData.get('statusType') as string
  const graduationYear = formData.get('graduationYear')

  if (!studentId || !statusType) {
    return { success: false, message: 'Data tidak lengkap.' }
  }

  try {
    const status = statusType === 'GRADUATED' 
      ? StudentStatus.ALUMNI_GRADUATED 
      : StudentStatus.ALUMNI_DROPOUT

    // UPDATE LOGIKA: Simpan tahun (graduationYear) apapun statusnya
    // Jika user input tahun, kita simpan.
    const yearToSave = graduationYear ? parseInt(graduationYear as string) : new Date().getFullYear()

    await prisma.student.update({
      where: { id: studentId },
      data: {
        status: status,
        graduationYear: yearToSave // <--- Tidak lagi dicek statusnya harus GRADUATED
      }
    })

    revalidatePath('/dashboard/students') 
    revalidatePath('/dashboard/alumni')   
    
    return { success: true, message: 'Status santri berhasil diperbarui!' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Gagal update status santri.' }
  }
}