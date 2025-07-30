import { FlashMessage } from "@/types/flash"
import { useEffect, useMemo } from "react"
import { toast } from "sonner"

type ActionMap = Record<string, string>

interface UseFlashToastOptions {
  modelName?: string // Contoh: "User", "Kategori"
  actionMap?: ActionMap // Mapping kata kunci -> deskripsi custom
}

const defaultActionMap = (modelName: string): ActionMap => ({
  ditambahkan: `${modelName} berhasil ditambahkan ke sistem.`,
  diperbarui: `Perubahan data ${modelName.toLowerCase()} berhasil disimpan.`,
  dihapus: `${modelName} berhasil dihapus.`,
})

export function useFlashToast(flash?: FlashMessage, options?: UseFlashToastOptions) {
  const modelName = options?.modelName || "Item"

  const actionMap = useMemo(() => {
    return options?.actionMap || defaultActionMap(modelName)
  }, [options?.actionMap, modelName])

  useEffect(() => {
    if (!flash) return

    if (flash.info) {
      toast(flash.info, {
        duration: 4000,
        icon: "ℹ️",
      })
      return
    }

    if (flash.success) {
      let description = ""

      for (const keyword in actionMap) {
        if (flash.success.includes(keyword)) {
          description = actionMap[keyword]
          break
        }
      }

      toast.success(flash.success, {
        description,
        duration: 4000,
        icon: "✅",
      })
    }

    if (flash.error) {
      toast.error(flash.error, {
        duration: 4000,
        icon: "❌",
      })
    }
  }, [flash, actionMap])
}
