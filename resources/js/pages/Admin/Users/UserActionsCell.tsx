// components/user/UserActionsCell.tsx

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import type { User } from "@/types"

export function UserActionsCell({ user, onDelete }: { user: User, onDelete?: (user: User) => void }) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
          Copy user ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          window.dispatchEvent(new CustomEvent("user:view", { detail: user }))
        }}>
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          window.dispatchEvent(new CustomEvent("user:edit", { detail: user }))
        }}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete?.(user)}>
            Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
