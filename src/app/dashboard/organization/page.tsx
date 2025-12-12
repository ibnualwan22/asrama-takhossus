// src/app/dashboard/organization/page.tsx
import { PrismaClient } from "@prisma/client"
import { Trash2, Briefcase, BookOpen, Music } from "lucide-react"
import { deleteOrganization } from "@/app/actions/settings"
// Imports
import AddOrgForm from "./_components/AddOrgForm"
import EditOrgModal from "./_components/EditOrgModal"
import OrgDetailModal from "./_components/OrgDetailModal"

const prisma = new PrismaClient()

export default async function OrgPage() {
  // Ambil Data Organisasi + Relasinya
  const orgs = await prisma.organization.findMany({ 
    orderBy: { order: 'asc' },
    include: { leader: true, advisor: true } // Include relasi
  })

  // Ambil Data Master untuk Dropdown
  const students = await prisma.student.findMany({ where: { status: 'ACTIVE' }, select: { id: true, name: true } })
  const staff = await prisma.staff.findMany({ select: { id: true, name: true } })

  // Pisahkan Data
  const keilmuan = orgs.filter(o => o.category === 'KEILMUAN')
  const kesenian = orgs.filter(o => o.category === 'KESENIAN')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg"><Briefcase size={24} /></div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Data Organisasi</h1>
            <p className="text-gray-500 text-sm font-medium">Manajemen Organisasi Yang Ada Di Asrama Takhossus</p>
          </div>
        </div>
        <AddOrgForm students={students} staff={staff} />
      </div>

      {/* SECTION 1: KEILMUAN */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-blue-600" size={20}/>
          <h2 className="text-xl font-bold text-gray-800">Bidang Keilmuan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keilmuan.map((org) => <OrgCard key={org.id} org={org} students={students} staff={staff} />)}
          {keilmuan.length === 0 && <p className="text-gray-400 italic text-sm">Belum ada organisasi keilmuan.</p>}
        </div>
      </div>

      {/* SECTION 2: KESENIAN */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Music className="text-pink-600" size={20}/>
          <h2 className="text-xl font-bold text-gray-800">Bidang Kesenian & Minat Bakat</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kesenian.map((org) => <OrgCard key={org.id} org={org} students={students} staff={staff} />)}
          {kesenian.length === 0 && <p className="text-gray-400 italic text-sm">Belum ada organisasi kesenian.</p>}
        </div>
      </div>
    </div>
  )
}

// Komponen Card Kecil
function OrgCard({ org, students, staff }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
       <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border">
          {org.logo ? <img src={org.logo} className="w-full h-full object-contain" /> : <div className="flex items-center justify-center h-full text-gray-300 font-bold text-xs">No Logo</div>}
       </div>
       
       <div className="flex-1 min-w-0">
         <h3 className="font-bold text-gray-900 truncate">{org.name}</h3>
         <p className="text-xs text-gray-500 line-clamp-1">{org.description}</p>
         <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
            <span className="bg-gray-100 px-1.5 py-0.5 rounded">Ketua: {org.leader?.name.split(' ')[0] || '-'}</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded">Urutan: {org.order}</span>
         </div>
       </div>

       <div className="flex flex-col gap-1 border-l pl-3">
          <OrgDetailModal org={org} />
          <EditOrgModal org={org} students={students} staff={staff} />
          <form action={async () => { 'use server'; await deleteOrganization(org.id) }}>
            <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16} /></button>
          </form>
       </div>
    </div>
  )
}