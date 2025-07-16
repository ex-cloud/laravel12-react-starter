"use client"

import { useForm } from "@inertiajs/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { BreadcrumbItem } from "@/types"
import { AvatarUploadInput } from "@/components/AvatarUploadInput"
import { useState } from "react"
import HeadingSmall from "@/components/heading-small"

const breadcrumbs: BreadcrumbItem[] = [
//   { title: "List User", href: "/admin/users" },
  { title: "Create User", href: "/admin/users/create" },
]

type CreateUserForm = {
  name: string
  username: string
  email: string
  password: string
  password_confirmation: string
  avatar: File | null
}

export default function CreateUser() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const { data, setData, post, processing, errors } = useForm<CreateUserForm>({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    avatar: null,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post("/admin/users", { forceFormData: true })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User"/>

      <div className="container mx-auto py-10">
      <HeadingSmall title="Create User" description="Create new user"/>
        <div className="max-w-xl py-8">
            <form onSubmit={submit} className="space-y-6 border py-4 px-3 rounded-md">
              <AvatarUploadInput
                previewUrl={avatarPreview ?? undefined}
                onChange={(file) => {
                  setData("avatar", file)
                  setAvatarPreview(file ? URL.createObjectURL(file) : null)
                }}
                error={errors.avatar}
              />
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Enter name"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={data.username}
                  onChange={(e) => setData("username", e.target.value)}
                  placeholder="Enter username"
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="Enter email"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div>
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
              <div className="pt-4">
                <Button type="submit" disabled={processing}>
                  Simpan
                </Button>
              </div>
            </form>
        </div>
      </div>
    </AppLayout>
  )
}
