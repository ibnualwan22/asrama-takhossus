import { PrismaClient } from "@prisma/client"
import Hero from "@/components/public/Hero"
import Stats from "@/components/public/Stats"
import ArticleSlider from "@/components/public/ArticleSlider" // <--- Import Baru
import ProgramSection from "@/components/public/ProgramSection"
import PengurusSection from "@/components/public/PengurusSection"
import GalleryPreview from "@/components/public/GalleryPreview" // <--- Import Baru
import TestimonialsSection from "@/components/public/TestimonialsSection"
import KaryaSantri from "@/components/public/KaryaSantri"

const prisma = new PrismaClient()
export const revalidate = 60

export default async function LandingPage() {
  
  // FETCH SEMUA DATA (Tambah post & gallery)
  const [
    activeStudents, mutakhorijin, alumni, orgs,
    staffList, testimonials, karyaList,
    latestPosts, // <--- Data Artikel
    latestGalleries // <--- Data Galeri
  ] = await prisma.$transaction([
    prisma.student.count({ where: { status: 'ACTIVE' } }),
    prisma.student.count({ where: { status: 'MUTAKHORIJIN' } }),
    prisma.student.count({ where: { status: { in: ['ALUMNI_GRADUATED', 'ALUMNI_DROPOUT'] } } }),
    prisma.organization.count(),
    prisma.staff.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ where: { isShow: true }, orderBy: { createdAt: 'desc' } }),
    prisma.karya.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
    
    // FETCH ARTIKEL
    prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 5 }),

    // FETCH GALERI
    prisma.gallery.findMany({ 
        orderBy: { date: 'desc' }, 
        take: 4, 
        include: { items: { take: 1 }, _count: { select: { items: true } } } 
    })
  ])

  const counts = { students: activeStudents, mutakhorijin, alumni, organizations: orgs }

  return (
    <div className="bg-slate-50 min-h-screen pb-0">
      <Hero />
      <Stats counts={counts} />
      
      {/* 1. ARTIKEL SLIDER (Di bawah Stats) */}
      <ArticleSlider posts={latestPosts} />

      {/* <ProgramSection /> */}
      <KaryaSantri karyaList={karyaList} />
      <PengurusSection staffList={staffList} />

      {/* 2. GALERI PREVIEW (Di bawah Pengurus) */}
      <GalleryPreview galleries={latestGalleries} />

      <TestimonialsSection testimonials={testimonials} />
    </div>
  )
}