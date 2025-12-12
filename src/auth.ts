// src/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"

const prisma = new PrismaClient()

// Skema validasi input login
const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // 1. Validasi input
          const { username, password } = await loginSchema.parseAsync(credentials)

          // 2. Cari user di database
          const user = await prisma.user.findUnique({
            where: { username },
            include: { role: true } // Kita butuh role-nya nanti
          })

          if (!user) {
            throw new Error("User tidak ditemukan.")
          }

          // 3. Cek password
          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            throw new Error("Password salah.")
          }

          // 4. Return data user (masuk ke session)
          return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role.name, // Penting untuk RBAC
          }
        } catch (error) {
          console.error("Login error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // Halaman login custom kita
  },
  callbacks: {
    // 1. Saat JWT dibuat (Login berhasil)
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username // Simpan username ke token
        token.role = (user as any).role // Simpan role juga biar gampang
      }
      return token
    },
    // 2. Saat Session dibaca (Setiap reload halaman)
    async session({ session, token }) {
      if (session.user) {
        // Pindahkan dari token ke session agar bisa dibaca di AuthGuard
        (session.user as any).username = token.username;
        (session.user as any).role = token.role; 
      }
      return session
    }
  }
})