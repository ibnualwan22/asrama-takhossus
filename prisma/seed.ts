// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Buat Permissions Dasar (ACL)
  // Format: resource.action
  const permissionsData = [
    // --- Dashboard ---
    { action: 'dashboard.view', description: 'Melihat Dashboard' },
    
    // --- User & Role Management ---
    { action: 'user.create', description: 'Membuat User Admin' },
    { action: 'user.read', description: 'Melihat List User' },
    { action: 'user.update', description: 'Edit User' },
    { action: 'user.delete', description: 'Hapus User' },
    { action: 'role.manage', description: 'Mengatur Role & Permission' },

    // --- Student (Santri & Alumni) ---
    { action: 'student.sync', description: 'Sinkronisasi data SIGAP' },
    { action: 'student.read', description: 'Melihat data santri & alumni' },
    
    // [BARU] Dibutuhkan untuk fitur "Tambah Manual Alumni"
    { action: 'student.create', description: 'Menambah data santri/alumni manual' }, 
    
    { action: 'student.update', description: 'Edit data profil santri/alumni' },
    
    // [BARU] Menggantikan 'student.graduate'. 
    // Digunakan untuk: Meluluskan, Memboyongkan, dan Mengaktifkan Kembali (Reactivate)
    { action: 'student.mutate', description: 'Mutasi Status (Lulus/Boyong/Aktifkan)' },

    // --- Structure (Pengurus & Organisasi) ---
    // [BARU] Persiapan untuk mengamankan halaman Organisasi & Struktur nanti
    { action: 'structure.manage', description: 'Mengelola Struktur Pengurus & Organisasi' },

    // --- Content (Artikel, Prestasi) ---
    { action: 'content.create', description: 'Buat Konten' },
    { action: 'content.update', description: 'Edit Konten' },
    { action: 'content.delete', description: 'Hapus Konten' },

    // --- Gallery ---
    { action: 'gallery.manage', description: 'Kelola Galeri' },
  ]

  // Upsert permissions
  for (const perm of permissionsData) {
    await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description }, // Update deskripsi jika ada perubahan
      create: perm,
    })
  }

  // 2. Buat Role Super Admin (Otomatis dapat semua permission diatas)
  const allPermissions = await prisma.permission.findMany()

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {
      permissions: {
        set: [], // Reset dulu biar bersih
        connect: allPermissions.map((p) => ({ id: p.id })), // Hubungkan ulang semua
      },
    },
    create: {
      name: 'Super Admin',
      description: 'Akses penuh ke seluruh sistem',
      permissions: {
        connect: allPermissions.map((p) => ({ id: p.id })),
      },
    },
  })

  // 3. Buat User Super Admin
  const hashedPassword = await bcrypt.hash('12345678', 10) 

  const superAdmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {
        // Update roleId untuk memastikan dia tetap Super Admin meskipun ID role berubah
        roleId: superAdminRole.id 
    },
    create: {
      username: 'superadmin',
      name: 'IT Asrama Takhossus',
      password: hashedPassword,
      roleId: superAdminRole.id,
    },
  })

  console.log({ superAdmin })
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })  