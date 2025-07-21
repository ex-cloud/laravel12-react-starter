// components/Tags/TagActionsCell.tsx

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import type { Tag } from "@/types"

export function TagActionsCell({ tag, onDelete }: { tag: Tag, onDelete?: (tag: Tag) => void }) {

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
        <DropdownMenuItem onClick={() => onDelete?.(tag)}>
            Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
