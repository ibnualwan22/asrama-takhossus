'use client'

import { BookOpen, Users, Globe, Mic2, Star, Clock } from 'lucide-react'

export default function ProgramSection() {
  const programs = [
    {
      title: "Kurikulum Akselerasi",
      desc: "Menggunakan kurikulum kompetisi dan kompetensi dengan target waktu belajar 2,5 tahun sampai lulus.",
      icon: Clock,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Takhossus Kitab Kuning",
      desc: "Fokus utama pada pendalaman Turats (Kitab Kuning) sebagai bekal utama faqih fiddin.",
      icon: BookOpen,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Organisasi Santri",
      desc: "Wadah pengembangan soft-skill kepemimpinan dan manajemen melalui organisasi (Kesenian & Keilmuan).",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Bahtsul Masail",
      desc: "Kegiatan rutin musyawarah untuk melatih nalar kritis dan pemecahan masalah hukum Islam.",
      icon: Star, // Bisa diganti icon lain
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Bilingual Area",
      desc: "Penerapan Bahasa Arab dan Inggris dalam keseharian untuk menunjang wawasan global.",
      icon: Globe,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Public Speaking",
      desc: "Program dakwah rutin untuk melatih mental dan kemampuan retorika di depan umum.",
      icon: Mic2,
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <section id="program" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Program Unggulan
          </h2>
          <p className="text-gray-500 text-lg">
            Kami merancang kurikulum integratif untuk mencetak santri yang tidak hanya 'alim dalam agama, 
            tapi juga cakap dalam kehidupan sosial.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, idx) => (
            <div 
              key={idx} 
              className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl ${program.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <program.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {program.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {program.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}