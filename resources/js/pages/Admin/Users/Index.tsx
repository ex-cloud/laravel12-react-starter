// pages/Admin/Users/UserIndex.tsx
"use client"

import AppLayout from '@/layouts/app-layout'
import { Head, router } from '@inertiajs/react'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { userColumns } from './user-columns'
import type { BreadcrumbItem, User } from '@/types'
import UserViewDialog from '@/components/UserViewDialog'
import { useUserDialogListener } from '@/hooks/use-user-dialog-listener'
import { EditSheet } from '@/components/EditSheet'
import { ExtractFormFields } from '@/types/utils'
import { userFields, userToFormData } from './user-fields'
import AvatarUploader from '@/components/AvatarUploader'
import { useDebounce } from '@/hooks/use-debounce'
import { Loader2 } from 'lucide-react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from "sonner"
import { useTablePreferences } from '@/hooks/use-table-preferences'
import { usePageProps } from '@/hooks/use-page-props'

type Flash = {
  success?: string
  error?: string
  info?: string
}

export type UserForm = ExtractFormFields<User>

type PaginationMeta = {
  total: number
  current_page: number
  last_page: number
  per_page: number
}
type UsersPageProps = {
  users: {
    data: User[]
    meta: PaginationMeta
    links?: {
      next?: string
      prev?: string
    }
  }
}

export function useFlashToast(flash?: Flash) {
  useEffect(() => {
    if (!flash) return

    if (flash.success) {
      toast.success(flash.success, {
        duration: 4000,
        icon: "✅",
      })
    } else if (flash.error) {
      toast.error(flash.error, {
        duration: 4000,
        icon: "❌",
      })
    } else if (flash.info) {
      toast(flash.info, {
        duration: 4000,
        icon: "ℹ️",
      })
    }
  }, [flash])
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'List User', href: '/admin/users' },
]


export default function UsersIndex({ users }: UsersPageProps) {
    const { auth, flash } = usePageProps<{ flash?: Flash }>()
    useFlashToast(flash)
    const canAdd = auth.permissions?.includes("create_user")
    console.log("permissions:", auth.permissions)
    console.log("canAdd:", canAdd)

  const tableKey = "users"
  const {
    pageSize,
    columnVisibility,
    sorting,
    setPageSize,
    setColumnVisibility,
    setSorting,
    } = useTablePreferences(tableKey)


    const [resetAvatar, setResetAvatar] = useState(false)
    const [newAvatar, setNewAvatar] = useState<File | null>(null)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [dialogMode, setDialogMode] = useState<"view" | "edit" | "delete" | "bulk-delete" | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [resetSelectionSignal, setResetSelectionSignal] = useState(false)
    const [pageIndex, setPageIndex] = useState(users.meta.current_page - 1)
    const [isLoading, setIsLoading] = useState(false)


  useUserDialogListener(setSelectedUser, setDialogMode, setOpenDialog)

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUser(null)
    setDialogMode(null)
    setResetAvatar(false)
    setNewAvatar(null)
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
  setSelectedUsers([])
  requestAnimationFrame(() => {
    setResetSelectionSignal(true)
    requestAnimationFrame(() => setResetSelectionSignal(false))
  })
}

    // 1️⃣ useEffect untuk pencarian
    const fetchUsers = useCallback(() => {
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

        router.get(route("admin.users.index"), query, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false),
        })
    }, [pageIndex, debouncedPageSize, debouncedSearch, sorting])


        useEffect(() => {
        fetchUsers()
        }, [fetchUsers])


    // 2️⃣ useEffect untuk event tag:delete
    useEffect(() => {
    const handleDelete = (e: CustomEvent<User>) => {
        setSelectedUser(e.detail)
        setDialogMode("delete")
        setOpenDialog(true)
    }

    window.addEventListener("user:delete", handleDelete as EventListener)

    return () => {
        window.removeEventListener("user:delete", handleDelete as EventListener)
    }
    }, []) // kosong artinya hanya dijalankan sekali saat mount


