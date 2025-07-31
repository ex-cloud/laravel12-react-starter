"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import type { User } from "@/types"
import { getSafeAvatarUrl } from "@/lib/avatar"

interface Props {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: "view" | "edit"
}

export function UserDrawerDialog({ user, open, onOpenChange, mode = "view" }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    if (!user) return null

    const content = mode === "view" ? (
      <div className="space-y-4 text-center p-4">
        <img
          src={user.avatar || getSafeAvatarUrl(user.avatar)}
          alt={user.name}
          className="w-24 h-24 rounded-full mx-auto object-cover border"
          onError={(e) => (e.currentTarget.src = getSafeAvatarUrl(user.avatar))}
        />
        <div>
          <h2 className="text-lg font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm text-gray-500">Joined: {user.created_at}</p>
        </div>
      </div>
    ) : (
      <div className="p-4">
        {/* 👇 ganti dengan form edit user */}
        <form className="space-y-4">
          <input
            type="text"
            className="w-full border p-2 rounded"
            defaultValue={user.name}
          />
          <input
            type="text"
            className="w-full border p-2 rounded"
            defaultValue={user.username}
          />
          <input
            type="email"
            className="w-full border p-2 rounded"
            defaultValue={user.email}
          />
          <Button type="submit" className="w-full">
            Simpan Perubahan
          </Button>
        </form>
      </div>
    )

    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                {mode === "view" ? "User Detail" : "Edit User"}
              </DialogTitle>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{mode === "view" ? "User Detail" : "Edit User"}</DrawerTitle>
            {mode === "view" && (
              <DrawerDescription>Informasi pengguna terpilih.</DrawerDescription>
            )}
          </DrawerHeader>
          {content}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Tutup</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }
