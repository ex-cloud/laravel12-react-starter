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
Table as TanStackTable,
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
import { AnimatePresence } from "framer-motion"

interface DataTableProps<TData extends { id: number | string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    tableId?: string
    filterableColumns?: string[]
    enableInternalFilter?: boolean
    enablePagination?: boolean
    sorting?: SortingState
    onSortingChange?: OnChangeFn<SortingState>
    onTableRef?: (table: TanStackTable<TData>) => void
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
    onSelectedRowIdsChange?: (rowSelection: Record<string, boolean>) => void
    onLoadMore?: () => void // ✅ Tambahkan ini
    hasMore?: boolean
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
onTableRef, // ✅ tambahkan ini
filterableColumns = [],
enableInternalFilter = true,
enablePagination = true,
onRowSelectionChange,
onSelectedRowIdsChange,
resetRowSelectionSignal = false,
headerContent,
customToolbar,
pagination,
tableId,
totalCount,
onLoadMore,
hasMore,
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

    // 1. Inisialisasi jumlah visibleRows saat tidak pakai pagination
    React.useEffect(() => {
    if (!pagination) {
        setVisibleRows(10)
        requestAnimationFrame(() => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
        })
    }
    }, [pagination])

    // 2. Handler infinite scroll (terpisah dari efek di atas)
    React.useEffect(() => {
        const container = tableContainerRef.current
        // console.log("📦 container ref:", container)
    if (!container) return

    const handleScroll = () => {

        if (!container || isFetchingMore || !hasMore) return

        const { scrollTop, scrollHeight, clientHeight } = container
        const nearBottom = scrollTop + clientHeight >= scrollHeight - 200

        if (nearBottom) {
        setIsFetchingMore(true)
        onLoadMore?.()
        }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
    }, [onLoadMore, isFetchingMore, hasMore])

    // 3. Reset `isFetchingMore` saat data baru masuk
    React.useEffect(() => {
    if (!pagination) {
        setIsFetchingMore(false)
    }
    }, [data, pagination])

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
    const newSelection = typeof updater === 'function'
        ? updater(selectedRowIds)
        : updater

    setSelectedRowIds(newSelection)               // ✅ local state internal DataTable
    onSelectedRowIdsChange?.(newSelection)        // ✅ update ke parent
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

// 1️⃣ Untuk passing table ke parent
    React.useEffect(() => {
    if (onTableRef) {
        onTableRef(table)
    }
    }, [table, onTableRef])

    // 2️⃣ Untuk reset selection
    React.useEffect(() => {
        if (resetRowSelectionSignal) {
            table.resetRowSelection()
            setSelectedRowIds({})
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
                {/* <div className="fixed bottom-0 "> */}
                    <div className="py-2 space-y-2">
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

                    <div className="relative rounded-lg border overflow-hidden flex-grow">
                        <div ref={tableContainerRef} className="max-h-[70vh] overflow-y-auto">
                            <Table className="min-w-full table-fixed border-collapse">
                                <TableHeader className="sticky top-0 z-20 bg-muted dark:bg-zinc-900 backdrop-blur-sm">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            // const isFirstColumn = index === 0; // Menentukan apakah ini kolom pertama
                                            return (
                                            <TableHead
                                                key={header.id}
                                                className={cn(
                                                "relative group bg-muted dark:bg-zinc-900 px-2",
                                                    getColumnWidthClass(header.column)
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
                                        <TableRow
                                            className="h-10 items-center"
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
                                                    isFirstColumn
                                                        ? "h-16 flex items-center justify-center px-2"
                                                        : "py-2 text-sm leading-relaxed",
                                                    getColumnWidthClass(cell.column)
                                                )}
                                                >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            )
                                            })}
                                        </TableRow>
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
                            </Table>
                        </div>

                    </div>

                    {enablePagination && (
                        <div className="py-4 mt-auto">
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
                {/* </div> */}
            </TableContext.Provider>

        )
}
