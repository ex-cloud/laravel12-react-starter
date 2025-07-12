import { useEffect } from 'react'
import type { User } from '@/types'

export function useUserDialogListener(
  setSelectedUser: (user: User) => void,
  setDialogMode: (mode: "view" | "edit") => void,
  setOpenDialog: (open: boolean) => void

) {
  useEffect(() => {
    const handleView = (e: CustomEvent<User>) => {
      const user = e.detail
      if (!user) return

      setSelectedUser(user)
      setDialogMode("view")

      // Delay dialog open agar state user sudah siap
        requestAnimationFrame(() => {
            setOpenDialog(true)
        })
        setTimeout(() => {
            setOpenDialog(true)
          }, 50)
    }

    const handleEdit = (e: CustomEvent<User>) => {
      const user = e.detail
      if (!user) return

      setSelectedUser(user)
      setDialogMode("edit")

      requestAnimationFrame(() => {
        setOpenDialog(true)
      })
    }

    window.addEventListener("user:view", handleView as EventListener)
    window.addEventListener("user:edit", handleEdit as EventListener)

    return () => {
      window.removeEventListener("user:view", handleView as EventListener)
      window.removeEventListener("user:edit", handleEdit as EventListener)
    }
  }, [setSelectedUser, setDialogMode, setOpenDialog])
}
