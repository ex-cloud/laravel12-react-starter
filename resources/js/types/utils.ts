export type FormDataConvertible =
  | string
  | number
  | boolean
  | Date
  | File
  | null
  | undefined

// Bentuk overload dari setData() milik useForm Inertia
export type SetFormDataFn<T> = {
  (key: keyof T, value: FormDataConvertible): void
  (data: Partial<T>): void
}

export type ExtractFormFields<T> = {
  [K in keyof T as
    K extends "id" | "created_at" | "updated_at" | "email_verified_at" ? never :
    T[K] extends FormDataConvertible ? K : never
  ]: T[K]
}

export function safeSetFormData<T extends Record<string, FormDataConvertible>>(
    setData: (key: keyof T, value: FormDataConvertible) => void,
    key: keyof T,
    value: unknown
  ) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value instanceof Date ||
      value instanceof File ||
      value === null ||
      value === undefined
    ) {
      setData(key, value)
    } else {
      console.warn(`Invalid form value for key "${String(key)}":`, value)
    }
  }
