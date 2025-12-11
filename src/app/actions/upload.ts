'use server'

import { v2 as cloudinary } from 'cloudinary'
import dns from 'node:dns'

// Paksa IPv4 (kadang bantu di Linux / WSL)
dns.setDefaultResultOrder('ipv4first')

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadImage(formData: FormData) {
  console.log('=== CLOUDINARY UPLOAD START ===')

  const file = formData.get('file') as File | null

  if (!file) {
    console.error('❌ Tidak ada file di FormData')
    return { success: false, url: '', message: 'Tidak ada file dipilih' }
  }

  console.log('✅ File diterima:', {
    name: file.name,
    size: file.size,
    type: file.type,
  })

  try {
    console.log('➡️ Convert File → ArrayBuffer')
    const arrayBuffer = await file.arrayBuffer()

    console.log('➡️ Convert ArrayBuffer → Buffer')
    const buffer = Buffer.from(arrayBuffer)

    console.log('➡️ Mulai upload ke Cloudinary...')
    console.time('cloudinary_upload_time')

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'asrama-takhossus',
          timeout: 60000, // 60 detik
        },
        (error, result) => {
          console.timeEnd('cloudinary_upload_time')

          if (error) {
            console.error('❌ Cloudinary callback error')
            reject(error)
          } else {
            console.log('✅ Cloudinary upload success')
            resolve(result)
          }
        }
      )

      // Kirim buffer ke stream
      stream.end(buffer)
    })

    console.log('✅ Upload selesai:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
    })

    console.log('=== CLOUDINARY UPLOAD END (SUCCESS) ===')
    return { success: true, url: result.secure_url, message: 'Upload berhasil' }

  } catch (error: any) {
    console.error('=== CLOUDINARY UPLOAD ERROR ===')
    console.error('RAW ERROR:', error)

    console.error('DETAIL ERROR:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      errno: error?.errno,
      syscall: error?.syscall,
      address: error?.address,
      port: error?.port,
      stack: error?.stack,
    })

    console.log('=== CLOUDINARY UPLOAD END (FAILED) ===')

    return { success: false, url: '', message: 'Gagal upload gambar' }
  }
}
