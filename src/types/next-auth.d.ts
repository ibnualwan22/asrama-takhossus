import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      username?: string | null
      image?: string | null
      // Definisi Role agar bisa dibaca di seluruh app
      role: {
        id: string
        name: string
        permissions: { action: string }[]
      }
    }
  }
}