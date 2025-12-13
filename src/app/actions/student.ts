'use server'

import { PrismaClient, StudentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { uploadImage } from "./upload"
import { requirePermission } from "@/lib/auth-guard" // Pastikan path ini benar

const prisma = new PrismaClient()

// --- TIPE DATA ---
type SigapStudent = {
  id: string
  name: string
  nis: string
  activeDormitory: string
  gender?: string 
  formalClass: string
  dormitoryRoom: string
  ttl: string 
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

// --- 1. SINKRONISASI DATA (DIPROTEKSI) ---
export async function syncStudents(prevState: SyncState): Promise<SyncState> {
  // A. CEK IZIN (RBAC)
  // Jika user tidak punya izin 'student.sync', kode akan berhenti & throw error
  try {
    await requirePermission("student.sync") 
  } catch (error: any) {
    return { success: false, message: error.message }
  }

  try {
    // B. FETCH DATA DARI API SIGAP
    const response = await fetch('https://sigap.amtsilatipusat.com/api/student?limit=5000', {
      cache: 'no-store' 
    })

    if (!response.ok) throw new Error("Gagal mengambil data dari server SIGAP")

    const json = await response.json()
    const apiData: SigapStudent[] = json.data

    let processedCount = 0

    // C. PROSES DATA
    for (const item of apiData) {
      // Filter: Hanya Asrama TAKHOSSUS & Putra
      const isTakhossus = item.activeDormitory?.toUpperCase()?.includes('TAKHOSSUS')
      const isPutra = item.gender?.toUpperCase() === 'PUTRA' // Hapus baris ini jika API tidak kirim gender

      if (!isTakhossus || !isPutra) continue; 

      // Parsing Tahun Masuk dari NIS (Contoh: A21... -> 2021)
      let entryYear = new Date().getFullYear()
      const nisYearStr = item.nis.match(/[A-Z](\d{2})/)?.[1]
      if (nisYearStr) {
        entryYear = 2000 + parseInt(nisYearStr)
      }

      // Parsing TTL yang Lebih Aman
      let placeOfBirth = ''
      let dateOfBirth: Date | null = null
      
      if (item.ttl) {
        if (item.ttl.includes(',')) {
          const parts = item.ttl.split(',')
          placeOfBirth = parts[0].trim()
          // Coba simpan string tanggalnya, atau convert jika perlu
          // Untuk simplifikasi kita simpan raw string dulu atau null jika logic date complex
          // dateOfBirth = new Date(parts.slice(1).join(',').trim()) 
        } else {
          placeOfBirth = item.ttl // Fallback
        }
      }

      // Upsert ke Database
      await prisma.student.upsert({
        where: { nis: item.nis },
        update: {
          name: item.name,
          activeDormitory: item.activeDormitory,
          dormitoryRoom: item.dormitoryRoom,
          formalClass: item.formalClass,
          placeOfBirth: placeOfBirth,
          // dateOfBirth: dateOfBirth, // Aktifkan jika tipe di schema DateTime
          address: item.regency, // Kita ambil Kabupaten saja sesuai request
          parentPhone: item.parrentPhone,
          fatherName: item.fatherName,
          motherName: item.motherName,
          sigapId: item.id,
        },
        create: {
          nis: item.nis,
          name: item.name,
          activeDormitory: item.activeDormitory,
          dormitoryRoom: item.dormitoryRoom,
          formalClass: item.formalClass,
          placeOfBirth: placeOfBirth,
          address: item.regency,
          parentPhone: item.parrentPhone,
          fatherName: item.fatherName,
          motherName: item.motherName,
          sigapId: item.id,
          entryYear: entryYear,
          status: StudentStatus.ACTIVE, 
        }
      })

      processedCount++
    }

    revalidatePath('/dashboard/students')
    return { 
      success: true, 
      message: `Sukses! ${processedCount} santri berhasil disinkronkan.`,
      count: processedCount
    }

  } catch (error) {
    console.error("Sync Error:", error)
    return { success: false, message: 'Terjadi kesalahan saat menghubungi server SIGAP.' }
  }
}

// --- 2. GET DATA (PAGINATION & SEARCH) ---
export async function getStudents(query: string = '', page: number = 1) {
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const whereCondition = {
    status: StudentStatus.ACTIVE, // Hanya Santri Aktif
    AND: query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { nis: { contains: query, mode: 'insensitive' as const } },
        { address: { contains: query, mode: 'insensitive' as const } },
        { formalClass: { contains: query, mode: 'insensitive' as const } },
      ]
    } : undefined
  }

  const [data, total] = await prisma.$transaction([
    prisma.student.findMany({
      where: whereCondition,
      orderBy: [
        { activeDormitory: 'asc' }, // Urut Asrama
        { name: 'asc' }             // Lalu Nama
      ],
      skip,
      take: pageSize,
    }),
    prisma.student.count({ where: whereCondition })
  ])

  return { data, total, totalPages: Math.ceil(total / pageSize) }
}

// --- 3. UPLOAD FOTO ---
export async function uploadStudentPhotoAction(prevState: any, formData: FormData) {
  const studentId = formData.get('studentId') as string
  const file = formData.get('file') as File

  if (!studentId || !file) {
    return { success: false, message: "Data tidak lengkap" }
  }

  try {
    const uploadRes = await uploadImage(formData)

    if (!uploadRes.success) {
      return { success: false, message: uploadRes.message }
    }

    await prisma.student.update({
      where: { id: studentId },
      data: { photo: uploadRes.url }
    })

    // Revalidate semua path terkait
    revalidatePath('/dashboard/students')
    revalidatePath('/dashboard/mutakhorijin')
    revalidatePath('/dashboard/alumni')
    
    return { success: true, message: "Foto berhasil diperbarui!" }

  } catch (error) {
    console.error(error)
    return { success: false, message: "Terjadi kesalahan server" }
  }
}