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
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
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
import { Trash } from "lucide-react" // opsional untuk ikon
import { Button } from "../ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterableColumns?: string[] // ⬅️ multi-column filter
  enableInternalFilter?: boolean
  enablePagination?: boolean
  onRowSelectionChange?: (selectedRows: TData[]) => void
  headerContent?: React.ReactNode // ⬅️ ini tambahan
  columnVisibility?: Record<string, boolean>
}
const handleColumnVisibilityChange = (
        set: React.Dispatch<React.SetStateAction<VisibilityState>>
        ) =>
        (updater: Updater<VisibilityState>) =>
            set((prev) =>
            typeof updater === "function" ? updater(prev) : updater
            )

export function DataTable<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  enableInternalFilter = true,
  enablePagination = true,
  onRowSelectionChange,
  headerContent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
  { id: "name", desc: false }, // ✅ default sort by name ascending (A-Z)
])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("table.columnVisibility")
            try {
            return saved ? JSON.parse(saved) : { created_at: false, updated_at: false }
            } catch {
            return { created_at: false, updated_at: false }
            }
        }
        return { created_at: false, updated_at: false }
    })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: handleColumnVisibilityChange(setColumnVisibility),
    state: {
        sorting,
        columnFilters,
        rowSelection,
        columnVisibility,
    },
  })

  React.useEffect(() => {
      localStorage.setItem("table.columnVisibility", JSON.stringify(columnVisibility))
      if (onRowSelectionChange) {
      const selected = table.getFilteredSelectedRowModel().rows.map((r) => r.original)
      onRowSelectionChange(selected)
    }
  }, [rowSelection, onRowSelectionChange, table, columnVisibility])

  return (
    <div>
      <TableContext.Provider value={table}>
        <div>
            {/* ✅ Kondisi Bulk Actions */}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex gap-2">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Bulk actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                    onClick={() => {
                        const selected = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
                        console.log("Delete selected items:", selected)
                        // TODO: trigger delete action atau modal konfirmasi
                    }}
                    className="text-red-600 focus:text-red-700"
                    >
                    <Trash className="mr-2 h-4 w-4" /> Delete selected
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )}
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

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="dark:bg-zinc-900 sticky top-0 z-10">
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
      </div>

      {enablePagination && (
        <div className="py-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  )
}
