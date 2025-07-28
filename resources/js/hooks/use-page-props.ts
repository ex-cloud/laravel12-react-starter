// src/hooks/use-page-props.ts
import { usePage } from '@inertiajs/react'
import type { PageProps } from '@/types'

export function usePageProps<T extends object = Record<string, unknown>>() {
  return usePage<PageProps<T>>().props
}
