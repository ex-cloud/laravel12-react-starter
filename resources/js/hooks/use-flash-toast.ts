import { useEffect } from "react"
import { toast } from "sonner"

interface FlashProps {
  success?: string
  error?: string
  info?: string
}

export function useFlashToast(flash?: FlashProps) {
  useEffect(() => {
    if (!flash) return

    if (flash.info) {
      toast(flash.info)
      return
    }

    if (flash.success) {
      let description = ""
      if (flash.success.includes("ditambahkan")) {
        description = "User berhasil ditambahkan ke sistem."
      } else if (flash.success.includes("diperbarui")) {
        description = "Perubahan data user berhasil disimpan."
      }

      toast.success(flash.success, {
        description,
        icon: "✅",
      })
    }

    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])
}
