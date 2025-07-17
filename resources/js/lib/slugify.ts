export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')       // Hapus karakter non-word
    .replace(/\s+/g, '-')           // Ganti spasi dengan -
    .replace(/--+/g, '-')           // Ganti multiple - dengan satu -
}
