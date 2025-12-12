// src/app/dashboard/organization/page.tsx
import { PrismaClient } from "@prisma/client"
import AddOrgForm from "./_components/AddOrgForm"
import { Trash2 } from "lucide-react"
import { deleteOrganization } from "@/app/actions/settings"

const prisma = new PrismaClient()

export default async function OrgPage() {
  const orgs = await prisma.organization.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold">Struktur Organisasi</h1>
        <AddOrgForm />
      </div>

      <div className="space-y-4">
        {orgs.map((org) => (
          <div key={org.id} className="bg-white p-4 rounded-xl border flex items-center gap-4">
             <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {org.logo && <img src={org.logo} className="w-full h-full object-cover" />}
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-gray-900">{org.name}</h3>
               <p className="text-sm text-gray-500">{org.description}</p>
             </div>
             <div className="text-sm font-bold bg-gray-100 px-2 rounded">Urutan: {org.order}</div>
             <form action={deleteOrganization.bind(null, org.id)}>
                <button className="text-red-500 p-2"><Trash2 size={18} /></button>
             </form>
          </div>
        ))}
      </div>
    </div>
  )
}