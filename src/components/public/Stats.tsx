import { Users, GraduationCap, Building2, BookOpen } from 'lucide-react'

type StatsProps = {
  counts: {
    students: number
    mutakhorijin: number
    alumni: number
    organizations: number
  }
}

export default function Stats({ counts }: StatsProps) {
  const stats = [
    { label: "Santri Aktif", value: counts.students, icon: Users, color: "text-blue-500" },
    { label: "Mutakhorijin", value: counts.mutakhorijin, icon: BookOpen, color: "text-purple-500" },
    { label: "Alumni", value: counts.alumni, icon: GraduationCap, color: "text-green-500" },
    { label: "Organisasi", value: counts.organizations, icon: Building2, color: "text-orange-500" },
  ]

  return (
    <section className="py-12 bg-white relative z-20 -mt-10 mx-4 md:mx-12 rounded-2xl shadow-xl border border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-4 group hover:-translate-y-1 transition-transform duration-300">
              <div className={`mx-auto w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-gray-100 transition-colors`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
                {stat.value}+
              </h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}