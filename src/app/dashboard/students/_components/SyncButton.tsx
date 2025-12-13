'use client'

import { useActionState } from 'react'
import { syncStudents } from '@/app/actions/student'
import { RefreshCw, Loader2, Lock } from 'lucide-react'

export default function SyncButton({ canSync }: { canSync: boolean }) {
  const [state, formAction, isPending] = useActionState(syncStudents, null)

  // Jika tidak punya izin, tombol dirender mati (disabled) atau tidak dirender sama sekali
  if (!canSync) {
    return (
        <button disabled className="flex items-center gap-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-bold text-sm cursor-not-allowed opacity-70" title="Anda tidak memiliki izin sinkronisasi">
            <Lock className="w-4 h-4" /> Akses Dikunci
        </button>
    )
  }

  return (
    <form action={formAction} className="flex items-center gap-4">
      {state?.message && (
        <span className={`text-sm font-bold ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </span>
      )}
      
      <button 
        type="submit" 
        disabled={isPending}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md active:scale-95 disabled:bg-blue-300 text-sm"
      >
        {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
        {isPending ? 'Sinkronisasi...' : 'Sync SIGAP'}
      </button>
    </form>
  )
}