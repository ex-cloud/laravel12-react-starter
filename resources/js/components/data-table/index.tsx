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
import { DataTableViewOptions } from "./DataTableViewOptions"
import { DataTablePagination } from "./DataTablePagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterableColumns?: string[] // ⬅️ multi-column filter
  enableInternalFilter?: boolean
  enablePagination?: boolean
  onRowSelectionChange?: (selectedRows: TData[]) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  enableInternalFilter = true,
  enablePagination = true,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

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
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selected = table.getFilteredSelectedRowModel().rows.map((r) => r.original)
      onRowSelectionChange(selected)
    }
  }, [rowSelection, onRowSelectionChange, table])

  return (
    <div>
      {enableInternalFilter && (
        <div className="flex items-center py-4 gap-4 flex-wrap">
          {filterableColumns.map((col) => (
            table.getColumn(col) && (
              <Input
                key={col}
                placeholder={`Filter ${col}...`}
                value={(table.getColumn(col)?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn(col)?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            )
          ))}
          <DataTableViewOptions table={table} />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
