'use client'

import { RotateCcw } from 'lucide-react'
import { reactivateStudent } from '@/app/actions/alumni'

export default function ReactivateButton({ id, name }: { id: string, name: string }) {
  const handleReactivate = async () => {
    const confirmMsg = `PERINGATAN!\n\nAnda akan mengembalikan "${name}" menjadi SANTRI AKTIF.\nData tahun keluar/lulus akan dihapus.\n\nLanjutkan?`
    
    if (confirm(confirmMsg)) {
      const res = await reactivateStudent(id)
      if (res.success) alert(res.message)
      else alert(res.message)
    }
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