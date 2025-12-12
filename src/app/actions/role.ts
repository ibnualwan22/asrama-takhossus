'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

// 1. TAMBAH ROLE BARU
export async function createRole(formData: FormData) {
  const name = formData.get("name") as string
  
  if (!name) return { success: false, message: "Nama role wajib diisi" }

  try {
    await prisma.role.create({
      data: { name }
    })
    revalidatePath("/dashboard/roles")
    return { success: true, message: "Role berhasil dibuat" }
  } catch (error) {
    return { success: false, message: "Gagal membuat role (Nama mungkin duplikat)" }
  }
}

// 2. HAPUS ROLE
export async function deleteRole(id: string) {
  try {
    const role = await prisma.role.findUnique({ where: { id } })
    if (role?.name === 'Super Admin') {
        return { success: false, message: "Super Admin tidak boleh dihapus!" }
    }

    await prisma.role.delete({ where: { id } })
    revalidatePath("/dashboard/roles")
    return { success: true, message: "Role dihapus" }
  } catch (error) {
    return { success: false, message: "Gagal menghapus role" }
  }
}

// 3. TOGGLE PERMISSION (CHECKLIST)
export async function togglePermission(roleId: string, permissionId: string, isChecked: boolean) {
  try {
    // Cek Role dulu (Opsional: Proteksi Super Admin agar tidak bisa dikurangi haknya)
    const role = await prisma.role.findUnique({ where: { id: roleId } })
    if (role?.name === 'Super Admin') {
        // Uncomment baris bawah jika ingin Super Admin MUTLAK (tidak bisa diedit via UI)
        // return { success: false, message: "Permission Super Admin bersifat permanen." }
    }

    if (isChecked) {
        // Connect (Centang)
        await prisma.role.update({
            where: { id: roleId },
            data: {
                permissions: {
                    connect: { id: permissionId }
                }
            }
        })
    } else {
        // Disconnect (Uncentang)
        await prisma.role.update({
            where: { id: roleId },
            data: {
                permissions: {
                    disconnect: { id: permissionId }
                }
            }
        })
    }

    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Gagal update permission" }
  }
}