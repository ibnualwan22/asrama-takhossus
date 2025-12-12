// src/app/actions/user.ts
'use server'

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { hasPermission } from "@/lib/auth-guard"

const prisma = new PrismaClient()

const UserSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z.string().min(4, "Username minimal 4 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  roleId: z.string().min(1, "Role harus dipilih"),
})

// Definisikan tipe return state
export type UserState = {
  error?: {
    name?: string[]
    username?: string[]
    password?: string[]
    roleId?: string[]
  }
  message?: string
  success?: boolean
} | null

export async function createUser(prevState: UserState, formData: FormData): Promise<UserState> {
  // Simulasi delay sedikit agar terlihat loadingnya (opsional)
  // await new Promise(resolve => setTimeout(resolve, 1000))

  const validatedFields = UserSchema.safeParse({
    name: formData.get('name'),
    username: formData.get('username'),
    password: formData.get('password'),
    roleId: formData.get('roleId'),
  })

  if (!validatedFields.success) {
    return { 
      error: validatedFields.error.flatten().fieldErrors,
      message: "Gagal validasi input."
    }
  }

  const { name, username, password, roleId } = validatedFields.data

  try {
    // Cek username kembar
    const existingUser = await prisma.user.findUnique({ where: { username } })
    if (existingUser) {
      return { message: 'Username sudah digunakan, pilih yang lain.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        roleId,
      },
    })

    revalidatePath('/dashboard/users')
    return { success: true, message: 'User berhasil dibuat!' }
  } catch (error) {
    console.error(error)
    return { message: 'Terjadi kesalahan server.' }
  }
}

export async function deleteUser(userId: string) {
  // 1. PASANG SATPAM DI SINI
  const canDelete = await hasPermission("user.delete")
  
  if (!canDelete) {
     // Jika dipanggil via form, ini akan gagal diam-diam atau throw error
     throw new Error("ANDA TIDAK MEMILIKI IZIN UNTUK MENGHAPUS USER!")
  }

  // 2. Lanjut proses hapus jika lolos
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath('/dashboard/users')
}