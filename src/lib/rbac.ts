// Fungsi cek akses
export function canAccess(user: any, permission: string) {
  if (!user || !user.role) return false

  // --- PERBAIKAN: BYPASS SUPER ADMIN ---
  // Pastikan string-nya PERSIS sama dengan yang di database
  // Gunakan .toLowerCase() agar lebih aman dari typo huruf besar/kecil
  if (user.role.name.toLowerCase() === 'super admin') {
    return true // <--- Super Admin boleh akses APA SAJA
  }
  // -------------------------------------

  // Cek permission biasa untuk role lain
  return user.role.permissions?.some((p: any) => p.action === permission)
}