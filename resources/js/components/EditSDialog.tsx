"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "@inertiajs/react"
import type { FormEvent } from "react"

export type FieldConfig<T> = {
    name: keyof T & string
    label: string
    type?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
}

export interface EditSheetProps<T> {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<T>
  actionUrl: string
  method: "post" | "put"
  fields: FieldConfig<T>[]
}

type FormDataConvertible = string | number | boolean | File | null | undefined | Date

function safeSetData<T>(
    setData: <K extends keyof T>(key: K, value: FormDataConvertible) => void,
    key: keyof T,
    value: FormDataConvertible
  ) {
    setData(key, value)
  }

export function EditDialog<T extends Record<string, FormDataConvertible>>({
    title,
    open,
    onOpenChange,
    initialData,
    actionUrl,
    method,
    fields,
  }: EditSheetProps<T>) {
    const { data, setData, errors, processing, reset, submit } = useForm<Partial<T>>(initialData || {})
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault()
      submit(method, actionUrl, {
        onSuccess: () => {
          onOpenChange(false)
          reset()
        }
      })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {fields.map((field) => {
                const fieldError = errors[field.name as keyof typeof errors]
                return (
                  <div key={String(field.name)} className="space-y-1">
                    <Label htmlFor={String(field.name)}>{field.label}</Label>
                    <Input
                      id={String(field.name)}
                      type={field.type ?? "text"}
                      value={String(data[field.name] ?? "")}
                      onChange={(e) => {
                        let value: FormDataConvertible = e.target.value
                        if (field.type === "number") {
                          value = Number(e.target.value)
                        } else if (field.type === "date") {
                          value = new Date(e.target.value)
                        }
                        safeSetData(setData, field.name as keyof T, value)
                      }}
                    />
                    {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                  </div>
                )
              })}
              <Button type="submit" disabled={processing}>
                Simpan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )
}
