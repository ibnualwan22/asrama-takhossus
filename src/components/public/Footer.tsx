'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [logoError, setLogoError] = useState(false)

  return (
    <footer className="bg-primary-950 text-white pt-20 pb-10 border-t border-primary-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* ================= KOLOM 1: BRANDING ================= */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 border-2 border-secondary-500">
                {!logoError ? (
                  <img
                    src="/logo.png"
                    alt="Logo Asrama Takhossus"
                    className="w-full h-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-primary-700 font-bold text-xl">AT</span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-extrabold tracking-tight leading-none">
                  Asrama Takhossus
                </h2>
                <p className="text-xs text-primary-200">
                  Pasca Amtsilati
                </p>
              </div>
            </div>

            <p className="text-primary-200 text-sm leading-relaxed">
              Mencetak generasi santri yang berwawasan luas, berakhlak mulia,
              dan siap berkontribusi untuk umat.
            </p>

            <div className="pt-2 border-t border-primary-800/50">
              <p className="text-sm font-bold text-secondary-400 italic">
                "Beramal Ilmiyyah, Berilmu Amaliyyah"
              </p>
            </div>
          </div>

          {/* ================= KOLOM 2: KONTAK ================= */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-b-2 border-secondary-500 w-fit pb-1">
              Hubungi Kami
            </h3>

            <div className="flex items-start gap-3 text-primary-100 text-sm">
              <MapPin className="w-5 h-5 text-secondary-500 shrink-0 mt-0.5" />
              <p>
                Jalan Kenanga II, Dk. Sidorejo, RT 03 RW 12,
                Bangsri, Jepara, Jawa Tengah 59453
              </p>
            </div>

            <div className="flex items-center gap-3 text-primary-100 text-sm">
              <Phone className="w-5 h-5 text-secondary-500 shrink-0" />
              <a
                href="https://wa.me/6281230171790"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-400 transition font-mono"
              >
                +62 812-3017-1790 (Admin)
              </a>
            </div>
          </div>

          {/* ================= KOLOM 3: LINK CEPAT ================= */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-b-2 border-secondary-500 w-fit pb-1">
              Akses Cepat
            </h3>

            <ul className="space-y-3 text-sm text-primary-200">
              <li>
                <Link href="/program" className="hover:text-secondary-400 transition flex items-center gap-2">
                  <span>&rsaquo;</span> Program Unggulan
                </Link>
              </li>
              <li>
                <Link href="/mutakhorijin" className="hover:text-secondary-400 transition flex items-center gap-2">
                  <span>&rsaquo;</span> Data Mutakhorijin
                </Link>
              </li>
              <li>
                <Link href="/karya" className="hover:text-secondary-400 transition flex items-center gap-2">
                  <span>&rsaquo;</span> Karya Tulis Santri
                </Link>
              </li>
              
            </ul>
          </div>

          {/* ================= KOLOM 4: SOSIAL MEDIA ================= */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-b-2 border-secondary-500 w-fit pb-1">
              Ikuti Kami
            </h3>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/takhossus_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-primary-900 flex items-center justify-center
                hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500
                transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <Instagram size={24} />
              </a>

              <a
                href="https://www.facebook.com/Takhossusbeda?locale=id_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-primary-900 flex items-center justify-center
                hover:bg-blue-600 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="border-t border-primary-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-400">
          <p>
            © {currentYear} Asrama Takhossus Pasca Amtsilati. All rights reserved.
          </p>
          <div className="flex gap-4 font-bold">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
