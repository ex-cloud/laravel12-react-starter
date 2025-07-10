// components/UserViewDialog.tsx
"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { User } from "@/types"

interface Props {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserViewDialog({ user, open, onOpenChange }: Props) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Detail Pengguna</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-center">
          <img
            src={user.avatar || "/assets/default.jpg"}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto object-cover border"
            onError={(e) => (e.currentTarget.src = "/assets/default.jpg")}
          />
          <div>
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-gray-500">Bergabung: {user.created_at}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
