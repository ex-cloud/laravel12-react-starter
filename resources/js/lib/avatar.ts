export function getSafeAvatarUrl(avatar: string | null | undefined): string {
  if (!avatar) return "/assets/default.jpg"

  const clean = avatar.trim().replace(/^\/+/, "") // hapus leading slash

  if (
    clean.includes("//") ||
    (!clean.startsWith("avatars/") && !clean.startsWith("assets/"))
  ) {
    return "/assets/default.jpg"
  }

  return `/${clean}`
}
