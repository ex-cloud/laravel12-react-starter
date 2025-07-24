// DataTable.tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  Updater,
  RowSelectionState,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./DataTablePagination"
import { TableContext } from "./TableContext"
import { Loader2 } from "lucide-react"

interface DataTableProps<TData extends { id: number | string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  tableId?: string
  filterableColumns?: string[]
  enableInternalFilter?: boolean
  enablePagination?: boolean
  pagination?: {
    pageIndex: number
    pageSize: number
    onPageChange: (pageIndex: number) => void
    onPageSizeChange: (size: number) => void
    pageCount: number
  }
  resetRowSelectionSignal?: boolean
  onRowSelectionChange?: (selectedRows: TData[]) => void
  headerContent?: React.ReactNode
  onColumnVisibilityChange?: (updater: Updater<VisibilityState>) => void
  columnVisibility?: VisibilityState
}

const handleColumnVisibilityChange = (
  set: React.Dispatch<React.SetStateAction<VisibilityState>>
) =>
  (updater: Updater<VisibilityState>) =>
    set((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    )

export function DataTable<TData extends { id: number | string }, TValue>({
  columns,
  data,
  filterableColumns = [],
  enableInternalFilter = true,
  enablePagination = true,
  onRowSelectionChange,
  resetRowSelectionSignal = false,
  headerContent,
  pagination,
  onColumnVisibilityChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(() => {
  return columns.length > 0 ? [{ id: columns[0].id?.toString() ?? "id", desc: false }] : []
})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const [visibleRows, setVisibleRows] = React.useState(() => {
    if (!pagination) return 10
    return data.length
  })
  const [isFetchingMore, setIsFetchingMore] = React.useState(false)
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!pagination) {
      setVisibleRows(10)
      requestAnimationFrame(() => {
        if (tableContainerRef.current) {
          tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
      })
    }

    const handleScroll = () => {
      const container = tableContainerRef.current
      if (!container) return

      const { scrollTop, scrollHeight, clientHeight } = container
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 50

      if (nearBottom && !isFetchingMore && visibleRows < data.length) {
        setIsFetchingMore(true)
        setTimeout(() => {
          setVisibleRows((prev) => Math.min(prev + 20, data.length))
          setIsFetchingMore(false)
        }, 800)
      }
    }

    const container = tableContainerRef.current
    container?.addEventListener("scroll", handleScroll)
    return () => container?.removeEventListener("scroll", handleScroll)
  }, [isFetchingMore, visibleRows, data.length, pagination])

  React.useEffect(() => {
    if (pagination) {
      setVisibleRows(data.length)
    }
  }, [pagination, data.length])

  const table = useReactTable({
    data: !pagination ? data.slice(0, visibleRows) : data,
    columns,
    manualPagination: !!pagination,
    pageCount: pagination?.pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id.toString(),
    onColumnVisibilityChange: onColumnVisibilityChange ?? handleColumnVisibilityChange(setColumnVisibility),
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      pagination: pagination
        ? {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }
        : undefined,
    },
  })

  React.useEffect(() => {
    if (resetRowSelectionSignal) {
      table.resetRowSelection()
    }
  }, [resetRowSelectionSignal, table])

    // 2️⃣ Hanya trigger row selection saat benar-benar berubah
    const lastSelectedRef = React.useRef<TData[]>([])

    React.useEffect(() => {
    if (onRowSelectionChange) {
        const selected = table.getFilteredSelectedRowModel().rows.map((r) => r.original)

        const isEqual =
        selected.length === lastSelectedRef.current.length &&
        selected.every((row, i) => row.id === lastSelectedRef.current[i]?.id)

        if (!isEqual) {
        lastSelectedRef.current = selected
        onRowSelectionChange(selected)
        }
    }
    }, [rowSelection, onRowSelectionChange, table])

  return (
    <div>
      <TableContext.Provider value={table}>
        <div>
          {enableInternalFilter && (
            <div className="flex flex-wrap justify-between items-start py-4 gap-4">
              <div className="flex flex-wrap gap-2">
                {filterableColumns.map((col) =>
                  table.getColumn(col) ? (
                    <Input
                      key={col}
                      placeholder={`Filter ${col}...`}
                      value={(table.getColumn(col)?.getFilterValue() as string) ?? ""}
                      onChange={(event) =>
                        table.getColumn(col)?.setFilterValue(event.target.value)
                      }
                      className="max-w-sm"
                    />
                  ) : null
                )}
              </div>
              {headerContent && <div className="flex gap-2">{headerContent}</div>}
            </div>
          )}
        </div>
      </TableContext.Provider>

      <div
        className="overflow-auto max-h-[70vh] rounded-lg border"
        ref={tableContainerRef}
      >
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-900 shadow-md border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!pagination && visibleRows < data.length && isFetchingMore && (
          <tfoot>
            <tr>
              <td colSpan={columns.length}>
                <div className="w-full h-12 shimmer-row flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-sm text-muted-foreground">Memuat data tambahan...</span>
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </div>

      {enablePagination && (
        <div className="py-4">
          <DataTablePagination
            {...(pagination
              ? {
                  pageIndex: pagination.pageIndex,
                  pageCount: pagination.pageCount,
                  pageSize: pagination.pageSize,
                  onPageChange: pagination.onPageChange,
                  onPageSizeChange: pagination.onPageSizeChange,
                  selectedCount: table.getFilteredSelectedRowModel().rows.length,
                  totalCount: table.getRowModel().rows.length,
                }
              : {
                  table,
                })}
          />
        </div>
      )}
    </div>
  )
}
