'use client'

import { RotateCcw, Lock } from 'lucide-react'
import { reactivateStudent } from '@/app/actions/alumni'

// Perbaikan: Tambahkan canMutate ke tipe props
export default function ReactivateButton({ 
  id, 
  name, 
  canMutate 
}: { 
  id: string, 
  name: string, 
  canMutate: boolean 
}) {
  
  const handleReactivate = async () => {
    const confirmMsg = `PERINGATAN!\n\nAnda akan mengembalikan "${name}" menjadi SANTRI AKTIF.\nData tahun keluar/lulus akan dihapus.\n\nLanjutkan?`
    
    if (confirm(confirmMsg)) {
      const res = await reactivateStudent(id)
      alert(res.message)
    }
  }

  // Jika tidak punya izin, tampilkan ikon gembok
  if (!canMutate) {
    return (
      <button disabled className="p-2 text-gray-300 cursor-not-allowed" title="Anda tidak memiliki izin mutasi">
        <Lock size={18} />
      </button>
    )
  }

  return (
    <button 
      onClick={handleReactivate}
      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
      title="Aktifkan Kembali (Batal Alumni)"
    >
      <RotateCcw size={18} />
    </button>
  )
}