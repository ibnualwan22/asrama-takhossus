// src/app/dashboard/students/_components/SyncButton.tsx
'use client'

import { useActionState } from 'react'
import { syncStudents } from '@/app/actions/student'
import { RefreshCw, Loader2 } from 'lucide-react'

export default function SyncButton() {
  const [state, formAction, isPending] = useActionState(syncStudents, null)

  return (
    <form action={formAction} className="flex items-center gap-4">
      {state?.message && (
        <span className={`text-sm font-bold ${state.success ? 'text-green-600' : 'text-red-600'} animate-pulse`}>
          {state.message}
        </span>
      )}
      
      <button 
        type="submit" 
        disabled={isPending}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md active:scale-95 disabled:bg-blue-300"
      >
        {isPending ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        {isPending ? 'Sinkronisasi...' : 'Sync Data SIGAP'}
      </button>
    </form>
  )
}