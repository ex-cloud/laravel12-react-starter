import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { highlightSearch } from "@/utils/highlight"
import { UserActionsCell } from "./UserActionsCell"
import { User } from "@/types"

// Helper untuk menghindari undefined/null
const safe = (text?: string | null): string => text ?? ""

export const userColumns = (search: string = ""): ColumnDef<User>[] => [
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
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const avatarUrl = safe(row.original.avatar) || "/assets/default.jpg"
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
        cell: ({ row }) => highlightSearch(safe(row.original.name), search),
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string || "").toLowerCase()
            const b = (rowB.getValue(columnId) as string || "").toLowerCase()
            return a.localeCompare(b, 'id') // pakai locale 'id' untuk urutan Indonesia
        },
    },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => highlightSearch(safe(row.original.username), search),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => highlightSearch(safe(row.original.email), search),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    meta: { label: "Tanggal Dibuat" },
    enableSorting: true,
    enableHiding: true,
    sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.getValue(columnId)).getTime()
        const b = new Date(rowB.getValue(columnId)).getTime()
        return a - b
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return date.toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    },
  },
  {
    accessorKey: "updated_at",
    header: "Update At",
    meta: { label: "Tanggal Diperbarui" },
    enableSorting: true,
    enableHiding: true,
    sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.getValue(columnId)).getTime()
        const b = new Date(rowB.getValue(columnId)).getTime()
        return a - b
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return date.toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    },
  },
  {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => <UserActionsCell user={row.original}
      onDelete={(user) => {
        window.dispatchEvent(new CustomEvent("user:delete", { detail: user }))
      }}
       />,
    },
]
