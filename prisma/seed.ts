// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Buat Permissions Dasar (ACL)
  // Format: resource.action
  const permissionsData = [
    // Dashboard
    { action: 'dashboard.view', description: 'Melihat Dashboard' },
    
    // User Management
    { action: 'user.create', description: 'Membuat User Admin' },
    { action: 'user.read', description: 'Melihat List User' },
    { action: 'user.update', description: 'Edit User' },
    { action: 'user.delete', description: 'Hapus User' },
    
    // Role Management
    { action: 'role.manage', description: 'Mengatur Role & Permission' },

    // Student (Santri)
    { action: 'student.sync', description: 'Sinkronisasi data SIGAP' },
    { action: 'student.read', description: 'Melihat data santri' },
    { action: 'student.update', description: 'Edit data tambahan santri' },
    { action: 'student.graduate', description: 'Meluluskan/Alumni santri' },

    // Content (Artikel, Organisasi, Pimpinan)
    { action: 'content.create', description: 'Buat Konten' },
    { action: 'content.update', description: 'Edit Konten' },
    { action: 'content.delete', description: 'Hapus Konten' },

    // Gallery
    { action: 'gallery.manage', description: 'Kelola Galeri' },
  ]

  // Upsert permissions (biar gak error kalau dijalankan 2x)
  for (const perm of permissionsData) {
    await prisma.permission.upsert({
      where: { action: perm.action },
      update: {},
      create: perm,
    })
  }

  // 2. Buat Role Super Admin
  // Ambil semua permission yang baru dibuat
  const allPermissions = await prisma.permission.findMany()

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {
      permissions: {
        connect: allPermissions.map((p) => ({ id: p.id })),
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
  const hashedPassword = await bcrypt.hash('12345678', 10) // Password default

  const superAdmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
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