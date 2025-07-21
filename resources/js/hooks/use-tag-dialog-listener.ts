import { useEffect } from "react"
import type { Tag } from "@/types"

export function useTagDialogListener(
  setSelectedTag: (tag: Tag | null) => void,
  setDialogMode: (mode: "view" | "edit" | "delete" | null) => void,
  setOpenDialog: (open: boolean) => void
) {
  useEffect(() => {
    const handleView = (e: CustomEvent<Tag>) => {
      setSelectedTag(e.detail)
      setDialogMode("view")
      setOpenDialog(true)
    }

    const handleEdit = (e: CustomEvent<Tag>) => {
      setSelectedTag(e.detail)
      setDialogMode("edit")
      setOpenDialog(true)
    }

    window.addEventListener("tag:view", handleView as EventListener)
    window.addEventListener("tag:edit", handleEdit as EventListener)

    return () => {
      window.removeEventListener("tag:view", handleView as EventListener)
      window.removeEventListener("tag:edit", handleEdit as EventListener)
    }
  }, [setSelectedTag, setDialogMode, setOpenDialog])
}
