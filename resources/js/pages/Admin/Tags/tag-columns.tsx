// resources/js/Pages/Admin/Tags/tag-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Tag } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { highlightSearch } from '@/utils/highlight'
import { TagActionsCell } from './TagActionsCell'
const safe = (text?: string | null): string => text ?? ""

export const tagColumns = (search: string = ""): ColumnDef<Tag>[] => [
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
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => highlightSearch(safe(row.original.slug), search),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    enableSorting: true,
    sortingFn: "datetime", // built-in sorting function
    cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return date.toLocaleDateString("id-ID", {
        year: "numeric", month: "long", day: "numeric"
        })
    },
  },
  {
    id: "actions",
        cell: ({ row }) => <TagActionsCell tag={row.original} />,
  },
]
