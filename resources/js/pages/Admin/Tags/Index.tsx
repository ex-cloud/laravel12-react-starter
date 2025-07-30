import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { tagColumns } from './tag-columns'
import type { BreadcrumbItem, Tag } from '@/types'
import { ExtractFormFields } from '@/types/utils'
import { useFlashToast } from '@/hooks/use-flash-toast'
import { useTagDialogListener } from '@/hooks/use-tag-dialog-listener'
import { useDebounce } from '@/hooks/use-debounce'
import { Loader2 } from 'lucide-react'
import TagViewDialog from '@/components/TagViewDialog'
import { tagFields, tagToFormData } from './tag-fields'
import { EditSheet } from '@/components/EditSheet'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { FlashMessage } from '@/types/flash'
import { useTablePreferences } from '@/hooks/use-table-preferences'
import { toast } from 'sonner'

export type TagForm = ExtractFormFields<Tag>

type PaginationMeta = {
  total: number
  current_page: number
  last_page: number
  per_page: number
}
interface TagProps {
    tags: {
        data: Tag[]
        meta: PaginationMeta
        links?: {
            next?: string
            prev?: string
        }
    }
    totalCount: number
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tags Manajemen', href: '/admin/tags'},
]

export default function TagIndex({ tags }: TagProps) {

    const { flash } = usePage().props as { flash?: FlashMessage } // Flash message type di ambil di types/flash.ts

    // Gunakan hook useFlashToast untuk menampilkan pesan flash
    useFlashToast(flash, {
        modelName: "Tag",
    })

    const tableKey = "tags"
    const {
        pageSize,
        columnVisibility,
        sorting,
        setPageSize,
        setColumnVisibility,
        setSorting,
    } = useTablePreferences(tableKey)

    const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
    const [dialogMode, setDialogMode] = useState<"view" | "edit" | "delete" | "bulk-delete" | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [resetSelectionSignal, setResetSelectionSignal] = useState(false)
    const [pageIndex, setPageIndex] = useState(tags.meta.current_page - 1)
    const [isLoading, setIsLoading] = useState(false)
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false)


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
    const debouncedPageSize = useDebounce(pageSize, 300)
    const mergedSearch = debouncedSearch.trim()

    const resetSelection = () => {
        setSelectedTags([])
        requestAnimationFrame(() => {
            setResetSelectionSignal(true)
            requestAnimationFrame(() => setResetSelectionSignal(false))
        })
    }

    // 1️⃣ useEffect untuk pencarian
    const fetchTags = useCallback(() => {
        setIsLoading(true)
        const query = {
            page: pageIndex + 1,
            perPage: debouncedPageSize,
            search: debouncedSearch,
            sort: sorting?.[0]?.id,
            order: sorting?.[0]?.desc ? "desc" : "asc",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            format: "d F Y \\p\\u\\k\\u\\l H.i", // opsional
        }
        router.get(route("admin.tags.index"), query, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false),
        })
    }, [pageIndex, debouncedPageSize, debouncedSearch, sorting])

    useEffect(() => {
        fetchTags()
    }, [fetchTags])


    // 2️⃣ useEffect untuk event tag:delete
    useEffect(() => {
        const handleDelete = (e: CustomEvent<Tag>) => {
            setSelectedTag(e.detail)
            setDialogMode("delete")
            setOpenDialog(true)
        }

        window.addEventListener("tag:delete", handleDelete as EventListener)

        return () => {
            window.removeEventListener("tag:delete", handleDelete as EventListener)
        }
    }, []) // kosong artinya hanya dijalankan sekali saat mount

    const handleExportCSV = () => {
        const exportData = selectedTags.length ? selectedTags : tags.data

        if (!exportData.length) {
            toast.warning("Tidak ada data untuk diekspor.")
            return
        }

        const csvContent = [
            Object.keys(exportData[0])
            .filter((key) => key !== "articles_count")
            .join(";"),
            ...exportData.map((tag) =>
            Object.values(tag)
                .filter((_, i) => Object.keys(tag)[i] !== "articles_count")
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(";")
            ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `tags-export-${Date.now()}.csv`)
        link.click()
    }

    const [bulkDeleteMessage, setBulkDeleteMessage] = useState("")

    return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Manajemen Tag" />

        <div className="mx-auto py-10 w-full px-8">
            {isLoading && (
                <div className="flex items-center justify-center py-6">
                <Loader2 className="animate-spin w-5 h-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Memuat semua data...</span>
                </div>
            )}

            <DataTable
                columns={tagColumns(mergedSearch)}
                data={tags?.data ?? []}
                enableInternalFilter={true}
                enablePagination={true}
                sorting={sorting}
                onSortingChange={setSorting}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
                customToolbar={{
                    searchValue: search,
                    onSearchChange: setSearch,
                    isLoading,
                    selectedRows: selectedTags,
                    onBulkDelete: ({ selectAll, selectedIds, activeSearch }) => {
                        const message = selectAll
                            ? `Semua ${tags.meta.total} tag akan dihapus${
                                activeSearch ? ` berdasarkan pencarian: "${activeSearch}"` : ""
                            }.`
                            : `${selectedIds.length} tag akan dihapus.`
                            setBulkDeleteMessage(message)
                            setDialogMode("bulk-delete")
                            setOpenDialog(true)
                        },
                    onAddClick: () => router.visit("/admin/tags/create"),
                    addButtonLabel: "Add Tag",
                    showSearch: true,
                    showAddButton: true,
                    selectAllAcrossPages,
                    setSelectAllAcrossPages,
                    onExportCSV: handleExportCSV, // ✅ tambahan
                    // canAdd: auth.permissions?.includes("create_user"),
                    onResetSelection: () => {
                        setResetSelectionSignal((prev) => !prev)
                    },
                }}
                pagination={{
                    pageIndex,
                    pageSize,
                    onPageChange: setPageIndex,
                    onPageSizeChange: (size) => {
                    setPageSize(size) // <== Simpan ke localStorage
                    setPageIndex(0)   // Reset ke halaman pertama
                        },
                    pageCount: tags.meta.last_page,
                }}
                resetRowSelectionSignal={resetSelectionSignal}
                onRowSelectionChange={(rows) => setSelectedTags(rows)}
                tableId={tableKey}
                totalCount={tags.meta.total}
                // headerContent={
                //     <>
                //     <div className="relative w-64">
                //         <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                //         <Input
                //             placeholder="Search"
                //             value={search}
                //             onChange={(e) => setSearch(e.target.value)}
                //             className="pl-10"
                //         />
                //     </div>
                //     <DataTableViewOptions />
                //     <Link href="/admin/tags/create">
                //         <Button type="button" variant="default">+ Add Tag</Button>
                //     </Link>
                //     </>
                // }
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
                    Apakah kamu yakin ingin menghapus Tag <strong>{selectedTag?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
                                resetSelection()
                                handleCloseDialog()
                            },
                            onError: () => {
                                toast.error("Gagal menghapus tag.")
                            },
                            onFinish: () => {
                                setIsDeleting(false) // <- PENTING agar loading state kembali ke normal
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

        <AlertDialog open={dialogMode === "bulk-delete" && openDialog} onOpenChange={handleCloseDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Tag Terpilih?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {bulkDeleteMessage}
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
                            setIsDeleting(true)
                            const ids = selectedTags.map(tag => tag.id)
                            router.delete(route("admin.tags.bulkDestroy"), {
                                data: { ids },
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsDeleting(false)
                                    resetSelection()
                                    handleCloseDialog()
                                },
                                onError: () => {
                                    toast.error("Gagal menghapus tag terpilih.")
                                },
                                onFinish: () => {
                                    setIsDeleting(false) // <- PENTING agar loading state kembali ke normal
                                },
                            })
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
