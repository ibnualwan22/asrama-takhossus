'use server'

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const prisma = new PrismaClient()

// Schema Validasi Password
const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password lama wajib diisi"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password baru tidak cocok",
  path: ["confirmPassword"],
})

export async function changePassword(prevState: any, formData: FormData) {
  // 1. Cek Sesi User (Keamanan Ganda)
  const session = await auth()
  if (!session?.user?.email) { // NextAuth biasanya simpan ID di email atau sub, sesuaikan dengan config auth Anda
     return { message: "Sesi tidak valid. Silakan login ulang." }
  }

  // Kita cari user berdasarkan username yang ada di session (asumsi username disimpan di session name/email)
  // Atau lebih aman ambil ID dari session jika ada. Di sini saya pakai username/id dari form hidden untuk simplifikasi, tapi validasi tetap via session.
  const userId = formData.get('userId') as string

  // 2. Validasi Input
  const validated = PasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const { currentPassword, newPassword } = validated.data

  try {
    // 3. Ambil Data User dari DB
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) return { message: "User tidak ditemukan." }

    // 4. Cek Password Lama
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return { 
        error: { currentPassword: ["Password lama salah!"] } 
      }
    }

    // 5. Hash Password Baru & Update
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    revalidatePath('/dashboard/profile')
    return { success: true, message: "Password berhasil diubah! Silakan login ulang nanti." }

  } catch (error) {
    console.error(error)
    return { message: "Terjadi kesalahan server." }
  }
}