// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth" // Import dari file yang kita buat di langkah 3
export const { GET, POST } = handlers