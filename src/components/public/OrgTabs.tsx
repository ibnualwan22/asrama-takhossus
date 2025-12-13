'use client'

import { useState } from 'react'
import { Award, Palette, User, Users } from 'lucide-react'

// PERBAIKAN TIPE DATA (Allow null pada name)
type Org = {
  id: string
  name: string
  description: string
  category: 'KEILMUAN' | 'KESENIAN'
  logo: string | null
  history: {
    leader: { name: string | null } | null  // <--- Ubah jadi string | null
    advisor: { name: string | null } | null // <--- Ubah jadi string | null
  }[]
}

export default function OrgTabs({ organizations }: { organizations: Org[] }) {
  const [activeTab, setActiveTab] = useState<'KEILMUAN' | 'KESENIAN'>('KEILMUAN')

  const filteredOrgs = organizations.filter(o => o.category === activeTab)

  return (
    <div className="space-y-8">
      
      {/* TOMBOL TABS */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('KEILMUAN')}
          className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
            activeTab === 'KEILMUAN' 
              ? 'bg-blue-600 text-white shadow-lg scale-105' 
              : 'bg-white text-gray-500 border hover:bg-gray-50'
          }`}
        >
          <Award size={18} /> Keilmuan
        </button>
        <button
          onClick={() => setActiveTab('KESENIAN')}
          className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
            activeTab === 'KESENIAN' 
              ? 'bg-pink-600 text-white shadow-lg scale-105' 
              : 'bg-white text-gray-500 border hover:bg-gray-50'
          }`}
        >
          <Palette size={18} /> Kesenian
        </button>
      </div>

      {/* GRID KONTEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
        {filteredOrgs.map((org) => {
           const currentStruct = org.history[0]

           return (
            <div key={org.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
              
              {/* Header Logo & Nama */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center shrink-0 ${activeTab === 'KEILMUAN' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                   {org.logo ? (
                     <img src={org.logo} alt={org.name} className="w-full h-full object-contain p-1" />
                   ) : (
                     <Users size={32} />
                   )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {org.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{org.description}</p>
                </div>
              </div>

              <hr className="border-gray-100 mb-4" />

              {/* Info Struktural */}
              <div className="space-y-3 text-sm">
                 <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-gray-400"><User size={14}/></div>
                    <div>
                       <span className="text-xs font-bold text-gray-500 block uppercase">Ketua</span>
                       <span className="font-medium text-gray-900">
                          {currentStruct?.leader?.name || '-'}
                       </span>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-gray-400"><Award size={14}/></div>
                    <div>
                       <span className="text-xs font-bold text-gray-500 block uppercase">Pembimbing</span>
                       <span className="font-medium text-gray-900">
                          {currentStruct?.advisor?.name || '-'}
                       </span>
                    </div>
                 </div>
              </div>

            </div>
           )
        })}

        {filteredOrgs.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
            Belum ada organisasi di kategori ini.
          </div>
        )}
      </div>

    </div>
  )
}