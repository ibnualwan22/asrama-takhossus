// src/components/DashboardCharts.tsx
'use client'

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from 'recharts'

interface ChartProps {
  studentData: any[]
  alumniData: any[]
  contentData: any[]
}

export default function DashboardCharts({ studentData, alumniData, contentData }: ChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* GRAFIK 1: Statistik Santri Masuk (Per Tahun) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Tren Santri Baru (Per Tahun)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={studentData}>
              <defs>
                <linearGradient id="colorStudent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" style={{ fontSize: '12px' }} />
              <YAxis allowDecimals={false} style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="count" stroke="#2563eb" fillOpacity={1} fill="url(#colorStudent)" name="Jumlah Santri" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAFIK 2: Alumni Lulus (Per Tahun) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Statistik Lulusan Alumni</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alumniData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" style={{ fontSize: '12px' }} />
              <YAxis allowDecimals={false} style={{ fontSize: '12px' }} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Jumlah Alumni" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAFIK 3: Produktivitas Konten (Artikel & Galeri per Bulan) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
        <h3 className="font-bold text-gray-800 mb-4">Produktivitas Konten (Tahun Ini)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={contentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" style={{ fontSize: '12px' }} />
              <YAxis allowDecimals={false} style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Line type="monotone" dataKey="articles" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} name="Artikel" />
              <Line type="monotone" dataKey="gallery" stroke="#db2777" strokeWidth={3} dot={{ r: 4 }} name="Galeri Foto" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}