import { PrismaClient } from "@prisma/client"
import AddOrgForm from "./_components/AddOrgForm"
import EditOrgModal from "./_components/EditOrgModal"
import OrgDetailModal from "./_components/OrgDetailModal"
import { deleteOrganization } from "@/app/actions/settings"
import { Trash2 } from "lucide-react"
import DeleteOrgButton from "./_components/DeleteOrgButton" // <--- Import ini

const prisma = new PrismaClient()

export default async function OrganizationPage() {
  // 1. Ambil Organisasi + Riwayat (Hanya yang aktif untuk tampilan default)
  const organizations = await prisma.organization.findMany({
    include: {
      history: {
        where: { isActive: true }, // Ambil struktur yang aktif saja
        include: {
            leader: true,  // Include data santri (ketua)
            advisor: true  // Include data staff (pembimbing)
        },
        take: 1
      }
    },
    orderBy: { order: 'asc' }
  })

  // 2. Data untuk Dropdown (Santri & Staff)
  const students = await prisma.student.findMany({ 
      where: { status: 'ACTIVE' }, 
      orderBy: { name: 'asc' }, 
      select: { id: true, name: true } 
  })
  
  const staff = await prisma.staff.findMany({ 
      where: { isActive: true }, 
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Organisasi Santri</h1>
           <p className="text-gray-500 text-sm">Unit kegiatan dan organisasi intra asrama.</p>
        </div>
        <AddOrgForm students={students} staff={staff} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {organizations.map((org) => {
            // Helper: Ambil data ketua/pembimbing dari array history
            const activeStruct = org.history[0] 
            const leaderName = activeStruct?.leader?.name || "Belum ada ketua"
            const advisorName = activeStruct?.advisor?.name || "Belum ada pembimbing"

            return (
                <div key={org.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-6 flex items-start justify-between">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl border flex items-center justify-center p-2">
                             {org.logo ? <img src={org.logo} className="w-full h-full object-contain"/> : <span className="text-xs font-bold text-gray-300">LOGO</span>}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${org.category === 'KEILMUAN' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                            {org.category}
                        </span>
                    </div>
                    
                    <div className="px-6 pb-4 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{org.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{org.description}</p>
                        
                        <div className="space-y-2 pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400 font-medium">Ketua:</span>
                                <span className="font-bold text-gray-800 text-right truncate w-32">{leaderName}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400 font-medium">Pembimbing:</span>
                                <span className="font-bold text-gray-800 text-right truncate w-32">{advisorName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex gap-2">
                            <OrgDetailModal org={org} />
                            <EditOrgModal org={org} students={students} staff={staff} />
                        </div>
                        
                        {/* GANTI BAGIAN FORM LAMA DENGAN INI */}
                        <DeleteOrgButton id={org.id} />
                        
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  )
}