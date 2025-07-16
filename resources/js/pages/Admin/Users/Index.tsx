"use client"

import AppLayout from '@/layouts/app-layout'
import { Head, Link, usePage, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { userColumns } from './user-columns'
import type { BreadcrumbItem, User } from '@/types'
import UserViewDialog from '@/components/UserViewDialog'
import { useFlashToast } from '@/hooks/use-flash-toast'
import { useUserDialogListener } from '@/hooks/use-user-dialog-listener'
import { EditSheet } from '@/components/EditSheet'
import { ExtractFormFields } from '@/types/utils'
import { userFields, userToFormData } from './user-fields'
import AvatarUploader from '@/components/AvatarUploader'
import { useDebounce } from '@/hooks/use-debounce'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export type UserForm = ExtractFormFields<User>

type UsersPageProps = {
  users: {
    data: User[]
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'List User', href: '/admin/users' },
]

export default function UsersIndex({ users }: UsersPageProps) {
  const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string } }

  const [resetAvatar, setResetAvatar] = useState(false)
  const [newAvatar, setNewAvatar] = useState<File | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "delete" | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)


  useFlashToast(flash)
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
const mergedSearch = debouncedSearch.trim()
useEffect(() => {
    console.log("Searching for:", debouncedSearch)
  router.get(route("admin.users.index"), { search: debouncedSearch }, {
    preserveState: true,
    replace: true,
  })
}, [debouncedSearch])


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="List Users" />

      <div className="mx-auto py-10 w-full px-8">
            <DataTable
            columns={userColumns(mergedSearch)}
            data={users.data}
            // filterableColumns={["name", "username", "email"]}
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
                <Link href="/users/create">
                    <Button type="button" variant="default">+ Add user</Button>
                </Link>
                </>
            }
            //   onRowSelectionChange={(rows) => setSelectedUser(rows[0] ?? null)}
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
    </AppLayout>
  )
}
