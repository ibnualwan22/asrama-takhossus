import Link from 'next/link'
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* KOLOM 1: BRANDING */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">AT</div>
               <h2 className="text-xl font-extrabold tracking-tight">Asrama Takhossus</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Mencetak generasi santri yang berwawasan luas, berakhlak mulia, dan siap berkontribusi untuk umat.
            </p>
            <div className="pt-2">
               <p className="text-sm font-bold text-blue-400 italic">"Beramal Ilmiyyah, Berilmu Amaliyyah"</p>
               <p className="text-xs text-slate-500 font-bold mt-1">#TampilBeda</p>
            </div>
          </div>

          {/* KOLOM 2: KONTAK (Request no 12 & 13) */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-2">Hubungi Kami</h3>
            
            <div className="flex items-start gap-3 text-slate-400 text-sm">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p>
                Jalan Kenanga II, Dk. Sidorejo, RT 03 RW 12, Bangsri, Jepara, Jawa Tengah 59453 <br/>
                <span className="text-slate-500 text-xs">(Asrama Takhossus Pasca Amtsilati)</span>
              </p>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <Phone className="w-5 h-5 text-green-500 shrink-0" />
              <a href="https://wa.me/6281230171790" target="_blank" className="hover:text-white transition">
                +62 812-3017-1790 (Admin)
              </a>
            </div>
          </div>

          {/* KOLOM 3: LINK CEPAT */}
          <div className="space-y-4">
             <h3 className="font-bold text-lg mb-2">Akses Cepat</h3>
             <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/program" className="hover:text-blue-400 transition">Program Unggulan</Link></li>
                <li><Link href="/mutakhorijin" className="hover:text-blue-400 transition">Data Mutakhorijin</Link></li>
                <li><Link href="/karya" className="hover:text-blue-400 transition">Karya Tulis Santri</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition">Login Admin</Link></li>
             </ul>
          </div>

          {/* KOLOM 4: SOSIAL MEDIA (Request no 13) */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-2">Ikuti Kami</h3>
            <div className="flex gap-4">
               <a 
                 href="https://www.instagram.com/takhossus_/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-pink-500 hover:bg-pink-600 hover:text-white transition-all hover:scale-110"
               >
                 <Instagram size={20} />
               </a>
               <a 
                 href="https://www.facebook.com/Takhossusbeda?locale=id_ID" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all hover:scale-110"
               >
                 <Facebook size={20} />
               </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
           <p>© {currentYear} Asrama Takhossus Pasca Amtsilati. All rights reserved.</p>
           <p>Developed with ❤️ by Tim IT Takhossus</p>
        </div>
      </div>
    </footer>
  )
}