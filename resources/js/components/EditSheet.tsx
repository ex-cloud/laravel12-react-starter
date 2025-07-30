"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { router, useForm } from "@inertiajs/react"
import { useCallback, useEffect, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import type { FormDataConvertible } from "@/types/utils"
import { safeSetFormData } from "@/types/utils"
import { slugify } from "@/lib/slugify"

type SafeFieldName<T> = keyof T & string

export type FieldConfig<T> = {
  name: SafeFieldName<T>
  label: string
  type?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
}

export interface EditSheetProps<T> {
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<T>
  actionUrl: string
  method: "post" | "put"
  fields: FieldConfig<T>[]
  extraContent?: ReactNode
  beforeSubmit?: (formData: FormData) => void
  beforeFields?: ReactNode
}

export function EditSheet<T extends Record<string, FormDataConvertible>>({
  title,
  description,
  open,
  onOpenChange,
  initialData,
  actionUrl,
  fields,
  extraContent,
  beforeSubmit,
  beforeFields,
}: EditSheetProps<T>) {
    const { data, setData, errors, processing, reset } = useForm<Partial<T>>(initialData || {})
    const [isSlugEdited, setIsSlugEdited] = useState(false)
    const setField = useCallback(
    (key: keyof T, value: FormDataConvertible) => {
        setData((prev) => ({ ...prev, [key]: value }))
    },
    [setData]
    )

  useEffect(() => {
    if (!open || !initialData) {
      reset()
      return
    }

    fields.forEach((field) => {
      const value = initialData[field.name]
      if (value !== undefined) {
        safeSetFormData(setField, field.name, value)
      }
    })
  }, [open, reset, initialData, fields, setField])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("_method", "patch")

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return

      const field = fields.find((f) => f.name === key)

      if (field?.type === "file") {
        if (value instanceof File) {
          formData.append(key, value)
        }
        // ⛔ Jangan kirim string lama (misalnya "avatars/...")
      } else {
        formData.append(key, value as string)
      }
    })

    if (typeof beforeSubmit === "function") {
      beforeSubmit(formData)
    }

    router.post(actionUrl, formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        onOpenChange(false)
        reset()
      },
      onError: (error) => {
        console.error("Form submit error:", error)
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="lg:max-w-md max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>

            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                {/* 👇 render avatar + uploader di awal */}
                {beforeFields && <div>{beforeFields}</div>}
              {fields.map((field) => {
                const fieldError = errors[field.name as keyof typeof errors]

                // ❌ Skip input file — pakai AvatarUploader di extraContent
                if (field.type === "file") return null

                return (
                  <div key={field.name} className="grid gap-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      disabled={field.disabled || field.name === "slug"}
                      value={String(data[field.name] ?? "")}
                      onChange={(e) => {
                        let value: FormDataConvertible = e.target.value

                        if (field.type === "number") value = Number(value)
                        else if (field.type === "date") value = new Date(value)

                        // Auto-slugify jika field name
                        if (field.name === "name") {
                            safeSetFormData(setField, "name" as SafeFieldName<T>, value)
                            if (!isSlugEdited) {
                            const generatedSlug = slugify(String(value))
                            safeSetFormData(setField, "slug" as SafeFieldName<T>, generatedSlug)
                            }
                        } else if (field.name === "slug") {
                            setIsSlugEdited(true) // user menyentuh slug => jangan override lagi
                            safeSetFormData(setField, "slug" as SafeFieldName<T>, value)
                        } else {
                            safeSetFormData(setField, field.name, value)
                        }
                    }}
                    />
                    {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                  </div>
                )
              })}

              {extraContent && <div>{extraContent}</div>}
            </div>
          </div>

          <SheetFooter className="pt-4">
            <Button type="submit" disabled={processing}>Save changes</Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
