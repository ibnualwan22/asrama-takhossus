import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  
  // Di v5, secret otomatis dibaca dari process.env.AUTH_SECRET
  // Jadi tidak perlu ditulis manual di sini jika variable .env sudah ada.

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const username = credentials?.username as string
        const password = credentials?.password as string

        if (!username || !password) return null

        // 1. Cari User di DB
        const user = await prisma.user.findUnique({
          where: { username },
          include: {
            role: {
              include: { permissions: true }
            }
          }
        })

        // 2. Validasi Password
        if (!user || !(await compare(password, user.password))) {
          return null
        }

        // 3. Return User (Format v5 lebih fleksibel)
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: (user as any).role, 
        }
      }
    })
  ],

  callbacks: {
    // Callback JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as any).username
        token.role = (user as any).role
      }
      return token
    },

    // Callback Session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.role = token.role as any
      }
      return session
    }
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  }
})