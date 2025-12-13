// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asrama Takhossus - Pasca Amtsilati",
  description: "Mencetak generasi santri beramal ilmiyyah, berilmu amaliyyah.",
  icons: {
    icon: "/favicon.png", // Pastikan punya favicon atau hapus baris ini
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Tidak boleh ada Navbar/Sidebar disini */}
        {children}
      </body>
    </html>
  );
}