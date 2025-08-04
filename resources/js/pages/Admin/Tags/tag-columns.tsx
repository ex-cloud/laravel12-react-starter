// resources/js/Pages/Admin/Tags/tag-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Tag } from '@/types'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { highlightSearch } from '@/utils/highlight'
import { TagActionsCell } from './TagActionsCell'

// Helper untuk menghindari undefined/null
const safe = (text?: string | null): string => text ?? ""

export const tagColumns = (search: string = ""): ColumnDef<Tag>[] => [
    {
        id: "select",
        size: 26,
        minSize: 26,
        maxSize: 60,
        enableResizing: false,
        meta: { width: "min-w-[26px]" },
        header: ({ table }) => (
            <div className="flex items-center justify-center">
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },

//   {
//     header: '#',
//     cell: ({ row }) => row.index + 1,
//   },
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
        accessorKey: 'slug',
        header: 'Slug',
        enableResizing: true,
        size: 240, // ⬅ tambah ini
        minSize: 180,
        maxSize: 300,
        meta: { width: "min-w-[240px]" },
        cell: ({ row }) => highlightSearch(safe(row.original.slug), search),
    },
    {
        accessorKey: "articles_count",
        header: "Jumlah Artikel",
        enableSorting: true,
        cell: ({ row }) => row.original.articles_count ?? 0,
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
                  <TagActionsCell
                      tag={row.original}
                      onDelete={(tag) => {
                          window.dispatchEvent(new CustomEvent("tag:delete", { detail: tag }));
                      }}
                  />
              </div>
          ),
    },
]
