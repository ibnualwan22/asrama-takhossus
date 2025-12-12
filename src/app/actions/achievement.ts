'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const prisma = new PrismaClient()

export async function createAchievement(prevState: any, formData: FormData) {
  const studentId = formData.get('studentId') as string
  const title = formData.get('title') as string
  const level = formData.get('level') as string
  const year = Number(formData.get('year'))
  const photo = formData.get('photoUrl') as string

  if (!studentId || !title) return { message: "Data tidak lengkap" }

  try {
    await prisma.achievement.create({
      data: { studentId, title, level, year, photo }
    })
    revalidatePath('/dashboard/achievements')
    return { success: true }
  } catch (e) {
    return { message: "Gagal menyimpan prestasi" }
  }
}

export async function deleteAchievement(id: string) {
  await prisma.achievement.delete({ where: { id } })
  revalidatePath('/dashboard/achievements')
}