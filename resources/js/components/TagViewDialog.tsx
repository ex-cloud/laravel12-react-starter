// components/TagViewDialog.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Tag } from "@/types"
import { Button } from "./ui/button"

interface Props {
  tag: Tag | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export default function TagViewDialog({ tag, open, onOpenChange, onEdit, onDelete }: Props) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Detail Tag</DialogTitle>
            <DialogDescription className="text-center">
              Informasi tag dalam bentuk tampilan pop-up
            </DialogDescription>
          </DialogHeader>

          {!tag ? (
            <div className="text-center text-muted-foreground py-10">
              Memuat data tag...
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="space-y-2 flex flex-col">
                <h2 className="text-lg font-bold">{tag.name}</h2>
                <p className="text-sm text-muted-foreground">{tag.slug}</p>
                <p className="text-sm text-gray-500">Dibuat: {tag.created_at}</p>
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
