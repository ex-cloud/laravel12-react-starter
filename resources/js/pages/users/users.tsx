"use client"

import AppLayout from '@/layouts/app-layout'
import { Head, Link, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { userColumns } from './user-columns'
import type { BreadcrumbItem, User } from '@/types'
import UserViewDialog from '@/components/UserViewDialog'
import UserEditDialog from '@/components/UserEditDialog'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'List User',
    href: '/users',
  },
]

export default function Users({ users }: { users: { data: User[] } }) {
  const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string } }

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (flash?.info) {
      toast(flash.info)
      return
    }

    if (flash?.success) {
      // Tentukan deskripsi berdasarkan isi pesan
      let description = ''
      if (flash.success.includes('ditambahkan')) {
        description = 'User berhasil ditambahkan ke sistem.'
      } else if (flash.success.includes('diperbarui')) {
        description = 'Perubahan data user berhasil disimpan.'
      }

      toast.success(flash.success, {
        description,
        icon: '✅',
      })
    }

    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="List Users" />
      <div className="mx-auto py-10 w-full px-8">
        <div className="flex justify-end mb-4">
          <Link href="/users/create">
            <Button variant="default" className='cursor-pointer'>+ Tambah User</Button>
          </Link>
        </div>
        <DataTable
            columns={userColumns(setSelectedUser, setDialogMode, setOpenDialog)}
            data={users.data}
            filterColumn="email"
            placeholder="Cari email user..."
        />
      </div>

      <UserViewDialog
        user={selectedUser}
        open={dialogMode === "view" && openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open)
          if (!open) {
            setSelectedUser(null)
            setDialogMode(null)
          }
        }}
      />

      <UserEditDialog
        user={selectedUser}
        open={dialogMode === "edit" && openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open)
          if (!open) {
            setSelectedUser(null)
            setDialogMode(null)
          }
        }}
      />
    </AppLayout>
  )
}
