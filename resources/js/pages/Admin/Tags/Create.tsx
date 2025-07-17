"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import { Head, useForm } from "@inertiajs/react"
import { BreadcrumbItem } from "@/types"
import HeadingSmall from "@/components/heading-small"
import { slugify } from "@/lib/slugify"
import { useState } from "react"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Create Tag", href: "/admin/tags/create" },
]

type CreateTagForm = {
  name: string
  slug: string
}

export default function CreateTag() {

  const { data, setData, post, processing, errors } = useForm<CreateTagForm>({
    name: "",
    slug: ""
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post("/admin/tags", { forceFormData: true })
  }

  const [isSlugEdited, setIsSlugEdited] = useState(false)

    const handleNameChange = (value: string) => {
    setData("name", value)
    if (!isSlugEdited) {
        setData("slug", slugify(value))
    }
    }

    const handleSlugChange = (value: string) => {
    setIsSlugEdited(true)
    setData("slug", value)
    }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Tag"/>

      <div className="container mx-auto py-10">
      <HeadingSmall title="Create Tag" description="Create new tag"/>
        <div className="max-w-xl py-8">
            <form onSubmit={submit} className="space-y-6 border py-4 px-3 rounded-md">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter name"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="username">Slug</Label>
                <Input
                    disabled={true}
                    id="slug"
                    value={data.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="Enter slug"
                />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
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
