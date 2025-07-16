// components/UserViewDialog.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { User } from "@/types"
import { Button } from "./ui/button"

interface Props {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export default function UserViewDialog({ user, open, onOpenChange, onEdit, onDelete }: Props) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Detail Pengguna</DialogTitle>
            <DialogDescription className="text-center">
              Informasi pengguna dalam bentuk tampilan pop-up
            </DialogDescription>
          </DialogHeader>

          {!user ? (
            <div className="text-center text-muted-foreground py-10">
              Memuat data pengguna...
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <img
                src={user.avatar || "/assets/default.jpg"}
                alt={user.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border"
                onError={(e) => (e.currentTarget.src = "/assets/default.jpg")}
              />
              <div className="space-y-2 flex flex-col">
                <h2 className="text-lg font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-gray-500">Bergabung: {user.created_at}</p>
                <div className="flex items-center mx-auto gap-x-2">
                    <Button type="button" onClick={onEdit}>Edit</Button>
                    <Button type="button" variant={"destructive"} onClick={onDelete}>Delete</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }
