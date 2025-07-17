import { FieldConfig } from "@/components/EditSheet"
import type { Tag } from "@/types"
import { ExtractFormFields } from "@/types/utils"

export type TagForm = ExtractFormFields<Tag>

export const tagFields: FieldConfig<TagForm>[] = [
  { name: "name", label: "Nama" },
  { name: "slug", label: "Slug" },
]

export function tagToFormData(tag: Tag): TagForm {
  return {
    name: tag.name,
    slug: tag.slug
  }
}
