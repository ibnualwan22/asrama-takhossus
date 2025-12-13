import Navbar from "@/components/public/Navbar" // Nanti kita buat
import Footer from "@/components/public/Footer" // Nanti kita buat

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Fixed di atas */}
      <Navbar /> 
      
      {/* Konten Utama */}
      <main className="flex-1 pt-16"> 
        {children}
      </main>

      {/* Footer di bawah */}
      <Footer />
    </div>
  )
}