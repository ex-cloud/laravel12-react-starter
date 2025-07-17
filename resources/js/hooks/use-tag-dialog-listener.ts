import { useEffect } from 'react'
import type { Tag } from '@/types'

export function useTagDialogListener(
  setSelectedTag: (tag: Tag) => void,
  setDialogMode: (mode: "view" | "edit") => void,
  setOpenDialog: (open: boolean) => void

) {
  useEffect(() => {
    const handleView = (e: CustomEvent<Tag>) => {
      const tag = e.detail
      if (!tag) return

      setSelectedTag(tag)
      setDialogMode("view")

      // Delay dialog open agar state user sudah siap
        requestAnimationFrame(() => {
            setOpenDialog(true)
        })
        setTimeout(() => {
            setOpenDialog(true)
          }, 50)
    }

    const handleEdit = (e: CustomEvent<Tag>) => {
      const tag = e.detail
      if (!tag) return

      setSelectedTag(tag)
      setDialogMode("edit")

      requestAnimationFrame(() => {
        setOpenDialog(true)
      })
    }

    window.addEventListener("tag:view", handleView as EventListener)
    window.addEventListener("tag:edit", handleEdit as EventListener)

    return () => {
      window.removeEventListener("tag:view", handleView as EventListener)
      window.removeEventListener("tag:edit", handleEdit as EventListener)
    }
  }, [setSelectedTag, setDialogMode, setOpenDialog])
}
