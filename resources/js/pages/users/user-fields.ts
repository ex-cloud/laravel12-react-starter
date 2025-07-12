import { FieldConfig } from "@/components/EditSheet"
import type { User } from "@/types"
import { ExtractFormFields } from "@/types/utils"

export type UserForm = ExtractFormFields<User>

export const userFields: FieldConfig<UserForm>[] = [
  { name: "name", label: "Nama" },
  { name: "username", label: "Username" },
  { name: "email", label: "Email", type: "email" },
  { name: "avatar", label: "Avatar", type: "file" },
]

export function userToFormData(user: User): UserForm {
  return {
    name: user.name,
    username: user.username ?? "",
    email: user.email,
    avatar: user.avatar ?? undefined
  }
}
