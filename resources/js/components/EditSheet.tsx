"use client"

import {
  Sheet, SheetClose, SheetContent, SheetDescription,
  SheetFooter, SheetHeader, SheetTitle
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { router, useForm } from "@inertiajs/react"
import { useCallback, useEffect, useState } from "react"
import type { FormEvent, ChangeEvent, ReactNode } from "react"
import type { FormDataConvertible } from "@/types/utils"
import { safeSetFormData } from "@/types/utils"

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
}: EditSheetProps<T>) {
  const { data, setData, errors, processing, reset } = useForm<Partial<T>>(initialData || {})
  const [filePreviews, setFilePreviews] = useState<Record<string, string | null>>({})

  const setField = useCallback(
    (key: keyof T, value: FormDataConvertible) => {
      setData((prev) => ({ ...prev, [key]: value }))
    },
    [setData]
  )

  useEffect(() => {
    if (!open || !initialData) {
      reset()
      setFilePreviews({})
      return
    }

    fields.forEach((field) => {
      const value = initialData[field.name]
      if (value !== undefined) {
        safeSetFormData(setField, field.name, value)
      }

      // handle file preview (e.g., avatar)
      if (field.type === "file" && typeof value === "string") {
        setFilePreviews((prev) => ({ ...prev, [field.name]: value }))
      }
    })
  }, [open, reset, initialData, fields, setField])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: FieldConfig<T>) => {
    const file = e.target.files?.[0] ?? null
    safeSetFormData(setField, field.name, file)

    if (file) {
      const url = URL.createObjectURL(file)
      setFilePreviews((prev) => ({ ...prev, [field.name]: url }))
    } else {
      setFilePreviews((prev) => ({ ...prev, [field.name]: null }))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("_method", "put")

    Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined) return

        const field = fields.find((f) => f.name === key)

        if (field?.type === "file") {
          if (value instanceof File) {
            formData.append(key, value)
          }
          // ⛔ Jangan kirim string path lama (e.g., "avatars/...")
        } else {
          formData.append(key, value as string)
        }
      })

    router.post(actionUrl, formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        onOpenChange(false)
        reset()
        setFilePreviews({})
      },
      onError: (error) => {
        console.error("Form submit error:", error)
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>

            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              {fields.map((field) => {
                const fieldError = errors[field.name as keyof typeof errors]
                const isFile = field.type === "file"
                const previewUrl = filePreviews[field.name]

                return (
                  <div key={field.name} className="grid gap-2">
                    <Label htmlFor={field.name}>{field.label}</Label>

                    {isFile && previewUrl && (
                      <img
                        src={previewUrl}
                        alt="File Preview"
                        className="w-16 h-16 rounded-full object-cover mb-2"
                      />
                    )}

                    <Input
                      id={field.name}
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      value={!isFile ? String(data[field.name] ?? "") : undefined}
                      onChange={(e) => {
                        if (isFile) {
                          handleFileChange(e, field)
                        } else {
                          let value: FormDataConvertible = e.target.value
                          if (field.type === "number") value = Number(value)
                          else if (field.type === "date") value = new Date(value)
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
