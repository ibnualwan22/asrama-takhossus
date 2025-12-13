import { PrismaClient } from "@prisma/client"
import { Phone, User } from "lucide-react"

const prisma = new PrismaClient()

export const metadata = {
  title: "Struktur Pengurus - Asrama Takhossus",
}

export const revalidate = 60

export default async function PengurusPage() {
  const staffList = await prisma.staff.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  })

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-primary-950 mb-4">Struktur Kepengurusan</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Mengenal lebih dekat para asatidz dan pengurus yang berkhidmat di Asrama Takhossus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
           {staffList.map((staff) => (
             <div key={staff.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group">
                <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                   {staff.photo ? (
                      <img src={staff.photo} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={48}/></div>
                   )}
                   {/* Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition"></div>
                   
                   <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                      <h3 className="font-bold text-lg leading-tight">{staff.name}</h3>
                      <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mt-1">{staff.position}</p>
                   </div>
                </div>
                
                <div className="p-4 bg-white border-t border-gray-100">
                   {staff.whatsapp ? (
                      <a href={`https://wa.me/${staff.whatsapp}`} target="_blank" className="block w-full text-center py-2 bg-green-50 text-green-700 font-bold text-sm rounded-lg hover:bg-green-600 hover:text-white transition">
                         Chat WhatsApp
                      </a>
                   ) : (
                      <span className="block w-full text-center py-2 text-gray-400 text-sm font-medium bg-gray-50 rounded-lg cursor-not-allowed">
                         Kontak Privat
                      </span>
                   )}
                </div>
             </div>
           ))}
        </div>
        
      </div>
    </div>
  )
}