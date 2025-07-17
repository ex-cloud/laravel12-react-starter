import AppLayout from '@/layouts/app-layout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { tagColumns } from './tag-columns'
import type { BreadcrumbItem, Tag } from '@/types'
import { ExtractFormFields } from '@/types/utils'
import { useFlashToast } from '@/hooks/use-flash-toast'
import { useTagDialogListener } from '@/hooks/use-tag-dialog-listener'
import { useDebounce } from '@/hooks/use-debounce'
import { Loader2, Search } from 'lucide-react'
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions'
import TagViewDialog from '@/components/TagViewDialog'
import { tagFields, tagToFormData } from './tag-fields'
import { EditSheet } from '@/components/EditSheet'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tags Manajemen',
    href: '/admin/tags',
  },
]
export type TagForm = ExtractFormFields<Tag>


interface TagProps {
    tags: {
        data: Tag[]
    }
  }

export default function TagIndex({ tags }: TagProps) {
      const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string } }

        const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
        const [dialogMode, setDialogMode] = useState<"view" | "edit" | "delete" | null>(null)
        const [openDialog, setOpenDialog] = useState(false)
        const [isDeleting, setIsDeleting] = useState(false)

        useFlashToast(flash)
        useTagDialogListener(setSelectedTag, setDialogMode, setOpenDialog)

          const handleCloseDialog = () => {
            setOpenDialog(false)
            setSelectedTag(null)
            setDialogMode(null)
          }
        const handleEdit = () => {
          setOpenDialog(false)
          setTimeout(() => {
            setDialogMode("edit")
            setOpenDialog(true)
          }, 300) // delay 300ms
        }

        const [search, setSearch] = useState("")
        const debouncedSearch = useDebounce(search, 300)
        const mergedSearch = debouncedSearch.trim()

        useEffect(() => {
            console.log("Searching for:", debouncedSearch)
        router.get(route("admin.tags.index"), { search: debouncedSearch }, {
            preserveState: true,
            replace: true,
        })
        }, [debouncedSearch])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Tag" />
        <div className="mx-auto py-10 w-full px-8">
            <DataTable
                columns={tagColumns(mergedSearch)}
                data={tags.data}
                enableInternalFilter={true}
                enablePagination
                headerContent={
                    <>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <DataTableViewOptions />
                    <Link href="/admin/tags/create">
                        <Button type="button" variant="default">+ Add Tag</Button>
                    </Link>
                    </>
                }
            />
        </div>

        {/* View Dialog */}
        <TagViewDialog
            tag={selectedTag}
            open={dialogMode === "view" && openDialog}
            onOpenChange={handleCloseDialog}
            onEdit={handleEdit}
            onDelete={() => setDialogMode("delete")}
        />

        {/* Edit Sheet */}
        <EditSheet<TagForm>
            title="Edit Tag"
            description="Ubah Tag yang dipilih. Klik simpan setelah selesai."
            open={dialogMode === "edit" && openDialog && selectedTag !== null}
            onOpenChange={handleCloseDialog}
            initialData={selectedTag ? tagToFormData(selectedTag) : undefined}
            actionUrl={selectedTag ? route('admin.tags.update', selectedTag.id) : "#"}
            method="put"
            fields={tagFields}
        />

        <AlertDialog open={dialogMode === "delete" && openDialog} onOpenChange={handleCloseDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
                <AlertDialogDescription>
                    Apakah kamu yakin ingin menghapus <strong>{selectedTag?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCloseDialog}>Batal</AlertDialogCancel>
                <Button
                    type="button"
                    variant="destructive"
                    disabled={isDeleting}
                    className="bg-rose-600 hover:bg-rose-700 text-white justify-center"
                    onClick={() => {
                        if (selectedTag) {
                        setIsDeleting(true)
                        router.delete(route("admin.tags.destroy", selectedTag.id), {
                            onSuccess: () => {
                            setIsDeleting(false)
                            handleCloseDialog()
                            },
                            onError: () => {
                            setIsDeleting(false)
                            handleCloseDialog()
                            },
                        })
                        }
                    }}
                    >
                    {isDeleting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                    {isDeleting ? "Menghapus..." : "Hapus"}
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </AppLayout>
  )
}
