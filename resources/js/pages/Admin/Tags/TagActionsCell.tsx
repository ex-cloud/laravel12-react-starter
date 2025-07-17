// components/Tags/TagActionsCell.tsx

import { useState } from "react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Loader2 } from "lucide-react"
import { router } from "@inertiajs/react"
import type { Tag } from "@/types"

export function TagActionsCell({ tag }: { tag: Tag }) {
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tag.id)}>
          Copy tag ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          window.dispatchEvent(new CustomEvent("tag:view", { detail: tag }))
        }}>
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          window.dispatchEvent(new CustomEvent("tag:edit", { detail: tag }))
        }}>
          Edit
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">Hapus</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
              <AlertDialogDescription>
                Yakin ingin menghapus Tag <strong>{tag.name}</strong>? Tindakan ini tidak bisa dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleting(true)
                  router.delete(`/admin/tags/${tag.id}`, {
                    onSuccess: () => setIsDeleting(false),
                    onError: () => setIsDeleting(false),
                  })
                }}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDeleting ? "Menghapus..." : "Hapus"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
