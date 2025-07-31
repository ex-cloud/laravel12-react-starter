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
OnChangeFn,
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
import { Loader2, Tally2 } from "lucide-react"
import { DataTableToolbar } from "./DataTableToolbar"
import { useTablePreferences } from "@/hooks/use-table-preferences"
import { cn } from "@/lib/utils"
import { getColumnWidthClass } from "@/utils/table-helpers"
import { TableSkeletonRow } from "../TableSkeletonRow"
import { AnimatePresence, motion } from "framer-motion"

interface DataTableProps<TData extends { id: number | string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    tableId?: string
    filterableColumns?: string[]
    enableInternalFilter?: boolean
    enablePagination?: boolean
    sorting?: SortingState
    onSortingChange?: OnChangeFn<SortingState>
    customToolbar?: {
        showSearch?: boolean
        searchValue?: string
        onSearchChange?: (value: string) => void
        isLoading?: boolean
        selectedRows?: TData[]
        onResetSelection?: () => void
        onBulkDelete?: (payload: {
            selectAll: boolean
            selectedIds: (string | number)[]
            activeSearch?: string
        }) => void
        onAddClick?: () => void
        addButtonLabel?: string
        showAddButton?: boolean
        onExportCSV?: () => void
        canAdd?: boolean
        onSetBulkDeleteMessage?: (message: string) => void
    }
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
    totalCount?: number
}

    export const defaultColumnSizing = {
        size: 160,
        minSize: 80,
        maxSize: 360,
        firstColumnSize: 40
    }

export function DataTable<TData extends { id: number | string }, TValue>({
columns,
data,
sorting, // ✅ Ini sudah di-destructure
onSortingChange, // ✅ Ini juga
filterableColumns = [],
enableInternalFilter = true,
enablePagination = true,
onRowSelectionChange,
resetRowSelectionSignal = false,
headerContent,
customToolbar,
pagination,
tableId,
totalCount,
}: DataTableProps<TData, TValue>) {

    const {
    columnVisibility,
    setColumnVisibility,
    sorting: savedSorting,
    setColumnSizing,
    columnSizing,
    setPageSize,
    } = useTablePreferences(tableId ?? "default")

    const [internalSorting, setInternalSorting] = React.useState<SortingState>(
        savedSorting.length ? savedSorting : [{ id: 'created_at', desc: true }]
    )


    const handleSortingChange: OnChangeFn<SortingState> =
        onSortingChange ??
        ((updaterOrValue) => {
            setInternalSorting((prev) =>
            typeof updaterOrValue === "function"
                ? updaterOrValue(prev)
                : updaterOrValue
            )
        })

const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

const [selectedRowIds, setSelectedRowIds] = React.useState<Record<string, boolean>>({})

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
        const nearBottom = scrollTop + clientHeight >= scrollHeight - 200
        // console.log("SCROLL:", { scrollTop, scrollHeight, clientHeight, nearBottom })

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
    enableRowSelection: true,
    manualPagination: !!pagination,
    pageCount: pagination?.pageCount,
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: handleSortingChange,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
        const newSelection = typeof updater === "function"
            ? updater(selectedRowIds)
            : updater
        setSelectedRowIds(newSelection)
        },
    getRowId: (row) => row.id.toString(),

    initialState: {
        columnSizing,
    },
    state: {
        sorting: sorting ?? internalSorting,
        columnVisibility,
        columnFilters,
        columnSizing,
        rowSelection: selectedRowIds,
        pagination: pagination
        ? {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            }
        : undefined,
    },
    defaultColumn: {
        ...defaultColumnSizing,
        enableResizing: true,
        enableHiding: true,
    },
    onColumnSizingChange: setColumnSizing, // ← wajib
    columnResizeMode: 'onChange', // bisa juga 'onEnd'
    enableColumnResizing: true, // ← penting
    getCoreRowModel: getCoreRowModel(),
})

