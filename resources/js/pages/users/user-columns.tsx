// user-columns.ts
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import type { User } from "@/types"
import { router } from "@inertiajs/react"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog"


export const userColumns = (
  setSelectedUser: (user: User) => void,
  setDrawerMode: (mode: "view" | "edit") => void,
  setOpenDrawer: (open: boolean) => void,
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
//   {
//     header: '#',
//     cell: ({ row }) => row.index + 1,
//   },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const avatarUrl = row.original.avatar || "/assets/default.jpg"
      return (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/assets/default.jpg"
          }}
        />
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const dateString = row.getValue("created_at") as string
      const date = new Date(dateString)
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
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
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(user)
                setDrawerMode("view")
                setOpenDrawer(true)
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(user)
                setDrawerMode("edit")
                setOpenDrawer(true)
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="ghost"
                        className="w-full justify-start">
                        Hapus
                    </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
                        <AlertDialogDescription>
                        Apakah kamu yakin ingin menghapus <strong>{user.name}</strong>? Tindakan ini tidak bisa dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                        onClick={() => {
                            router.delete(`/users/${user.id}`)
                        }}
                        >
                        Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