const handleExportCSV = () => {
  const exportData = selectedUsers.length ? selectedUsers : users.data

  if (!exportData.length) {
    toast.warning("Tidak ada data untuk diekspor.")
    return
  }

  const csvContent = [
    Object.keys(exportData[0])
      .filter((key) => key !== "avatar")
      .join(","),
    ...exportData.map((user) =>
      Object.values(user)
        .filter((_, i) => Object.keys(user)[i] !== "avatar")
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `users-export-${Date.now()}.csv`)
  link.click()
}

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="List Users" />

      <div className="mx-auto py-10 w-full px-8">
            {isLoading && (
                <div className="flex items-center justify-center py-6">
                <Loader2 className="animate-spin w-5 h-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Memuat semua data...</span>
                </div>
            )}

            <DataTable
                columns={userColumns(mergedSearch)}
                data={users?.data ?? []}
                enableInternalFilter={true}
                enablePagination={true}
                sorting={sorting}
                onSortingChange={setSorting}
                customToolbar={{
                    searchValue: search,
                    onSearchChange: setSearch,
                    isLoading,
                    selectedRows: selectedUsers,
                    // onResetSelection: resetSelection,
                    onBulkDelete: () => setDialogMode("bulk-delete"),
                    onAddClick: () => router.visit("/admin/users/create"),
                    addButtonLabel: "Add User",
                    showSearch: true,
                    showAddButton: true,
                    onExportCSV: handleExportCSV, // ✅ tambahan
                    canAdd: auth.permissions?.includes("create_user"),
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
                    pageCount: users.meta.last_page,
                }}
                resetRowSelectionSignal={resetSelectionSignal}
                onRowSelectionChange={(rows) => setSelectedUsers(rows)}
                tableId={tableKey}
                onColumnVisibilityChange={setColumnVisibility}
                columnVisibility={columnVisibility}
                />
      </div>

      {/* View Dialog */}
      <UserViewDialog
        user={selectedUser}
        open={dialogMode === "view" && openDialog}
        onOpenChange={handleCloseDialog}
        onEdit={handleEdit}
        onDelete={() => setDialogMode("delete")}
      />

      {/* Edit Sheet */}
      <EditSheet<UserForm>
        title="Edit User"
        description="Ubah user yang dipilih. Klik simpan setelah selesai."
        open={dialogMode === "edit" && openDialog && selectedUser !== null}
        onOpenChange={handleCloseDialog}
        initialData={selectedUser ? userToFormData(selectedUser) : undefined}
        actionUrl={selectedUser ? route('admin.users.update', selectedUser.id) : "#"}
        method="put"
        fields={userFields}
        beforeFields={
          selectedUser?.avatar && (
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Avatar</p>
                <img
                  src={selectedUser.avatar}
                  alt="Current Avatar"
                  className="w-16 h-16 rounded-md object-cover"
                />
              </div>
              <AvatarUploader
                maxSizeMB={2}
                onFileChange={(file) => {
                  setNewAvatar(file)
                }}
              />
            </div>
          )
        }
        beforeSubmit={(formData) => {
          if (newAvatar) {
            formData.set("avatar", newAvatar)
          }
          if (resetAvatar) {
            formData.set("reset_avatar", "1")
          }
        }}
      />
    <AlertDialog open={dialogMode === "delete" && openDialog} onOpenChange={handleCloseDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
                Apakah kamu yakin ingin menghapus <strong>{selectedUser?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
                    if (selectedUser) {
                    setIsDeleting(true)
                    router.delete(route("admin.users.destroy", selectedUser.id), {
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
    <AlertDialog
        open={dialogMode === "bulk-delete"}
        onOpenChange={handleCloseDialog}
        >
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Hapus Beberapa Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
                Kamu akan menghapus <strong>{selectedUsers.length}</strong> pengguna. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <Button
                variant="destructive"
                onClick={() => {
                const ids = selectedUsers.map((u) => u.id)
                router.post(route("admin.users.bulk-delete"), { ids }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Berhasil menghapus pengguna.")
                        resetSelection()
                        handleCloseDialog()

                    },
                    onError: () => {
                        toast.error("Gagal menghapus pengguna.")
                    },
                })
                }}
            >
                Hapus
            </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    </AppLayout>
  )
}
