export function getSafeAvatarUrl(avatar: string | null | undefined): string {
  if (!avatar) return "/assets/default.jpg"

  const clean = avatar.trim().replace(/^\/+/, "") // hapus leading slash

  // Jika URL absolut (avatar dari Google, dsb)
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean
  }

  // Validasi path yang diizinkan
  if (
    clean.includes("//") || // cegah SSRF
    (!clean.startsWith("avatars/") && !clean.startsWith("assets/"))
  ) {
    return "/assets/default.jpg"
  }

  return `/storage/${clean}`
}
