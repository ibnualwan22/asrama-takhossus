// src/app/actions/student.ts
'use server'

import { PrismaClient, StudentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { uploadImage } from "./upload"

const prisma = new PrismaClient()

// Tipe Data dari API SIGAP (Sesuaikan field yg tersedia)
type SigapStudent = {
  id: string
  name: string
  nis: string
  activeDormitory: string
  gender?: string // Kita asumsikan ada field ini
  formalClass: string
  dormitoryRoom: string
  ttl: string // Format: "Tempat, 8 Juli 2009"
  parrentPhone: string
  fatherName: string
  motherName: string
  regency: string
}

type SyncState = {
  success?: boolean
  message: string
  count?: number
} | null

export async function syncStudents(prevState: SyncState): Promise<SyncState> {
  try {
    // 1. Fetch Data dari API SIGAP
    // Limit kita set besar untuk mengambil banyak data sekaligus
    const response = await fetch('https://sigap.amtsilatipusat.com/api/student?limit=5000', {
      cache: 'no-store' // Pastikan selalu dapat data terbaru
    })

    if (!response.ok) throw new Error("Gagal mengambil data dari SIGAP")

    const json = await response.json()
    const apiData: SigapStudent[] = json.data

    let processedCount = 0

    // 2. Proses setiap data
    for (const item of apiData) {
      // 3. FILTERING KETAT
      // Pastikan Active Dormitory = TAKHOSSUS (Case Insensitive jaga-jaga)
      // Pastikan Gender = PUTRA
      const isTakhossus = item.activeDormitory?.toUpperCase() === 'TAKHOSSUS'
      const isPutra = item.gender?.toUpperCase() === 'PUTRA'

      // Jika tidak memenuhi syarat, skip
      // Catatan: Jika field gender tidak ada di respon API, hapus bagian `&& isPutra`
      if (!isTakhossus || !isPutra) continue; 

      // 4. Parsing Data
      
      // A. Parsing Tahun Masuk dari NIS (Contoh: A21... -> 2021)
      // Logika: Ambil 2 digit setelah huruf pertama
      let entryYear = new Date().getFullYear() // Default tahun sekarang
      const nisYearStr = item.nis.match(/[A-Z](\d{2})/)?.[1] // Regex ambil 2 angka setelah huruf
      if (nisYearStr) {
        entryYear = 2000 + parseInt(nisYearStr)
      }

      // B. Parsing TTL (Contoh: "Serang, 8 Juli 2009")
      let placeOfBirth = ''
      let dateOfBirth = ''
      if (item.ttl && item.ttl.includes(',')) {
        const parts = item.ttl.split(',')
        placeOfBirth = parts[0].trim()
        dateOfBirth = parts.slice(1).join(',').trim() // Sisa bagiannya adalah tanggal
      }

      // 5. Simpan ke Database (Upsert)
      await prisma.student.upsert({
        where: { nis: item.nis }, // Cek berdasarkan NIS
        update: {
          // Update data terbaru jika ada perubahan di SIGAP
          name: item.name,
          activeDormitory: item.activeDormitory,
          dormitoryRoom: item.dormitoryRoom,
          formalClass: item.formalClass,
          placeOfBirth: placeOfBirth,
          dateOfBirth: dateOfBirth, // Simpan string dulu
          address: item.regency,
          parentPhone: item.parrentPhone,
          fatherName: item.fatherName,
          motherName: item.motherName,
          sigapId: item.id,
          // Jangan update status/foto jika sudah diset manual di sistem kita
        },
        create: {
          nis: item.nis,
          name: item.name,
          activeDormitory: item.activeDormitory,
          dormitoryRoom: item.dormitoryRoom,
          formalClass: item.formalClass,
          placeOfBirth: placeOfBirth,
          dateOfBirth: dateOfBirth,
          address: item.regency,
          parentPhone: item.parrentPhone,
          fatherName: item.fatherName,
          motherName: item.motherName,
          sigapId: item.id,
          entryYear: entryYear,
          status: StudentStatus.ACTIVE, // Default Aktif
        }
      })

      processedCount++
    }

    revalidatePath('/dashboard/students')
    return { 
      success: true, 
      message: `Berhasil sinkronisasi. ${processedCount} santri Takhossus Putra diperbarui.`,
      count: processedCount
    }

  } catch (error) {
    console.error("Sync Error:", error)
    return { success: false, message: 'Terjadi kesalahan saat sinkronisasi API.' }
  }
}

// Fungsi bantu untuk mengambil data (Server Component Only)
export async function getStudents(query: string = '', page: number = 1) {
  const pageSize = 20
  const skip = (page - 1) * pageSize

  // UPDATE: Tambahkan status: StudentStatus.ACTIVE ke dalam filter
  const whereCondition = {
    status: StudentStatus.ACTIVE, // <--- INI KUNCINYA
    AND: query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { nis: { contains: query, mode: 'insensitive' as const } },
        { address: { contains: query, mode: 'insensitive' as const } },
      ]
    } : undefined
  }

  const [data, total] = await prisma.$transaction([
    prisma.student.findMany({
      where: whereCondition,
      orderBy: { name: 'asc' },
      skip,
      take: pageSize,
    }),
    prisma.student.count({ where: whereCondition })
  ])

  return { data, total, totalPages: Math.ceil(total / pageSize) }
}

export async function updateStudentPhoto(studentId: string, photoUrl: string) {
  try {
    await prisma.student.update({
      where: { id: studentId },
      data: { photo: photoUrl }
    })
    
    revalidatePath('/dashboard/students')
    return { success: true, message: 'Foto santri berhasil diperbarui!' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Gagal update foto.' }
  }
}
export async function uploadStudentPhotoAction(prevState: any, formData: FormData) {
  const studentId = formData.get('studentId') as string
  const file = formData.get('file') as File

  if (!studentId || !file) {
    return { success: false, message: "Data tidak lengkap" }
  }

  try {
    // 1. Upload ke Cloudinary (Server Side)
    const uploadRes = await uploadImage(formData)

    if (!uploadRes.success) {
      return { success: false, message: uploadRes.message }
    }

    // 2. Update Database dengan URL baru
    await prisma.student.update({
      where: { id: studentId },
      data: { photo: uploadRes.url }
    })

    revalidatePath('/dashboard/students')
    return { success: true, message: "Foto berhasil diperbarui!" }

  } catch (error) {
    console.error(error)
    return { success: false, message: "Terjadi kesalahan server" }
  }
}