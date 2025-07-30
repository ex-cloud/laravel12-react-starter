import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export default function AvatarDropdown({
  avatarSrc,
  onRemove,
  onChange,
}: {
  avatarSrc: string
  onRemove: () => void
  onChange: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="relative w-fit">
          <img
            src={avatarSrc}
            alt="Avatar"
            className="h-20 w-20 rounded-full object-cover border cursor-pointer"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-40"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenuItem onClick={onRemove}>Remove image</DropdownMenuItem>
        <DropdownMenuItem>
          <a href={avatarSrc} target="_blank" rel="noopener noreferrer">
            View image
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onChange}>Change image</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
