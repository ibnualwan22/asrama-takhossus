'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
  }, [isOpen])

  const navItems = [
    { name: 'Beranda', href: '/' },
    {
      name: 'Profil',
      href: '#',
      children: [
        { name: 'Tentang & Visi Misi', href: '/profil' },
        { name: 'Struktur Pengurus', href: '/pengurus' },
      ],
    },
    {
      name: 'Akademik',
      href: '#',
      children: [
        { name: 'Program Unggulan', href: '/#program' },
        { name: 'Organisasi Santri', href: '/organisasi' },
        { name: 'Jadwal Kegiatan', href: '/kegiatan' },
      ],
    },
    {
      name: 'Data',
      href: '#',
      children: [
        { name: 'Data Mutakhorijin', href: '/mutakhorijin' },
        { name: 'Karya Tulis', href: '/karya' },
        { name: 'Prestasi', href: '/prestasi' },
      ],
    },
    { name: 'Galeri', href: '/galeri' },
  ]

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 
        ${scrolled
          ? 'bg-primary-700/95 backdrop-blur-md shadow-2xl py-3'
          : 'bg-primary-900/60 backdrop-blur-sm py-5'}`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div
              className={`bg-white rounded-full p-1 border-2 border-secondary-400 transition-all
              ${scrolled ? 'w-10 h-10' : 'w-12 h-12'}`}
            >
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-lg leading-none">
                ASRAMA TAKHOSSUS
              </h1>
              <p className="text-secondary-300 text-[10px] font-bold uppercase tracking-widest">
                Pasca Amtsilati
              </p>
            </div>
          </Link>
          

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map(item => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm font-bold uppercase text-white flex items-center gap-1"
                >
                  {item.name}
                  {item.children && (
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  )}
                </Link>

                {item.children && (
                  <div className="absolute right-0 top-full mt-4 w-56 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition">
                    <div className="bg-white rounded-xl shadow-xl py-2">
                      {item.children.map(child => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-3 text-sm font-bold text-gray-700 hover:bg-secondary-50"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <a
              href="https://wa.me/6281230171790"
              target="_blank"
              className="px-6 py-2.5 rounded-full bg-secondary-500 font-bold"
            >
              Hubungi
            </a>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white z-[101]"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE SIDEBAR ================= */}
      {/* ================= MOBILE SIDEBAR ================= */}
<div
  className={`lg:hidden fixed inset-0 transition-opacity duration-300
  ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
  style={{ zIndex: 9999 }}
>
  {/* OVERLAY (AREA GELAP) */}
  <div
    className="absolute inset-0 bg-black/50"
    onClick={() => setIsOpen(false)}
  />

  {/* DRAWER SIDEBAR */}
  <div
    className={`absolute top-0 right-0 h-full w-3/4 max-w-sm
    bg-primary-900
    transition-transform duration-500 ease-in-out
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
  >
    {/* CLOSE BUTTON */}
    <button
      onClick={() => setIsOpen(false)}
      className="absolute top-5 right-5 p-2 rounded-full 
      bg-white/10 text-white hover:bg-white/20 transition"
      aria-label="Tutup Menu"
    >
      <X size={24} />
    </button>

    {/* MENU CONTENT */}
    <div className="pt-24 px-6 text-white">
      {navItems.map(item => (
        <div key={item.name} className="border-b border-white/10">
          {item.children ? (
            <>
              <button
                onClick={() =>
                  setMobileSubmenu(mobileSubmenu === item.name ? null : item.name)
                }
                className="w-full flex justify-between items-center py-4 
                text-lg font-bold uppercase"
              >
                {item.name}
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    mobileSubmenu === item.name ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`pl-4 overflow-hidden transition-all duration-300
                ${
                  mobileSubmenu === item.name
                    ? 'max-h-60 opacity-100 pb-3'
                    : 'max-h-0 opacity-0'
                }`}
              >
                {item.children.map(child => (
                  <Link
                    key={child.name}
                    href={child.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-sm text-gray-300 hover:text-secondary-400"
                  >
                    • {child.name}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Link
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block py-4 text-lg font-bold uppercase"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}

      {/* HUBUNGI ADMIN */}
      <div className="mt-8 pb-10">
        <a
          href="https://wa.me/6281230171790"
          className="block w-full text-center py-4 
          bg-secondary-500 text-primary-900 
          rounded-full font-bold shadow-lg"
        >
          <Phone size={18} className="inline mr-2" />
          Hubungi Admin
        </a>
      </div>
    </div>
  </div>
</div>
    </>
  )
}
