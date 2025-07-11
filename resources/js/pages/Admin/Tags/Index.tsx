import AppLayout from '@/layouts/app-layout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { tagColumns } from './tag-columns'
import { toast } from 'sonner'
import type { BreadcrumbItem, Tag } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tags Manajemen',
    href: '/admin/tags',
  },
]

interface Props {
    tags: Tag[]
  }

export default function TagIndex({ tags }: Props) {
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string; info?: string }
      }
      const [selectedTags, setSelectedTags] = useState<Tag[]>([])
      const handleBulkDelete = () => {
        if (selectedTags.length === 0) return

        if (!confirm(`Yakin ingin menghapus ${selectedTags.length} tag?`)) return

        router.post(
          route("admin.tags.bulk-delete"),
          { ids: selectedTags.map((t) => t.id) },
          { preserveScroll: true }
        )
      }
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Tag" />
      <div className="mx-auto py-10 w-full px-8">
        <div className="flex justify-end mb-4 gap-2">
          <Link href={route('admin.tags.create')}>
            <Button variant="default" size={'sm'} className='text-xs'>+ Tambah Tag</Button>
          </Link>
          {selectedTags.length > 0 && (
          <Button
            variant="destructive" size={'sm'} className='text-xs'
            onClick={handleBulkDelete}
          >
            Hapus Terpilih ({selectedTags.length})
          </Button>
        )}
        </div>

        <DataTable
           columns={tagColumns()}
           data={tags}
           filterableColumns={["name", "slug"]}
           onRowSelectionChange={setSelectedTags}
           enableInternalFilter
        />
      </div>
    </AppLayout>
  )
}
