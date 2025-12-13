'use server'

import { PrismaClient, StudentStatus } from "@prisma/client"

const prisma = new PrismaClient()

// --- 1. DATA PIMPINAN ---
export async function getLeaders() {
  return await prisma.leader.findMany({
    orderBy: { periodStart: 'desc' },
  })
}

// --- 2. DATA JADWAL ---
export async function getDailySchedules() {
  return await prisma.dailySchedule.findMany({
    orderBy: { startTime: 'asc' }
  })
}

// --- 3. DATA PRESTASI ---
export async function getAchievements() {
  return await prisma.achievement.findMany({
    orderBy: { year: 'desc' },
    include: { student: { select: { name: true } } }
  })
}

// --- 4. DATA GALERI (General) ---
export async function getGalleries() {
  return await prisma.gallery.findMany({
    orderBy: { date: 'desc' },
    include: { items: { take: 1 } } 
  })
}

// --- 5. DATA GALERI (Untuk Landing Page) ---
export async function getLatestGalleries(limit: number = 4) {
  return await prisma.gallery.findMany({
    orderBy: { date: 'desc' },
    take: limit,
    include: {
      items: {
        take: 1, // Ambil 1 foto cover
        orderBy: { createdAt: 'asc' }
      },
      _count: { select: { items: true } } // Hitung jumlah foto
    }
  })
}

// --- 6. DETAIL GALERI ---
export async function getGalleryDetail(id: string) {
  return await prisma.gallery.findUnique({
    where: { id },
    include: {
      items: true 
    }
  })
}

// --- 7. ARTIKEL TERBARU (Untuk Slider & List) ---
// (Menggabungkan fungsi yang sebelumnya duplikat)
export async function getLatestPosts(limit: number = 5) {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// --- 8. DETAIL ARTIKEL ---
export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
    // include: { author: ... } <-- DIHAPUS SEMENTARA karena relasi author belum ada di schema
  })
}

export async function getAllMutakhorijinPublic() {
  // Kita ambil SEMUA data (tanpa limit/page) agar grouping angkatan sempurna
  return await prisma.student.findMany({
    where: {
      OR: [
        // 1. Yang statusnya MASIH Mutakhorijin
        { status: StudentStatus.MUTAKHORIJIN },
        
        // 2. ATAU yang sudah Alumni, TAPI punya Batch Mutakhorijin
        { 
          status: { in: [StudentStatus.ALUMNI_GRADUATED, StudentStatus.ALUMNI_DROPOUT] },
          mutakhorijinBatch: { not: null }
        }
      ]
    },
    orderBy: [
      { mutakhorijinBatch: 'asc' }, // Urutkan Angkatan 1, 2, 3...
      { name: 'asc' }
    ]
  })
}