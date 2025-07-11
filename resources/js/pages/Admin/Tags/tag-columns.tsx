// resources/js/Pages/Admin/Tags/tag-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Tag } from '@/types'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { router, Link } from '@inertiajs/react'
import { MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export const tagColumns = (): ColumnDef<Tag>[] => [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
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
    accessorKey: 'name',
    header: 'Nama',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const tag = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tag.id)}>
              Salin ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={route('admin.tags.edit', tag.id)}>Edit</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                  >
                    Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah kamu yakin ingin menghapus <strong>{tag.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => router.delete(route('admin.tags.destroy', tag.id))}
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
