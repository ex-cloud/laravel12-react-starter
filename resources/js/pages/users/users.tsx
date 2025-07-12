"use client"

import AppLayout from '@/layouts/app-layout'
import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
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
import { Label } from '@/components/ui/label'
import { Switch } from "@/components/ui/switch"

export type UserForm = ExtractFormFields<User>

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'List User', href: '/users' },
]

export default function Users({ users }: { users: { data: User[] } }) {
  const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string } }

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  useFlashToast(flash)
  useUserDialogListener(setSelectedUser, setDialogMode, setOpenDialog)

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUser(null)
    setDialogMode(null)
    setResetAvatar(false)
  }
  const [resetAvatar, setResetAvatar] = useState(false)
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="List Users" />

      <div className="mx-auto py-10 w-full px-8">
        <div className="flex justify-end mb-4">
          <Link href="/users/create">
            <Button variant="default">+ Tambah User</Button>
          </Link>
        </div>

        <DataTable
          columns={userColumns()}
          data={users.data}
          filterableColumns={["name", "username", "email"]}
          enableInternalFilter
          enablePagination
          onRowSelectionChange={(rows) => setSelectedUser(rows[0] ?? null)}
        />
      </div>

      {/* View Dialog */}
      <UserViewDialog
        user={selectedUser}
        open={dialogMode === "view" && openDialog}
        onOpenChange={handleCloseDialog}
      />

      {/* Edit Sheet */}
      <EditSheet<UserForm>
        title="Edit User"
        description="Ubah user yang dipilih. Klik simpan setelah selesai."
        open={dialogMode === "edit" && openDialog && selectedUser !== null}
        onOpenChange={handleCloseDialog}
        initialData={selectedUser ? userToFormData(selectedUser) : undefined}
        actionUrl={selectedUser ? route('users.update', selectedUser.id) : "#"}
        method="put"
        fields={userFields}
        extraContent={
            selectedUser?.avatar && (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Avatar</p>
                  <img
                    src={selectedUser.avatar}
                    alt="Current Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between mt-1">
                    <Label htmlFor="reset_avatar">Reset avatar ke default</Label>
                    <Switch
                        id="reset_avatar"
                        checked={resetAvatar}
                        onCheckedChange={setResetAvatar}
                        className="data-[state=checked]:bg-primary"
                    />
                </div>
              </div>
            )
          }
      />
    </AppLayout>
  )
}
