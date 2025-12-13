'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Efek transparan ke solid saat scroll
  useEffect(() => {
    const handleScroll = () => setIsOpen(false) // Tutup menu mobile saat scroll
    
    const onScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Profil', href: '/profil' },
    { name: 'Program', href: '#program' },
     { name: 'Organisasi', href: '/organisasi' },
    { name: 'Mutakhorijin', href: '/mutakhorijin' }, // Halaman khusus sesuai request
    { name: 'Karya & Galeri', href: '/karya' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
            AT
          </div>
          <div>
            <h1 className={`font-extrabold text-lg leading-none ${scrolled ? 'text-gray-900' : 'text-gray-900 md:text-white'}`}>
              Asrama Takhossus
            </h1>
            <p className={`text-[10px] font-medium tracking-wider ${scrolled ? 'text-gray-500' : 'text-gray-600 md:text-blue-100'}`}>
              PASCA AMTSILATI
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-bold transition-colors hover:text-blue-500 ${
                scrolled ? 'text-gray-600' : 'text-white/90 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Tombol Hubungi WA */}
          <a
            href="https://wa.me/6281230171790"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                scrolled 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white text-blue-900 hover:bg-blue-50'
            }`}
          >
            <Phone size={16} /> Hubungi Kami
          </a>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-800' : 'text-gray-800'}`} // Text gray agar terlihat di mobile yg biasanya background putih/hero
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-2 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-bold"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t my-2 pt-2">
             <a
              href="https://wa.me/6281230171790"
              target="_blank"
              className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg font-bold"
             >
                Chat WhatsApp
             </a>
          </div>
        </div>
      )}
    </nav>
  )
}