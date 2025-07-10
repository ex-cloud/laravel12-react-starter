"use client"

import { useForm } from '@inertiajs/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { User } from '@/types'
import { useEffect } from 'react'

interface Props {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserEditDialog({ user, open, onOpenChange }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: '',
        username: '',
        email: '',
      })

      useEffect(() => {
        if (user) {
          setData({
            name: user.name ?? '',
            username: user.username ?? '',
            email: user.email ?? '',
          })
        }
      }, [user, setData])

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        put(`/users/${user.id}`, {
          onSuccess: () => onOpenChange(false),
        })
      }

      if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <Button type="submit" disabled={processing}>
            Simpan Perubahan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
