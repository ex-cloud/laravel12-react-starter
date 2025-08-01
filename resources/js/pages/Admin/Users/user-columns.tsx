import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { highlightSearch } from "@/utils/highlight"
import { UserActionsCell } from "./UserActionsCell"
import { User } from "@/types"
// import { getSafeAvatarUrl } from "@/lib/avatar"

// Helper untuk menghindari undefined/null
const safe = (text?: string | null): string => text ?? ""

export const userColumns = (search: string = ""): ColumnDef<User>[] => [
  {
    id: "select",
    size: 20,
    minSize: 20,
    enableResizing: false,
    meta: { width: "min-w-[20px]" },
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
    size: 20, // Mengurangi ukuran kolom avatar
    minSize: 20, // Ukuran minimal avatar
    // maxSize: 100,
    enableResizing: false,
    meta: { width: "min-w-[20px]" },
    cell: ({ row }) => {
    const avatarUrl = safe(row.original.avatar) || "/assets/default.jpg"
      return (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/assets/default.jpg"
          }}
        />
      )
    },
  },
    {
        accessorKey: "name",
        enableResizing: true,
        size: 200, // ⬅ tambah ini
        minSize: 150,
        maxSize: 400,
        meta: { label: "Nama", width: "min-w-[200px]" },
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return (
            <div
                onClick={() => column.toggleSorting(isSorted === "asc")}
                className="cursor-pointer select-none flex items-center"
                >
                Name
                {isSorted === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : isSorted === "desc" ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
            </div>
            )
        },
        cell: ({ row }) => {
            const name = row.getValue("name") as string
            return highlightSearch(name, search) // ✅ gunakan search dari argumen
            },
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string || "").toLowerCase()
            const b = (rowB.getValue(columnId) as string || "").toLowerCase()
            return a.localeCompare(b, "id")
        },
    },
  {
    accessorKey: "username",
    header: "Username",
    enableResizing: true,
    size: 160, // ⬅ tambah ini
    minSize: 120,
    maxSize: 200,
    meta: { width: "min-w-[160px]" },
    cell: ({ row }) => highlightSearch(safe(row.original.username), search),
  },
  {
    accessorKey: "email",
    header: "Email",
    enableResizing: true,
    size: 240, // ⬅ tambah ini
    minSize: 180,
    maxSize: 300,
    meta: { width: "min-w-[240px]" },
    cell: ({ row }) => highlightSearch(safe(row.original.email), search),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    enableResizing: true,
    size: 180,
    minSize: 140,
    maxSize: 250,
    meta: { label: "Tanggal Dibuat", width: "min-w-[180px]" },
    enableSorting: true,
    enableHiding: true,
    sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.getValue(columnId)).getTime()
        const b = new Date(rowB.getValue(columnId)).getTime()
        return b - a
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
    enableResizing: false,
    size: 180,
    minSize: 140,
    maxSize: 250,
    meta: { label: "Tanggal Diperbarui", width: "min-w-[180px]" },
    enableSorting: true,
    enableHiding: true,
    sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.getValue(columnId)).getTime()
        const b = new Date(rowB.getValue(columnId)).getTime()
        return b - a
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue("updated_at"))
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
        enableResizing: false,
        size: 100,
        minSize: 60,
        maxSize: 120,
        meta: { width: "min-w-[100px]" },
        cell: ({ row }) => (
            <div className="flex justify-end items-center px-2"> {/* Menambahkan flex untuk memastikan berada di kanan */}
                <UserActionsCell
                    user={row.original}
                    onDelete={(user) => {
                        window.dispatchEvent(new CustomEvent("user:delete", { detail: user }));
                    }}
                />
            </div>
        ),
    },
]
