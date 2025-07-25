"use client"

import AppLayout from '@/layouts/app-layout'
import { Head, usePage, router } from '@inertiajs/react'
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
  const { flash } = usePage().props as { flash?: Flash }
  const tableKey = "users"
  const {
    pageSize,
    columnVisibility,
    setPageSize,
    setColumnVisibility,
    } = useTablePreferences(tableKey)

    useFlashToast(flash)

    const [resetAvatar, setResetAvatar] = useState(false)
    const [newAvatar, setNewAvatar] = useState<File | null>(null)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [dialogMode, setDialogMode] = useState<"view" | "edit" | "delete" | "bulk-delete" | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [resetSelectionSignal, setResetSelectionSignal] = useState(false)
    const [pageIndex, setPageIndex] = useState(users.meta.current_page - 1)
    const [page, setPage] = useState(users.meta.current_page)
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
        router.get(
            route("admin.users.index"),
            { page, perPage: debouncedPageSize, search: debouncedSearch },
            {
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false),
            }
        )
        }, [page, debouncedPageSize, debouncedSearch]) // dependency yang dibutuhkan

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

    useEffect(() => {
        setPage(pageIndex + 1)
    }, [pageIndex])

    useEffect(() => {
  setPageIndex(users.meta.current_page - 1)
  setPage(users.meta.current_page)
}, [users.meta.current_page])
// const headerContent = useMemo(() => {
//   return (
//     <>
//       <div className="relative w-64">
//         <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="pl-10 pr-8"
//         />
//         {isLoading && (
//           <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
//         )}
//       </div>

//       {/* {selectedUsers.length > 0 && (
//         <>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <span>
//                     <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex cursor-pointer">
//                     <Trash />
//                     Bulk Actions
//                     </Button>
//                 </span>
//                 </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem
//                 onClick={() => setDialogMode("bulk-delete")}
//                 className="text-red-600 focus:text-red-700"
//               >
//                 <Trash className="mr-2 h-4 w-4" />
//                 Delete selected {selectedUsers.length} ?
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <Button variant="outline" size="sm" className="h-8" onClick={resetSelection}>
//             Reset Selection
//           </Button>
//         </>
//       )} */}

//       <DataTableViewOptions/>
//       <Link href="/admin/users/create">
//         <Button type="button" variant="default">
//           + Add user
//         </Button>
//       </Link>
//     </>
//   )
// }, [search, isLoading])

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
                customToolbar={{
                    searchValue: search,
                    onSearchChange: setSearch,
                    isLoading,
                    selectedRows: selectedUsers,
                    onResetSelection: resetSelection,
                    onBulkDelete: () => setDialogMode("bulk-delete"),
                    onAddClick: () => router.visit("/admin/users/create"),
                    addButtonLabel: "Add User",
                    showSearch: true,
                    showAddButton: true,
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