React.useEffect(() => {
    if (resetRowSelectionSignal) {
        table.resetRowSelection()
        setSelectedRowIds({}) // 🔥 reset juga local state
    }
    }, [resetRowSelectionSignal, table])

    // 2️⃣ Hanya trigger row selection saat benar-benar berubah
    const lastSelectedRef = React.useRef<TData[]>([])

    React.useEffect(() => {
        if (!onRowSelectionChange) return

        const selectedRows = data.filter((row) => selectedRowIds[row.id.toString()])

        const prevIds = new Set(lastSelectedRef.current.map(r => r.id))
        const currIds = new Set(selectedRows.map(r => r.id))

        const isSame = prevIds.size === currIds.size &&
        [...prevIds].every(id => currIds.has(id))

        if (!isSame) {
        lastSelectedRef.current = selectedRows
        onRowSelectionChange(selectedRows)
        }
    }, [selectedRowIds, data, onRowSelectionChange])


    const columnCount = table.getVisibleFlatColumns().length

    return (
            <TableContext.Provider value={table}>
                <div>
                {enableInternalFilter && (
                    <div className="space-y-2 py-4">
                    {/* Filter kolom tetap */}
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
                            {!headerContent && customToolbar && (
                            <DataTableToolbar
                                tableId={tableId ?? "default"}
                                searchValue={customToolbar.searchValue}
                                onSearchChange={customToolbar.onSearchChange}
                                isLoading={customToolbar.isLoading}
                                // selectedRows={customToolbar.selectedRows ?? []}
                                selectedRows={
                                    customToolbar.selectedRows ??
                                    table.getSelectedRowModel().rows.map((r) => r.original)
                                    }
                                onResetSelection={customToolbar.onResetSelection}
                                onBulkDelete={customToolbar.onBulkDelete}
                                onAddClick={customToolbar.onAddClick}
                                addButtonLabel={customToolbar.addButtonLabel}
                                showSearch={customToolbar.showSearch}
                                onExportCSV={customToolbar.onExportCSV}
                                canAdd={customToolbar.canAdd}
                                showAddButton={customToolbar.showAddButton}
                                totalCount={
                                    totalCount ??
                                    (pagination
                                    ? pagination.pageCount * pagination.pageSize
                                    : data.length)
                                }
                            />
                        )}
                    </div>
                )}
                </div>

            <div
                className="relative max-h-[70vh] overflow-y-auto rounded-lg border" ref={tableContainerRef}
            >
                <Table className="min-w-full border-collapse table-auto">
                    <TableHeader className="sticky top-0 z-20 bg-muted dark:bg-zinc-900 border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header, index) => {
                                const isFirstColumn = index === 0; // Menentukan apakah ini kolom pertama

                                return (
                                <TableHead
                                    key={header.id}
                                    className={cn(
                                    "relative group bg-muted dark:bg-zinc-900 px-2",
                                    isFirstColumn ? "w-12" : "",
                                    getColumnWidthClass(header.column) // Menambahkan kelas lebar kolom
                                    )}
                                    style={{ width: header.getSize() }}
                                >
                                    {!header.isPlaceholder && (
                                    <div className="flex items-center justify-between pr-2">
                                        {flexRender(header.column.columnDef.header, header.getContext())}

                                        {header.column.getCanResize() && (
                                        <div
                                            onPointerDown={header.getResizeHandler()}
                                            onDoubleClick={() => header.column.resetSize()}
                                            className={cn(
                                            "absolute right-0 top-0 h-full w-4 flex items-center justify-center cursor-col-resize group",
                                            header.column.getIsResizing() && "bg-muted"
                                            )}
                                        >
                                            <Tally2
                                            aria-label="Resize column"
                                            role="img"
                                            className={cn(
                                                "w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                                                header.column.getIsResizing() && "opacity-100 text-primary"
                                            )}
                                            >
                                            <title>Resize column</title>
                                            </Tally2>
                                        </div>
                                        )}
                                    </div>
                                    )}
                                </TableHead>
                                );
                            })}
                            </TableRow>
                        ))}
                        </TableHeader>


                    <AnimatePresence mode="popLayout">
                        <TableBody>
                        {/* Loading awal */}
                        {customToolbar?.isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                            <TableSkeletonRow key={i} columnCount={columnCount} />
                            ))
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                            <motion.tr className="border-b border-border  min-h-[48px]"
                                key={row.id}
                                data-state={row.getIsSelected() ? "selected" : undefined}
                            >
                                {row.getVisibleCells().map((cell, index) => {
                                const isFirstColumn = index === 0
                                return (
                                    <TableCell
                                    key={cell.id}
                                    style={{ width: cell.column.getSize() }}
                                    className={cn(
                                        isFirstColumn ? "w-12 flex items-center gap-2" : "",
                                        getColumnWidthClass(cell.column),
                                        "py-3 text-sm leading-relaxed"
                                    )}
                                    >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                )
                                })}
                            </motion.tr>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={columnCount} className="h-24 text-center">
                                Tidak ada data.
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </AnimatePresence>

                </Table>
                    {!pagination && visibleRows < data.length && isFetchingMore && (
                        <tfoot>
                            <tr>
                            <td colSpan={columnCount} className="py-4 text-center">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin text-muted-foreground inline-block" />
                                <span className="text-sm text-muted-foreground">Memuat data tambahan...</span>
                            </td>
                            </tr>
                            {Array.from({ length: 3 }).map((_, i) => (
                            <TableSkeletonRow key={`fetch-${i}`} columnCount={columnCount} />
                            ))}
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
                            onPageSizeChange: (size) => {
                            pagination.onPageSizeChange(size)
                            setPageSize(size)
                            },
                            selectedCount: table.getFilteredSelectedRowModel().rows.length,
                            totalCount: totalCount ?? table.getRowModel().rows.length,
                            isLoading: customToolbar?.isLoading ?? false,}
                        : {
                            table,
                        })}
                />

                </div>
            )}
            </TableContext.Provider>
        )
}
