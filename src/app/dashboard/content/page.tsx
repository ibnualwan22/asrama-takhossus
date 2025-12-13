import { getTestimonials } from '@/app/actions/testimonial'
import TestimonialManager from './_components/TestimonialManager'

export const metadata = { title: "Manajemen Konten" }

export default async function ContentPage() {
  // Fetch data di server (Parallel)
  const [testimonials] = await Promise.all([
    getTestimonials(),
  ])
  
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Manajemen Konten Web</h1>
        <p className="text-gray-500 text-sm">Kelola Testimoni dan Karya Santri untuk tampilan depan.</p>
      </div>
      
      {/* Client Components untuk interaksi */}
      <div className="grid grid-cols-1 gap-8">
         <TestimonialManager initialData={testimonials} />
      </div>
    </div>
  )
}